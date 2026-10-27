import interact from 'interactjs';
import {Component, h, Element, Event, EventEmitter, Fragment, Host, Listen, Prop, State, Watch} from '@stencil/core';
import {getDataCatalog, getDataCatalogs, IDataCatalog, IDataCatalogEntry, saveDataCatalogEntries, TDataCatalogEntryType} from '@verdocs/js-sdk';
import {createField, deleteField, getTemplate, IDropdownOption, integerSequence, ITemplate, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {defaultHeight, defaultWidth, getFieldId, removeCssTransform, setControlStyles, updateCssTransform} from '../../../utils/utils';
import {AlignLeftIcon, CloseIcon, DataIcon, DocumentPageIcon, DuplicateIcon, PencilIcon, ResetIcon, SettingsIcon, SpaceEvenlyIcon, TrashIcon} from '../../../utils/Icons';
import {drawRecipientField, FIELD_TYPES, radioGroup, recipientNumber} from '../../../utils/RecipientFields';
import {TEXT_FORMATS} from '../../../utils/FieldFormats';
import {IDocumentPageInfo} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

// We include multiline because a text field's height controls it, so undoing a resize has to restore both.
type TFieldGeometry = Pick<ITemplateField, 'x' | 'y' | 'width' | 'height' | 'page' | 'multiline'>;

const GEOMETRY_KEYS: (keyof TFieldGeometry)[] = ['x', 'y', 'width', 'height', 'page', 'multiline'];

// We save a burst of arrow-key nudges once the keys go quiet instead of on every press.
const NUDGE_SAVE_DELAY_MS = 400;

const MAX_UNDO = 50;

// How close (in screen pixels) an edge has to come to another field's edge before it snaps.
const SNAP_PX = 5;

const isTypingTarget = (el: Element | null) => !!el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || (el as HTMLElement).isContentEditable);

const defaultRequired = (type: TFieldType) => !['radio', 'attachment', 'checkbox'].includes(type);

// Field types that can take a data key, and the kinds of catalog key each one fits.
const KEY_FITS: Partial<Record<TFieldType, TDataCatalogEntryType[]>> = {textbox: ['text'], date: ['date'], checkbox: ['boolean'], radio: ['choice'], dropdown: ['choice']};

// Which Inspector sections start open, and where we remember each person's choices.
const SECTIONS_OPEN_BY_DEFAULT = ['group', 'options', 'format', 'text', 'checkbox'];
const SECTIONS_STORAGE_KEY = 'verdocs-builder-inspector-sections';

const readOpenSections = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(SECTIONS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const TEXT_CASES = [
  ['', 'As typed'],
  ['upper', 'UPPERCASE'],
  ['lower', 'lowercase'],
];

const DATA_KEY_PATTERN = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*$/;

const humanizeKey = (key: string) => {
  const words = (key.split('.').pop() || key).replace(/[_-]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};


// Lines a rect up with the left or right edge, and the top or vertical center, of the nearest other field.
const snapRect = (rect: {left: number; top: number; width: number; height: number}, others: DOMRect[]) => {
  let dx = 0;
  let dy = 0;
  let guideX: number | null = null;
  let guideY: number | null = null;
  others.forEach(other => {
    if (guideX === null) {
      if (Math.abs(other.left - rect.left) <= SNAP_PX) {
        dx = other.left - rect.left;
        guideX = other.left;
      } else if (Math.abs(other.right - (rect.left + rect.width)) <= SNAP_PX) {
        dx = other.right - (rect.left + rect.width);
        guideX = other.right;
      }
    }

    if (guideY === null) {
      const otherCenter = other.top + other.height / 2;
      const center = rect.top + rect.height / 2;
      if (Math.abs(otherCenter - center) <= SNAP_PX) {
        dy = otherCenter - center;
        guideY = otherCenter;
      } else if (Math.abs(other.top - rect.top) <= SNAP_PX) {
        dy = other.top - rect.top;
        guideY = other.top;
      }
    }
  });

  return {dx, dy, guideX, guideY};
};

/**
 * The fields step of `verdocs-builder`: drag fields from the palette onto the page, line them up with snap guides, adjust the
 * common settings from a quick bar over the selected field, and open the rest in a settings panel. Like `verdocs-template-fields`,
 * it needs a large display area, so it's intended for desktop use.
 */
@Component({
  tag: 'verdocs-builder-fields',
  styleUrl: 'verdocs-builder-fields.scss',
  shadow: false,
})
export class VerdocsBuilderFields {
  private templateListenerId = null;

  private pagesEl: HTMLElement | null = null;

  private quickBarEl: HTMLElement | null = null;

  @Element() el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Draws fields for people who need more contrast: recipient numbers, darker borders and labels, and outlines in place of
   * color to show selection. `auto` follows the browser's contrast setting.
   */
  @Prop() contrast: 'auto' | 'normal' | 'high' = 'auto';

  /**
   * The ID of the template to edit.
   */
  @Prop({reflect: true, mutable: true}) templateId: string | null = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: 'added-field' | 'updated-field' | 'deleted-field'}>;

  @State() loading = true;
  @State() template: ITemplate | null = null;
  @State() selectedRoleName = '';
  @State() showMustSelectRole = false;
  @State() selectedFieldName: string | null = null;
  @State() inspectorOpen = false;
  @State() signerMenuOpen = false;
  @State() renaming = false;

  // Bumped to remount the settings form, which resets any edits that weren't saved.
  @State() nameError = '';
  @State() groupError = '';
  @State() formatError = '';
  @State() patternField = '';
  @State() optionsDraft: {name: string; options: IDropdownOption[]} | null = null;
  @State() catalog: IDataCatalog | null = null;
  @State() fillMenuOpen = false;
  @State() fillSearch = '';
  @State() openSections: Record<string, boolean> = readOpenSections();
  @State() advancedSections: Record<string, boolean> = {};
  catalogLoadedFor: string | null = null;

  // Undo entries are recorded only once their save lands, so the stack never holds a change the server didn't take.
  undoStack: {name: string; before: TFieldGeometry}[] = [];
  pendingNudge: {name: string; before: TFieldGeometry; x: number; y: number} | null = null;
  nudgeTimer: ReturnType<typeof setTimeout> | null = null;
  dragBefore: {name: string; before: TFieldGeometry} | null = null;

  // Geometry we've sent but the server hasn't confirmed yet, so a new nudge or undo starts from where the field is drawn.
  optimistic = new Map<string, Partial<TFieldGeometry>>();
  inFlight = new Set<Promise<unknown>>();

  // Field components save their own resizes and announce them with settingsChanged; undo waits for that.
  pendingResizes = new Map<string, {before: TFieldGeometry; settle: () => void; done: Promise<void>}>();

  cachedPageInfo: Record<string, Record<number, IDocumentPageInfo>> = {};

  paletteDrag: {
    type: TFieldType;
    roleName: string;
    ghost: HTMLElement;
    width: number;
    height: number;
    over: {documentId: string; pageNumber: number; viewX: number; viewBottom: number} | null;
  } | null = null;

  // Stable references so makeDraggable can re-bind them on every render without stacking duplicates.
  handleFieldTap = (e: any) => this.selectField(e.currentTarget?.getAttribute?.('fieldname') || null);
  handleFieldResizeStart = (e: any) => {
    const name = e.target?.getAttribute?.('fieldname') || null;
    this.flushNudge();
    this.selectField(name);
    this.startResize(name);
  };

  handleWindowResize = () => this.positionQuickBar();

  @Watch('templateId')
  onTemplateIdChanged() {
    this.listenToTemplate();
  }

  // Escape closes the open menu, cancels a drag, or clears the selection. Arrows nudge (Shift for 10pt), Cmd/Ctrl+Z undoes a
  // move or resize, and Cmd/Ctrl+D duplicates.
  @Listen('keydown', {target: 'document'})
  handleKeyDown(ev: KeyboardEvent) {
    // composedPath reaches inputs inside a host page's shadow DOM, where activeElement would only show the host.
    const target = (ev.composedPath?.()[0] || ev.target) as Element;
    if (ev.key === 'Escape' && isTypingTarget(target) && target.closest?.('.inspector')) {
      return;
    }

    if (ev.key === 'Escape') {
      if (this.signerMenuOpen || this.renaming) {
        this.signerMenuOpen = false;
        this.renaming = false;
      } else if (this.paletteDrag) {
        this.endPaletteDrag();
      } else {
        this.selectField(null);
      }
      return;
    }

    if (ev.defaultPrevented || isTypingTarget(target)) {
      return;
    }

    // Keys pressed in a dialog, menu, or anything else outside the builder belong to that control.
    if (target !== document.body && target !== document.documentElement && !this.el.contains(target)) {
      return;
    }

    const command = (ev.metaKey || ev.ctrlKey) && !ev.shiftKey && !ev.altKey;
    if (command && ev.key.toLowerCase() === 'z') {
      if (this.pendingNudge || this.undoStack.length > 0 || this.inFlight.size > 0 || this.pendingResizes.size > 0) {
        ev.preventDefault();
        this.undo();
      }
      return;
    }

    const selected = this.findField(this.selectedFieldName);
    if (command && ev.key.toLowerCase() === 'd') {
      if (selected) {
        ev.preventDefault();
        this.duplicateField(selected);
      }
      return;
    }

    const step = ev.shiftKey ? 10 : 1;
    const delta = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step]}[ev.key];
    if (!delta || !selected || ev.metaKey || ev.ctrlKey || ev.altKey) {
      return;
    }

    // Once the selected field has scrolled out of view, arrows go back to scrolling the page.
    const rect = document.getElementById(getFieldId(selected))?.getBoundingClientRect();
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
      this.selectField(null);
      return;
    }

    ev.preventDefault();
    this.nudge(delta[0], delta[1]);
  }

  @Listen('settingsChanged')
  handleFieldSettingsChanged(e: CustomEvent<{fieldName: string; field: ITemplateField}>) {
    const {fieldName, field} = e.detail || ({} as any);
    if (field && fieldName && field.name !== fieldName) {
      this.renameFieldState(fieldName, field.name);
    }

    const resize = field ? this.pendingResizes.get(field.name) : null;
    if (resize) {
      this.recordUndo(field.name, resize.before, field);
      resize.settle();
    }

    this.templateUpdated?.emit({endpoint: this.endpoint, template: this.template, event: 'updated-field'});
  }

  @Watch('contrast')
  applyContrast() {
    this.el.classList.remove('contrast-high', 'contrast-normal');
    if (this.contrast === 'high' || this.contrast === 'normal') {
      this.el.classList.add(`contrast-${this.contrast}`);
    }
  }

  async componentWillLoad() {
    this.applyContrast();
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[BUILDER] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[BUILDER] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[BUILDER] Error with fields session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidLoad() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidRender() {
    interact.dynamicDrop(true);

    // Returning from the Preview tab can leave fields without their interact bindings, and pageRendered doesn't always refire.
    this.el.querySelectorAll('.verdocs-field').forEach((el: HTMLElement) => {
      this.makeDraggable(el);
      const field = this.findField(el.getAttribute('fieldname'));
      if (field) {
        this.decorateField(el, field);
      }
    });

    this.applySelection();
    this.positionQuickBar();
  }

  // Stencil doesn't rerun componentWillLoad when an element is reattached, so we listen again here.
  connectedCallback() {
    if (this.template && !this.templateListenerId) {
      this.listenToTemplate();
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
    this.flushNudge();
    this.endPaletteDrag();
    window.removeEventListener('resize', this.handleWindowResize);
  }

  async listenToTemplate() {
    this.unlistenToTemplate();
    // We reload in case the host app changed the template outside the Store.
    this.templateListenerId = Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      true,
      (template: ITemplate) => {
        this.template = template;
        this.loading = false;
        if (this.catalogLoadedFor !== (template.data_catalog_id || '')) {
          this.loadCatalog(template);
        }
        if (this.selectedFieldName && !this.findField(this.selectedFieldName)) {
          this.selectedFieldName = null;
        }
      },
    );
  }

  async loadCatalog(template: ITemplate) {
    this.catalogLoadedFor = template.data_catalog_id || '';
    try {
      const catalogs = await getDataCatalogs(this.endpoint, template.organization_id);
      const chosen = catalogs.find(catalog => catalog.id === template.data_catalog_id) || catalogs.find(catalog => catalog.is_default);
      this.catalog = chosen ? await getDataCatalog(this.endpoint, template.organization_id, chosen.id) : null;
    } catch (e) {
      // Personal accounts can't have catalogs, so their fields just take typed keys.
      console.log('[BUILDER] Unable to load the data catalog', e.response?.status);
      this.catalog = null;
    }
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  sortedRoles() {
    return [...(this.template?.roles || [])].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }

  // We use the first role until the user picks one.
  paletteRoleName() {
    const roles = this.sortedRoles();
    return roles.find(role => role.name === this.selectedRoleName)?.name || roles[0]?.name || '';
  }

  roleNumber(roleName: string) {
    return recipientNumber(this.template?.roles, roleName);
  }

  roleColor(roleName: string) {
    return `var(--verdocs-recipient-${this.roleNumber(roleName)})`;
  }

  roleTextColor(roleName: string) {
    return `var(--verdocs-recipient-${this.roleNumber(roleName)}-text)`;
  }

  decorateField(el: HTMLElement, field: ITemplateField) {
    drawRecipientField(el, field, this.template, this.cachedPageInfo[field.document_id]?.[field.page]?.xScale);
  }

  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    this.cachedPageInfo[pageInfo.documentId] ??= {};
    this.cachedPageInfo[pageInfo.documentId][pageInfo.pageNumber] = pageInfo;

    (this.template?.fields || [])
      .filter(field => field && field.page === pageInfo.pageNumber)
      .forEach(field => {
        const el = document.getElementById(getFieldId(field));
        // Field IDs repeat across components, and a page can finish rendering after we've unmounted, so we only touch our own.
        if (el && this.el.contains(el)) {
          el.setAttribute('templateid', this.templateId);
          el.setAttribute('fieldname', field.name);
          el.setAttribute('documentid', String(field.document_id));
          el.setAttribute('pagenumber', String(field.page));
          el.setAttribute('xScale', String(pageInfo.xScale));
          el.setAttribute('yScale', String(pageInfo.yScale));
          this.makeDraggable(el);
          this.decorateField(el, field);
        }
      });

    this.applySelection();
    this.positionQuickBar();
  }

  makeDraggable(el: HTMLElement) {
    interact(el)
      .draggable({
        listeners: {
          start: this.handleMoveStart.bind(this),
          move: this.handleMoveField.bind(this),
          end: this.handleMoveEnd.bind(this),
        },
      })
      .off('tap', this.handleFieldTap)
      .on('tap', this.handleFieldTap)
      .off('resizestart', this.handleFieldResizeStart)
      .on('resizestart', this.handleFieldResizeStart);
  }

  findField(name: string | null) {
    return name ? (this.template?.fields || []).find(field => field.name === name) : undefined;
  }

  groupMembers(field: ITemplateField) {
    return radioGroup(this.template?.fields, field);
  }

  // Where the field is drawn right now: its saved geometry plus anything still on its way to the server.
  currentGeometry(field: ITemplateField): TFieldGeometry {
    const {x, y, width, height, page, multiline} = {...field, ...this.optimistic.get(field.name)};
    return {x, y, width, height, page, multiline};
  }

  selectField(name: string | null) {
    if (this.pendingNudge && this.pendingNudge.name !== name) {
      this.flushNudge();
    }

    if (name !== this.selectedFieldName) {
      this.signerMenuOpen = false;
      this.fillMenuOpen = false;
      this.fillSearch = '';
      this.renaming = false;
      this.nameError = '';
      this.groupError = '';
      this.formatError = '';
      this.patternField = '';
      this.optionsDraft = null;
    }

    this.selectedFieldName = name;
    this.applySelection();
  }

  applyDataMarks() {
    const known = new Set((this.catalog?.entries || []).map(entry => entry.key));
    (this.template?.fields || []).forEach(field => {
      const el = document.getElementById(getFieldId(field));
      if (el && this.el.contains(el)) {
        el.classList.toggle('vb-bound', !!field.data_key);
        el.classList.toggle('vb-unknown-key', !!field.data_key && !!this.catalog && !known.has(field.data_key));
      }
    });
  }

  applySelection() {
    this.applyDataMarks();
    this.el.querySelectorAll('.verdocs-field-selected, .vb-group-member').forEach(el => el.classList.remove('verdocs-field-selected', 'vb-group-member'));
    this.el.querySelectorAll('.vb-order, .vb-add-option, .vb-corner').forEach(el => el.remove());
    const field = this.findField(this.selectedFieldName);
    if (!field) {
      return;
    }

    const fieldEl = document.getElementById(getFieldId(field));
    fieldEl?.classList.add('verdocs-field-selected');
    if (fieldEl?.querySelector('.edge-right, .resize-grip')) {
      for (const corner of ['edge-top edge-left', 'edge-top edge-right', 'edge-bottom edge-left', 'edge-bottom edge-right']) {
        fieldEl.insertAdjacentHTML('beforeend', `<span class="${corner} vb-corner"></span>`);
      }
    }
    if (field.type !== 'radio') {
      return;
    }

    // A selected radio shows its whole group, numbered in order, with a button under the last option to add the next one.
    const members = this.groupMembers(field);
    let lastEl: HTMLElement | null = null;
    for (const [index, member] of members.entries()) {
      const el = document.getElementById(getFieldId(member));
      if (el && this.el.contains(el)) {
        if (member.name !== field.name) {
          el.classList.add('vb-group-member');
        }
        el.querySelector('.vb-face')?.insertAdjacentHTML('beforeend', `<span class="vb-order">${index + 1}</span>`);
        lastEl = index === members.length - 1 ? el : null;
      }
    }

    const layer = lastEl?.parentElement;
    if (lastEl && layer) {
      const lastRect = lastEl.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'vb-add-option';
      add.title = `Add option ${members.length + 1}`;
      add.setAttribute('aria-label', add.title);
      add.textContent = '+';
      add.style.left = `${lastRect.left - layerRect.left + lastRect.width / 2}px`;
      add.style.top = `${lastRect.bottom - layerRect.top + 6}px`;
      add.addEventListener('pointerdown', e => e.stopPropagation());
      add.addEventListener('click', e => {
        e.stopPropagation();
        this.addOption(this.findField(field.name) || field);
      });
      layer.appendChild(add);
    }
  }

  // Sits above the selected field, or below it when there's no room above.
  positionQuickBar() {
    const field = this.findField(this.selectedFieldName);
    const fieldEl = field ? document.getElementById(getFieldId(field)) : null;
    if (!this.quickBarEl || !this.pagesEl || !fieldEl) {
      return;
    }

    const fieldRect = fieldEl.getBoundingClientRect();
    const pagesRect = this.pagesEl.getBoundingClientRect();
    const above = fieldRect.top - pagesRect.top - this.quickBarEl.offsetHeight - 8;
    const left = Math.max(4, Math.min(fieldRect.left - pagesRect.left, pagesRect.width - this.quickBarEl.offsetWidth - 4));
    this.quickBarEl.style.left = `${left}px`;
    this.quickBarEl.style.top = `${above >= 4 ? above : fieldRect.bottom - pagesRect.top + 8}px`;
  }

  showGuides(layer: Element, guideX: number | null, guideY: number | null) {
    this.clearGuides();
    const layerRect = layer.getBoundingClientRect();
    if (guideX !== null) {
      layer.insertAdjacentHTML('beforeend', `<div class="verdocs-builder-guide vertical" style="left:${guideX - layerRect.left}px"></div>`);
    }

    if (guideY !== null) {
      layer.insertAdjacentHTML('beforeend', `<div class="verdocs-builder-guide horizontal" style="top:${guideY - layerRect.top}px"></div>`);
    }
  }

  clearGuides() {
    this.el.querySelectorAll('.verdocs-builder-guide').forEach(guide => guide.remove());
  }

  recordUndo(name: string, before: TFieldGeometry, after: Partial<TFieldGeometry>) {
    if (GEOMETRY_KEYS.some(key => after[key] !== undefined && after[key] !== before[key])) {
      this.undoStack.push({name, before});
      this.undoStack.splice(0, Math.max(0, this.undoStack.length - MAX_UNDO));
    }
  }

  startResize(name: string | null) {
    const field = this.findField(name);
    if (!field) {
      return;
    }

    this.pendingResizes.get(field.name)?.settle();
    let settle: () => void;
    const done = new Promise<void>(resolve => (settle = resolve));
    const entry = {before: this.currentGeometry(field), settle: () => settle(), done};
    this.pendingResizes.set(field.name, entry);

    // A failed resize never announces itself, so stop waiting on it after a while.
    const timer = setTimeout(() => entry.settle(), 5000);
    done.then(() => {
      clearTimeout(timer);
      if (this.pendingResizes.get(field.name) === entry) {
        this.pendingResizes.delete(field.name);
      }
    });
  }

  renameFieldState(oldName: string, newName: string) {
    this.undoStack.forEach(entry => entry.name === oldName && (entry.name = newName));
    if (this.selectedFieldName === oldName) {
      this.selectedFieldName = newName;
    }
  }

  forgetField(name: string) {
    this.undoStack = this.undoStack.filter(entry => entry.name !== name);
    this.optimistic.delete(name);
    this.pendingResizes.get(name)?.settle();
    if (this.pendingNudge?.name === name) {
      clearTimeout(this.nudgeTimer);
      this.nudgeTimer = null;
      this.pendingNudge = null;
    }
    if (this.selectedFieldName === name) {
      this.selectField(null);
    }
  }

  drawField(field: ITemplateField, geometry: Partial<TFieldGeometry> = {}) {
    const pageInfo = this.cachedPageInfo[field.document_id]?.[geometry.page ?? field.page];
    const el = document.getElementById(getFieldId(field));
    if (el && pageInfo) {
      setControlStyles(el, {...field, ...geometry}, pageInfo.xScale, pageInfo.yScale);
    }
    this.applySelection();
    this.positionQuickBar();
  }

  nudge(dx: number, dy: number) {
    const field = this.findField(this.selectedFieldName);
    if (!field || !document.getElementById(getFieldId(field)) || !this.cachedPageInfo[field.document_id]?.[field.page]) {
      return;
    }

    if (this.pendingNudge?.name !== field.name) {
      this.flushNudge();
      const before = this.currentGeometry(field);
      this.pendingNudge = {name: field.name, before, x: before.x, y: before.y};
    }

    // Keep the whole field on the page, measured in PDF points.
    const pageSize = (this.template?.documents || []).find(doc => doc.id === field.document_id)?.page_sizes?.[field.page];
    const maxX = (pageSize?.width || 612) - (field.width || defaultWidth(field.type));
    const maxY = (pageSize?.height || 792) - (field.height || defaultHeight(field.type));
    this.pendingNudge.x = Math.min(Math.max(this.pendingNudge.x + dx, 0), maxX);
    this.pendingNudge.y = Math.min(Math.max(this.pendingNudge.y + dy, 0), maxY);
    this.drawField(field, {x: this.pendingNudge.x, y: this.pendingNudge.y});

    if (this.nudgeTimer) {
      clearTimeout(this.nudgeTimer);
    }
    this.nudgeTimer = setTimeout(() => this.flushNudge(), NUDGE_SAVE_DELAY_MS);
  }

  async flushNudge() {
    if (this.nudgeTimer) {
      clearTimeout(this.nudgeTimer);
      this.nudgeTimer = null;
    }

    const pending = this.pendingNudge;
    this.pendingNudge = null;
    if (pending) {
      await this.saveField(pending.name, {x: pending.x, y: pending.y}, pending.before);
    }
  }

  async undo() {
    await this.flushNudge();
    await Promise.all([...this.inFlight, ...[...this.pendingResizes.values()].map(resize => resize.done)]);

    while (this.undoStack.length > 0) {
      const {name, before} = this.undoStack.pop();
      const field = this.findField(name);
      if (field && GEOMETRY_KEYS.some(key => field[key] !== before[key])) {
        this.selectField(name);
        await this.saveField(name, before);
        return;
      }
    }
  }

  // Saves any change to a field, drawing it at its new spot right away. Pass `before` to make a geometry change undoable.
  saveField(name: string, changes: Partial<ITemplateField>, before?: TFieldGeometry) {
    const field = this.findField(name);
    if (!field) {
      return Promise.resolve();
    }

    const sent = {...changes};
    this.optimistic.set(name, sent);
    this.drawField(field, changes);

    const save = (async () => {
      try {
        const updatedField = await updateField(this.endpoint, this.templateId, name, changes);
        const newTemplate = JSON.parse(JSON.stringify(this.template));
        const fieldIndex = newTemplate.fields.findIndex(field => field.name === name);
        if (fieldIndex > -1) {
          newTemplate.fields[fieldIndex] = updatedField;
        }

        Store.updateTemplate(this.templateId, newTemplate);
        this.drawField(updatedField);
        if (before) {
          this.recordUndo(name, before, updatedField);
        }

        this.templateUpdated?.emit({endpoint: this.endpoint, template: newTemplate, event: 'updated-field'});
      } catch (e) {
        console.log('[BUILDER] Error saving field', e);
        VerdocsToast(e.response?.data?.error || 'Unable to save the field. Please try again.', {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));

        // Put it back where the server still has it.
        const saved = this.findField(name);
        if (saved) {
          this.drawField(saved);
        }
      } finally {
        if (this.optimistic.get(name) === sent) {
          this.optimistic.delete(name);
        }
      }
    })();

    this.inFlight.add(save);
    save.finally(() => this.inFlight.delete(save));
    return save;
  }

  async addField(field: ITemplateField) {
    try {
      const newField = await createField(this.endpoint, this.templateId, field);
      const newTemplate = JSON.parse(JSON.stringify(this.template));
      newTemplate.fields.push(newField);

      Store.updateTemplate(this.templateId, newTemplate);
      this.templateUpdated?.emit({endpoint: this.endpoint, template: newTemplate, event: 'added-field'});
      this.selectField(newField.name);
    } catch (e) {
      console.log('[BUILDER] Error adding field', e);
      VerdocsToast(e.response?.data?.error || 'Unable to add the field. Please try again.', {style: 'error'});
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  // A copy directly below the original, lined up with it. A radio's copy is the next option in its group.
  duplicateField(field: ITemplateField) {
    if (field.type === 'radio') {
      return this.addOption(field);
    }

    const height = field.height || defaultHeight(field.type);
    return this.addField({...field, name: this.generateFieldName(field.type, field.page), y: Math.max(0, field.y - height - 10)});
  }

  // Radio group keys are generated, and a radio placed before groups existed gets one when it gains a second option.
  generateGroupName() {
    const used = new Set((this.template?.fields || []).map(field => field.group));
    let i = 1;
    while (used.has(`choice${i}`)) {
      i++;
    }

    return `choice${i}`;
  }

  async addOption(field: ITemplateField) {
    const members = this.groupMembers(field);
    const last = members[members.length - 1];
    let group = field.group;
    if (!group) {
      group = this.generateGroupName();
      await this.saveField(field.name, {group});
    }

    const n = members.length + 1;
    const height = last.height || defaultHeight('radio');
    return this.addField({
      ...last,
      group,
      name: this.generateFieldName('radio', last.page),
      label: null,
      default: 'false',
      y: Math.max(0, last.y - height - 6),
      options: [{id: `option-${n}`, label: `Option ${n}`}],
    });
  }

  // Settings that belong to a radio group go to every option in it.
  async saveGroup(field: ITemplateField, changes: Partial<ITemplateField>) {
    for (const member of this.groupMembers(field)) {
      await this.saveField(member.name, changes);
    }
  }

  async fillWith(field: ITemplateField, key: string | null, changes: Partial<ITemplateField> = {}) {
    this.fillMenuOpen = false;
    this.fillSearch = '';
    const members = this.groupMembers(field);
    // A key another field already fills starts read-only here, so a signer fixes a typo in one place.
    const repeated = !!key && (this.template?.fields || []).some(other => other.data_key === key && !members.some(member => member.name === other.name));
    await this.saveGroup(field, {data_key: key, ...(repeated ? {readonly: true} : {}), ...changes});
  }

  async addToCatalog(field: ITemplateField, key: string) {
    const catalog = this.catalog;
    try {
      await saveDataCatalogEntries(this.endpoint, catalog.organization_id, catalog.id, [{key, label: humanizeKey(key), type: KEY_FITS[field.type]?.[0] || 'text'}]);
      this.catalog = await getDataCatalog(this.endpoint, catalog.organization_id, catalog.id);
    } catch (e) {
      VerdocsToast(e.response?.data?.message || `Unable to add ${key} to ${catalog.name}.`, {style: 'error'});
      return;
    }

    await this.fillWith(field, key);
  }

  async resetField(field: ITemplateField) {
    for (const member of this.groupMembers(field)) {
      await this.saveField(
        member.name,
        {
          width: defaultWidth(member.type),
          height: defaultHeight(member.type),
          multiline: false,
          required: defaultRequired(member.type),
          readonly: false,
        },
        this.currentGeometry(member),
      );
    }
  }

  saveRename(field: ITemplateField, label: string) {
    this.renaming = false;
    if (label.trim() !== (field.label || '')) {
      this.saveField(field.name, {label: label.trim() || null});
    }
  }

  // A read-only field can't be required, so turning either on turns the other off.
  toggleRequired(field: ITemplateField) {
    return this.saveGroup(field, {required: !field.required, readonly: field.required ? field.readonly : false});
  }

  toggleReadonly(field: ITemplateField) {
    return this.saveGroup(field, {readonly: !field.readonly, required: field.readonly ? field.required : false});
  }

  // Field names are unique, and selection and undo history follow a field by its name.
  async saveFieldName(field: ITemplateField, value: string) {
    const name = value.trim();
    this.nameError = '';
    if (name === field.name) {
      return;
    }

    if (!name) {
      this.nameError = 'Enter a field name.';
      return;
    }

    if ((this.template?.fields || []).some(other => other.name === name)) {
      this.nameError = `A field named "${name}" already exists in this template.`;
      return;
    }

    // We move the selection first, because a template update drops a selection whose field has disappeared.
    this.renameFieldState(field.name, name);
    await this.saveField(field.name, {name});
    if (!this.findField(name)) {
      this.renameFieldState(name, field.name);
    }
  }

  // A loose radio can join an existing group by its name, but renaming a whole group onto another one would merge them.
  async saveGroupName(field: ITemplateField, value: string) {
    const group = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const members = this.groupMembers(field);
    this.groupError = '';
    if (group === (field.group || '')) {
      return;
    }

    if (!group) {
      this.groupError = 'Enter a group name.';
      return;
    }

    if (members.length > 1 && (this.template?.fields || []).some(other => other.group === group && !members.includes(other))) {
      this.groupError = `Another group is already named "${group}".`;
      return;
    }

    await this.saveGroup(field, {group});
  }

  // Only one option in a group can start out selected.
  async savePreselected(field: ITemplateField, name: string) {
    const members = this.groupMembers(field);
    const chosen = members.find(member => member.name === name);
    if (chosen && chosen.default !== 'true') {
      await this.saveField(chosen.name, {default: 'true'});
    }

    for (const member of members) {
      if (member !== chosen && member.default === 'true') {
        await this.saveField(member.name, {default: 'false'});
      }
    }
  }

  // Lines the options up on their left edges, or spaces them evenly between the first and the last.
  async arrangeGroup(field: ITemplateField, arrangement: 'align' | 'space') {
    const members = this.groupMembers(field);
    const x = Math.min(...members.map(member => member.x));
    const top = members[0].y;
    const step = (members[members.length - 1].y - top) / Math.max(members.length - 1, 1);
    for (const [index, member] of members.entries()) {
      const position = arrangement === 'align' ? {x, y: member.y} : {x: member.x, y: Math.round(top + step * index)};
      if (position.x !== member.x || position.y !== member.y) {
        await this.saveField(member.name, position, this.currentGeometry(member));
      }
    }
  }

  draftOptions(field: ITemplateField) {
    return this.optionsDraft?.name === field.name ? this.optionsDraft.options : field.options || [];
  }

  // Blank rows are dropped, and an option without an ID takes one from its label.
  saveOptions(field: ITemplateField, draft: IDropdownOption[]) {
    const rows = draft.map(option => {
      const label = (option.label || '').trim();
      return {id: (option.id || '').trim() || label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), label};
    });
    const options = rows.filter(option => option.id || option.label);

    this.optionsDraft = {name: field.name, options: rows};
    if (options.length > 0 && JSON.stringify(options) !== JSON.stringify(field.options || [])) {
      this.saveField(field.name, {options});
    }
  }

  async deleteFields(fields: ITemplateField[]) {
    for (const field of fields) {
      try {
        await deleteField(this.endpoint, this.templateId, field.name);
      } catch (e) {
        console.log('[BUILDER] Error deleting field', e);
        VerdocsToast(e.response?.data?.error || 'Unable to delete the field. Please try again.', {style: 'error'});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        return;
      }

      const selected = this.selectedFieldName === field.name;
      const newTemplate = JSON.parse(JSON.stringify(this.template));
      newTemplate.fields = newTemplate.fields.filter(other => other.name !== field.name);
      Store.updateTemplate(this.templateId, newTemplate);
      if (selected) {
        this.selectField(null);
      }
      this.handleInspectorDelete(field.name);
    }
  }

  // Removing the selected option moves the selection to another one, so the group stays open.
  async removeOption(field: ITemplateField, option: ITemplateField) {
    const next = option.name === this.selectedFieldName ? this.groupMembers(field).find(member => member.name !== option.name) : null;
    await this.deleteFields([option]);
    if (next && this.findField(next.name)) {
      this.selectField(next.name);
    }
  }

  handleMoveStart(event: any) {
    const name = event.target.getAttribute('fieldname');
    this.flushNudge();
    this.selectField(name);
    this.el.classList.add('moving');

    const field = this.findField(name);
    this.dragBefore = field ? {name, before: this.currentGeometry(field)} : null;
  }

  handleMoveField(event: any) {
    const el = event.target as HTMLElement;
    const xScale = +(el.getAttribute('xScale') || 1);
    const yScale = +(el.getAttribute('yScale') || 1);
    const rawX = event.dx / xScale + +(el.getAttribute('posX') || 0);
    const rawY = event.dy / yScale + +(el.getAttribute('posY') || 0);
    el.setAttribute('posX', String(rawX));
    el.setAttribute('posY', String(rawY));
    updateCssTransform(el, 'translate', `${rawX}px, ${rawY}px`);

    // We keep the raw position in posX/posY and only offset the drawn one, so snapping never accumulates.
    const layer = el.parentElement;
    const others = [...layer.querySelectorAll('.verdocs-field')].filter(other => other !== el).map(other => other.getBoundingClientRect());
    const {dx, dy, guideX, guideY} = snapRect(el.getBoundingClientRect(), others);
    if (dx || dy) {
      updateCssTransform(el, 'translate', `${rawX + dx / xScale}px, ${rawY + dy / yScale}px`);
    }
    this.showGuides(layer, guideX, guideY);
  }

  async handleMoveEnd(event: any) {
    this.clearGuides();
    this.el.classList.remove('moving');

    const name = event.target.getAttribute('fieldname');
    const field = this.findField(name);
    if (!field) {
      console.log('[BUILDER] Unable to find field', name, event.target);
      return;
    }

    // From the field rather than the element's attributes, which a field dropped since the last page render doesn't have yet.
    const documentId = field.document_id;
    const pageNumber = this.currentGeometry(field).page;
    let {naturalWidth = 612, naturalHeight = 792, renderedHeight = 792} = this.cachedPageInfo[documentId][pageNumber];
    const clientRect = event.target.getBoundingClientRect();
    const parentRect = event.target.parentElement.getBoundingClientRect();

    const width = field.width || defaultWidth(field.type);
    const height = field.height || defaultHeight(field.type);

    // These two being backwards is not a mistake. Left measures "over" from the left
    // (positive displacement) while bottom measures "up" from the bottom (negative displacement).
    const newX = Math.max(clientRect.left - parentRect.left, 0);
    let newY = Math.max(renderedHeight - (parentRect.bottom - clientRect.bottom), 0);

    let newPageNumber = pageNumber;
    if (newY > renderedHeight) {
      newPageNumber = Math.min(newPageNumber + 1, (this.template?.documents || [])?.[0]?.pages || 1);
      newY -= renderedHeight;
      renderedHeight = this.cachedPageInfo[documentId][newPageNumber].renderedHeight;
    } else if (newY < 0) {
      newPageNumber = Math.max(newPageNumber - 1, 1);
      renderedHeight = this.cachedPageInfo[documentId][newPageNumber].renderedHeight;
      newY += renderedHeight;
    }

    const {x, y} = this.viewCoordinatesToPageCoordinates(newX, newY, documentId, pageNumber, naturalWidth - width, naturalHeight - height);
    event.target.removeAttribute('posX');
    event.target.removeAttribute('posY');
    removeCssTransform(event.target);

    const before = this.dragBefore?.name === name ? this.dragBefore.before : undefined;
    this.dragBefore = null;
    await this.saveField(name, {x, y, page: newPageNumber}, before);
  }

  generateFieldName(type: string, pageNumber: number) {
    let i = 1;
    let fieldName: string;
    do {
      fieldName = `${type}P${pageNumber}-${i}`;
      i++;
    } while ((this.template?.fields || []).some(field => field && field.name === fieldName));

    return fieldName;
  }

  // Scale the X,Y clicks to the virtual page dimensions. Also ensure the field doesn't go off the page.
  viewCoordinatesToPageCoordinates(viewX: number, viewY: number, documentId: string, pageNumber: number, xMax: number, yMax: number) {
    const {xScale = 1, yScale = 1, renderedHeight = 792} = this.cachedPageInfo[documentId][pageNumber];
    // Round rather than floor: PDF y counts up from the bottom, so flooring would pull every drop down and to the left.
    const x = Math.round(Math.min(viewX / xScale, xMax));
    const y = Math.round(Math.min(Math.max(renderedHeight - viewY, 0) / yScale, yMax));
    return {x, y};
  }

  startPaletteDrag(e: PointerEvent, type: TFieldType) {
    const roleName = this.paletteRoleName();
    if (!roleName) {
      this.showMustSelectRole = true;
      return;
    }

    e.preventDefault();
    this.endPaletteDrag();

    // The ghost is drawn at the size the field will have on the page.
    const page = Object.values(this.cachedPageInfo)[0]?.[1];
    const width = defaultWidth(type) * (page?.xScale || 1);
    const height = defaultHeight(type) * (page?.yScale || 1);

    const ghost = document.createElement('div');
    ghost.className = `verdocs-builder-ghost ghost-${type} off`;
    ghost.style.cssText = `width:${width}px;height:${height}px;--verdocs-builder-ghost-color:${this.roleColor(roleName)}`;
    ghost.innerHTML = '<span class="tip"></span>';
    document.body.appendChild(ghost);
    document.body.classList.add('verdocs-builder-dragging');

    this.paletteDrag = {type, roleName, ghost, width, height, over: null};
    window.addEventListener('pointermove', this.handlePaletteMove);
    window.addEventListener('pointerup', this.handlePaletteDrop);
    this.handlePaletteMove(e);
  }

  handlePaletteMove = (e: PointerEvent) => {
    const drag = this.paletteDrag;
    if (!drag) {
      return;
    }

    // The pointer holds the field a few pixels in from its left edge, centered vertically, so the drop lands where the eye expects.
    let left = e.clientX - 10;
    let top = e.clientY - drag.height / 2;
    this.clearGuides();

    const tip = drag.ghost.querySelector('.tip');
    const page = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.tagName === 'VERDOCS-TEMPLATE-DOCUMENT-PAGE' && this.el.contains(el));
    const layer = page?.querySelector('.verdocs-template-document-page-layer[id$="-controls"]');
    if (page && layer) {
      const others = [...layer.querySelectorAll('.verdocs-field')].map(other => other.getBoundingClientRect());
      const snap = snapRect({left, top, width: drag.width, height: drag.height}, others);
      left += snap.dx;
      top += snap.dy;
      this.showGuides(layer, snap.guideX, snap.guideY);

      const layerRect = layer.getBoundingClientRect();
      drag.over = {
        documentId: page.getAttribute('document-id'),
        pageNumber: +page.getAttribute('page-number'),
        viewX: left - layerRect.left,
        viewBottom: layerRect.bottom - (top + drag.height),
      };
      drag.ghost.classList.remove('off');
      tip.textContent = `${FIELD_TYPES.find(fieldType => fieldType.type === drag.type)?.label} for ${drag.roleName}`;
    } else {
      drag.over = null;
      drag.ghost.classList.add('off');
      tip.textContent = 'Drop on a page';
    }

    drag.ghost.style.left = `${left}px`;
    drag.ghost.style.top = `${top}px`;
  };

  handlePaletteDrop = () => {
    const drag = this.paletteDrag;
    this.endPaletteDrag();

    const pageInfo = drag?.over ? this.cachedPageInfo[drag.over.documentId]?.[drag.over.pageNumber] : null;
    if (!pageInfo) {
      return;
    }

    const width = defaultWidth(drag.type);
    const height = defaultHeight(drag.type);
    const {naturalWidth = 612, naturalHeight = 792, xScale = 1, yScale = 1} = pageInfo;

    this.addField({
      name: this.generateFieldName(drag.type, drag.over.pageNumber),
      role_name: drag.roleName,
      template_id: this.templateId,
      document_id: drag.over.documentId,
      type: drag.type,
      required: defaultRequired(drag.type),
      page: drag.over.pageNumber,
      validator: null,
      label: null,
      default: null,
      placeholder: null,
      group: drag.type === 'radio' ? this.generateGroupName() : null,
      settings: {},
      x: Math.round(Math.min(Math.max(drag.over.viewX / xScale, 0), naturalWidth - width)),
      y: Math.round(Math.min(Math.max(drag.over.viewBottom / yScale, 0), naturalHeight - height)),
      width,
      height,
      multiline: false,
      readonly: false,
      options: drag.type === 'radio' ? [{id: 'option-1', label: 'Option 1'}] : [],
    });
  };

  endPaletteDrag() {
    window.removeEventListener('pointermove', this.handlePaletteMove);
    window.removeEventListener('pointerup', this.handlePaletteDrop);
    this.paletteDrag?.ghost.remove();
    this.paletteDrag = null;
    document.body.classList.remove('verdocs-builder-dragging');
    this.clearGuides();
  }

  handleClickPage(e: any) {
    // Clicks on a field select it through interact's tap, so only a click on the bare page clears the selection.
    if (!e.target?.closest?.('.verdocs-field')) {
      this.selectField(null);
    }
  }

  handleInspectorDelete(name: string) {
    this.forgetField(name);
    this.templateUpdated?.emit({endpoint: this.endpoint, template: this.template, event: 'deleted-field'});
  }

  renderFillWith(field: ITemplateField) {
    const fits = KEY_FITS[field.type] || [];
    const entries = this.catalog?.entries || [];
    const entry = entries.find(candidate => candidate.key === field.data_key);
    const fixed = field.type === 'textbox' && !field.data_key && !!field.readonly;
    const search = this.fillSearch.trim();
    const query = search.toLowerCase();
    const matches = entries.filter(candidate => !query || `${candidate.key} ${candidate.label}`.toLowerCase().includes(query));
    const groups = matches.reduce<Record<string, IDataCatalogEntry[]>>((all, candidate) => {
      const prefix = candidate.key.includes('.') ? candidate.key.split('.')[0] : '';
      (all[prefix] ||= []).push(candidate);
      return all;
    }, {});
    const typedKey = DATA_KEY_PATTERN.test(search) && !entries.some(candidate => candidate.key === search) ? search : '';
    const members = this.groupMembers(field);
    const shared = !!field.data_key && (this.template?.fields || []).some(other => other.data_key === field.data_key && !members.some(member => member.name === other.name));

    return (
      <Fragment>
        <div class="insp-label">Fill with</div>
        <div class="fill">
          <button type="button" class={{'fill-button': true, 'open': this.fillMenuOpen}} onClick={() => (this.fillMenuOpen = !this.fillMenuOpen)}>
            {field.data_key ? (
              <Fragment>
                <span class="fill-mark" innerHTML={DataIcon} />
                <span class="fill-value">{entry?.label || field.data_key}</span>
                <span class="fill-key">{field.data_key}</span>
              </Fragment>
            ) : (
              <span class="fill-value plain">{fixed ? 'Fixed text' : 'Signer enters this'}</span>
            )}
            <span class="fill-caret" />
          </button>

          {this.fillMenuOpen && (
            <Fragment>
              <div class="fill-backdrop" onClick={() => (this.fillMenuOpen = false)} />
              <div class="fill-menu" onKeyDown={(e: KeyboardEvent) => e.key === 'Escape' && (this.fillMenuOpen = false)}>
                <input
                  class="insp-input fill-search"
                  value={this.fillSearch}
                  placeholder={this.catalog ? `Search ${this.catalog.name}` : 'Type a data key'}
                  onInput={(e: any) => (this.fillSearch = e.target.value)}
                  ref={el => el && setTimeout(() => el.focus())}
                />
                <div class="fill-options">
                  {!query && (
                    <button type="button" class={{'fill-option': true, 'on': !field.data_key && !fixed}} onClick={() => this.fillWith(field, null, {readonly: false})}>
                      Signer enters this
                    </button>
                  )}
                  {!query && field.type === 'textbox' && (
                    <button type="button" class={{'fill-option': true, 'on': fixed}} onClick={() => this.fillWith(field, null, {readonly: true})}>
                      Fixed text
                    </button>
                  )}
                  {Object.entries(groups).map(([prefix, groupEntries]) => (
                    <Fragment>
                      {prefix && <div class="fill-group">{prefix}</div>}
                      {groupEntries.map(candidate => (
                        <button
                          type="button"
                          class={{'fill-option': true, 'on': candidate.key === field.data_key}}
                          disabled={!fits.includes(candidate.type)}
                          onClick={() => this.fillWith(field, candidate.key)}
                        >
                          <span class="fill-label">{candidate.label}</span>
                          <span class="fill-key">{candidate.key}</span>
                        </button>
                      ))}
                    </Fragment>
                  ))}
                  {typedKey && (
                    <button type="button" class="fill-option" onClick={() => this.fillWith(field, typedKey)}>
                      Use <span class="fill-key">{typedKey}</span>
                    </button>
                  )}
                  {typedKey && this.catalog && (
                    <button type="button" class="fill-option fill-add" onClick={() => this.addToCatalog(field, typedKey)}>
                      + Add <span class="fill-key">{typedKey}</span> to {this.catalog.name}
                    </button>
                  )}
                  {query && !typedKey && !matches.length && <div class="fill-note">No keys match.</div>}
                  {!query && !this.catalog && <div class="fill-note">Type a key to fill this field from your data.</div>}
                  {!query && entries.some(candidate => !fits.includes(candidate.type)) && <div class="fill-note">Greyed-out keys don't fit this kind of field.</div>}
                </div>
              </div>
            </Fragment>
          )}
        </div>

        {field.data_key && this.catalog && !entry && (
          <div class="insp-warn">
            Not in {this.catalog.name}.{' '}
            <button type="button" onClick={() => this.addToCatalog(field, field.data_key)}>
              Add it
            </button>
          </div>
        )}
        {entry && !fits.includes(entry.type) && <div class="insp-warn">{entry.label} holds a different kind of value than this field.</div>}
        {shared && field.readonly && <div class="insp-hint">Another field uses this key too, so this copy is read-only.</div>}
        {fixed && !field.default && <div class="insp-hint">Type the text under Default value.</div>}
      </Fragment>
    );
  }

  // A collapsible Inspector section. Closed, its header shows a summary; open, sections with rarer settings get an Advanced switch.
  renderSection(id: string, title: string, summary: string, changed: boolean, body: (advanced: boolean) => any, hasAdvanced = false) {
    const open = this.openSections[id] ?? SECTIONS_OPEN_BY_DEFAULT.includes(id);
    const advanced = !!this.advancedSections[id];
    const toggleOpen = () => {
      this.openSections = {...this.openSections, [id]: !open};
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(this.openSections));
    };

    return (
      <div class={{'insp-col': true, open}}>
        <div
          class="insp-colh"
          role="button"
          tabIndex={0}
          aria-expanded={String(open)}
          onClick={toggleOpen}
          onKeyDown={(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleOpen())}
        >
          <span class="insp-caret" />
          <span class="insp-coln">{title}</span>
          {open && hasAdvanced && (
            <button
              type="button"
              role="switch"
              aria-checked={String(advanced)}
              class="insp-adv"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                this.advancedSections = {...this.advancedSections, [id]: !advanced};
              }}
            >
              Advanced
              <span class={{'insp-toggle': true, 'on': advanced}}>
                <i />
              </span>
            </button>
          )}
          {!open && (
            <span class={{'insp-sum': true, 'changed': changed}}>
              {summary}
              {changed && <span class="insp-dot" />}
            </span>
          )}
        </div>
        {open && <div class="insp-colb">{body(advanced)}</div>}
      </div>
    );
  }

  renderInspector(field: ITemplateField) {
    const fieldType = FIELD_TYPES.find(fieldType => fieldType.type === field.type) || FIELD_TYPES.find(fieldType => fieldType.type === 'textbox');
    const options = this.draftOptions(field);
    const radio = field.type === 'radio';
    const members = this.groupMembers(field);
    // A validator the builder doesn't offer stays listed so it isn't lost
    const unknownFormat = field.validator && !TEXT_FORMATS.some(format => format.value === field.validator) ? [{value: field.validator, label: field.validator}] : [];
    const formats = [...TEXT_FORMATS, {value: 'pattern', label: 'Pattern'}, ...unknownFormat];
    const formatValue = !field.validator && (field.validation_pattern || this.patternField === field.name) ? 'pattern' : field.validator || '';

    // Text inputs save when they lose focus. Enter saves, and Escape puts the saved value back.
    const keys = (saved: string) => (e: KeyboardEvent) => {
      const input = e.target as HTMLInputElement;
      if (e.key === 'Escape') {
        input.value = saved;
        this.nameError = '';
        this.groupError = '';
      }

      if (e.key === 'Enter' || e.key === 'Escape') {
        input.blur();
      }
    };

    const toggle = (label: string, on: boolean, onClick: () => void) => (
      <div class="insp-row">
        <span>{label}</span>
        <button type="button" role="switch" aria-label={label} aria-checked={String(on)} class={{'insp-toggle': true, 'on': on}} onClick={onClick}>
          <i />
        </button>
      </div>
    );

    const recipient = (
      <label class="insp-label">
        Recipient
        <select name="role_name" class="insp-input" onChange={(e: any) => this.saveGroup(field, {role_name: e.target.value})}>
          {this.sortedRoles().map(role => (
            <option value={role.name} selected={role.name === field.role_name}>
              {role.name}
            </option>
          ))}
        </select>
      </label>
    );

    const editOption = (index: number, changes: Partial<IDropdownOption>) =>
      (this.optionsDraft = {name: field.name, options: options.map((option, i) => (i === index ? {...option, ...changes} : option))});

    const textField = ['textbox', 'textarea'].includes(field.type);
    const formatLabel = formats.find(format => format.value === formatValue)?.label || 'Any text';
    const optionCount = radio ? members.length : options.length;

    return (
      <div class="insp-body" key={radio && field.group ? `group-${field.role_name}-${field.group}` : field.name}>
        <div class="insp-head">
          <span class="insp-badge">
            <span class="insp-badge-icon" innerHTML={fieldType.icon} />
            {radio ? `Radio group · ${members.length}` : fieldType.label}
          </span>
          <span class="insp-title">{(radio && field.group) || field.label || field.name}</span>
          <button class="inspector-close" title="Close" aria-label="Close" innerHTML={CloseIcon} onClick={() => (this.inspectorOpen = false)} />
        </div>

        {KEY_FITS[field.type] && this.renderFillWith(field)}
        {!radio && (
          <label class="insp-label">
            Label
            <input name="label" class="insp-input" value={field.label || ''} placeholder="Optional" onChange={(e: any) => this.saveRename(field, e.target.value)} onKeyDown={keys(field.label || '')} />
          </label>
        )}
        {recipient}
        <div class="insp-checks">
          {toggle('Required', !!field.required, () => this.toggleRequired(field))}
          {toggle('Read-only', !!field.readonly, () => this.toggleReadonly(field))}
        </div>
        {radio && field.required && <div class="insp-hint">The recipient has to choose one option.</div>}

        <div class="insp-sections">
          {radio &&
            this.renderSection('group', 'Group', field.group || 'No group name', false, () => (
              <Fragment>
                <label class="insp-label">
                  Group name
                  <input
                    name="group"
                    class="insp-input mono"
                    value={field.group || ''}
                    placeholder="choice1"
                    onChange={(e: any) => this.saveGroupName(field, e.target.value)}
                    onKeyDown={keys(field.group || '')}
                  />
                </label>
                {this.groupError && <div class="insp-error">{this.groupError}</div>}
              </Fragment>
            ))}

          {radio &&
            this.renderSection(
              'options',
              'Options',
              `${optionCount} ${optionCount === 1 ? 'option' : 'options'}`,
              false,
              advanced => (
                <Fragment>
                  {members.map((member, index) => (
                    <div class="insp-option" key={member.name}>
                      <button
                        type="button"
                        class={{'insp-option-num': true, 'current': member.name === field.name}}
                        title={`Select option ${index + 1}`}
                        aria-label={`Select option ${index + 1}`}
                        aria-pressed={String(member.name === field.name)}
                        onClick={() => this.selectField(member.name)}
                      >
                        {index + 1}
                      </button>
                      <input
                        class="insp-input"
                        value={member.label || ''}
                        placeholder={`Option ${index + 1}`}
                        aria-label={`Option ${index + 1} label`}
                        onChange={(e: any) => this.saveRename(member, e.target.value)}
                        onKeyDown={keys(member.label || '')}
                      />
                      {advanced && (
                        <input
                          class="insp-input mono"
                          value={member.name}
                          aria-label={`Option ${index + 1} API name`}
                          onChange={(e: any) => this.saveFieldName(member, e.target.value)}
                          onKeyDown={keys(member.name)}
                        />
                      )}
                      {members.length > 1 && (
                        <button
                          type="button"
                          class="insp-remove"
                          title="Remove option"
                          aria-label={`Remove option ${index + 1}`}
                          innerHTML={TrashIcon}
                          onClick={() => this.removeOption(field, member)}
                        />
                      )}
                    </div>
                  ))}
                  {this.nameError && <div class="insp-error">{this.nameError}</div>}
                  <button type="button" class="insp-add" onClick={() => this.addOption(field)}>
                    + Add option
                  </button>
                  <label class="insp-label">
                    Pre-selected
                    <select name="preselected" class="insp-input" onChange={(e: any) => this.savePreselected(field, e.target.value)}>
                      <option value="" selected={!members.some(member => member.default === 'true')}>
                        None
                      </option>
                      {members.map((member, index) => (
                        <option value={member.name} selected={member.default === 'true'}>
                          {member.label || `Option ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </label>
                  {members.length > 1 && members.every(member => member.page === field.page) && (
                    <div class="insp-row">
                      <span>Arrange on the page</span>
                      <span class="insp-arrange">
                        <button type="button" title="Align left edges" aria-label="Align left edges" innerHTML={AlignLeftIcon} onClick={() => this.arrangeGroup(field, 'align')} />
                        <button
                          type="button"
                          title="Space evenly"
                          aria-label="Space evenly"
                          innerHTML={SpaceEvenlyIcon}
                          disabled={members.length < 3}
                          onClick={() => this.arrangeGroup(field, 'space')}
                        />
                      </span>
                    </div>
                  )}
                </Fragment>
              ),
              true,
            )}

          {textField &&
            this.renderSection(
              'format',
              'Format',
              [formatLabel, field.input_mask && 'Masked'].filter(Boolean).join(' · '),
              !!(field.validator || field.validation_pattern || field.input_mask),
              advanced => (
                <Fragment>
                  <label class="insp-label">
                    Format
                    <select
                      name="validator"
                      class="insp-input"
                      onChange={(e: any) => {
                        const value = e.target.value;
                        this.formatError = '';
                        this.patternField = value === 'pattern' ? field.name : '';
                        if (value !== 'pattern') {
                          const clearPattern = field.validation_pattern || field.validation_message ? {validation_pattern: null, validation_message: null} : {};
                          this.saveField(field.name, {validator: value || null, ...clearPattern});
                        } else if (field.validator) {
                          this.saveField(field.name, {validator: null});
                        }
                      }}
                    >
                      {formats.map(format => (
                        <option value={format.value} selected={format.value === formatValue}>
                          {format.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {formatValue === 'pattern' && (
                    <Fragment>
                      <label class="insp-label">
                        Pattern
                        <input
                          name="validation_pattern"
                          class="insp-input mono"
                          value={field.validation_pattern || ''}
                          placeholder="HO-\d{4}-\d{6}"
                          onChange={(e: any) => {
                            const pattern = e.target.value.trim();
                            // Minifiers drop a bare `new RegExp()` whose result goes unused, so we run it
                            try {
                              new RegExp(pattern).test('');
                            } catch {
                              this.formatError = "This pattern isn't a valid regular expression.";
                              return;
                            }

                            this.formatError = '';
                            this.saveField(field.name, {validation_pattern: pattern || null});
                          }}
                          onKeyDown={keys(field.validation_pattern || '')}
                        />
                      </label>
                      <label class="insp-label">
                        Message when it doesn't match
                        <input
                          name="validation_message"
                          class="insp-input"
                          value={field.validation_message || ''}
                          placeholder="Optional"
                          onChange={(e: any) => this.saveField(field.name, {validation_message: e.target.value.trim() || null})}
                          onKeyDown={keys(field.validation_message || '')}
                        />
                      </label>
                    </Fragment>
                  )}

                  {(advanced || field.input_mask) && (
                    <label class="insp-label">
                      Input mask
                      <input
                        name="input_mask"
                        class="insp-input mono"
                        value={field.input_mask || ''}
                        placeholder="(___) ___-____"
                        onChange={(e: any) => {
                          const mask = e.target.value;
                          if (mask && !mask.includes('_')) {
                            this.formatError = 'Use _ for each character the signer types.';
                            return;
                          }

                          this.formatError = '';
                          this.saveField(field.name, {input_mask: mask || null});
                        }}
                        onKeyDown={keys(field.input_mask || '')}
                      />
                    </label>
                  )}

                  {this.formatError && <div class="insp-error">{this.formatError}</div>}
                </Fragment>
              ),
              true,
            )}

          {textField &&
            this.renderSection(
              'text',
              'Text',
              [
                field.max_length && `Up to ${field.max_length} characters`,
                field.text_case && TEXT_CASES.find(([value]) => value === field.text_case)?.[1],
                field.placeholder && `Placeholder "${field.placeholder}"`,
                field.default && `Starts as "${field.default}"`,
              ]
                .filter(Boolean)
                .join(' · ') || 'No placeholder',
              !!(field.max_length || field.text_case || field.placeholder || field.default),
              () => (
                <Fragment>
                  <div class="insp-two">
                    <label class="insp-label">
                      Max characters
                      <input
                        name="max_length"
                        type="number"
                        min="1"
                        class="insp-input"
                        value={field.max_length ?? ''}
                        placeholder={`Fits the box (${Math.floor((field.width || 150) / 5)})`}
                        onChange={(e: any) => {
                          const max = parseInt(e.target.value, 10);
                          this.saveField(field.name, {max_length: max > 0 ? max : null});
                        }}
                        onKeyDown={keys(String(field.max_length ?? ''))}
                      />
                    </label>
                    <label class="insp-label">
                      Letter case
                      <select
                        name="text_case"
                        class="insp-input"
                        onChange={(e: any) => this.saveField(field.name, {text_case: (e.target.value || null) as ITemplateField['text_case']})}
                      >
                        {TEXT_CASES.map(([value, label]) => (
                          <option value={value} selected={(field.text_case || '') === value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div class="insp-two">
                    <label class="insp-label">
                      Placeholder
                      <input
                        name="placeholder"
                        class="insp-input"
                        value={field.placeholder || ''}
                        placeholder="Optional"
                        onChange={(e: any) => this.saveField(field.name, {placeholder: e.target.value})}
                        onKeyDown={keys(field.placeholder || '')}
                      />
                    </label>
                    <label class="insp-label">
                      Default value
                      <input
                        name="default"
                        class="insp-input"
                        value={field.default || ''}
                        placeholder="Optional"
                        onChange={(e: any) => this.saveField(field.name, {default: e.target.value})}
                        onKeyDown={keys(field.default || '')}
                      />
                    </label>
                  </div>
                </Fragment>
              ),
            )}

          {field.type === 'checkbox' &&
            this.renderSection('checkbox', 'Checkbox', field.default === 'true' ? 'Starts checked' : 'Starts unchecked', field.default === 'true', () =>
              toggle('Pre-checked', field.default === 'true', () => this.saveField(field.name, {default: field.default === 'true' ? 'false' : 'true'})),
            )}

          {field.type === 'dropdown' &&
            this.renderSection(
              'options',
              'Options',
              `${optionCount} ${optionCount === 1 ? 'option' : 'options'}`,
              false,
              advanced => (
                <Fragment>
                  {options.map((option, index) => (
                    <div class="insp-option">
                      <input
                        class="insp-input"
                        value={option.label || ''}
                        placeholder="Label"
                        onInput={(e: any) => editOption(index, {label: e.target.value})}
                        onChange={() => this.saveOptions(field, this.draftOptions(field))}
                        onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                      />
                      {advanced && (
                        <input
                          class="insp-input mono"
                          value={option.id || ''}
                          placeholder="ID"
                          onInput={(e: any) => editOption(index, {id: e.target.value})}
                          onChange={() => this.saveOptions(field, this.draftOptions(field))}
                          onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                        />
                      )}
                      {options.length > 1 && (
                        <button
                          type="button"
                          class="insp-remove"
                          title="Remove option"
                          aria-label="Remove option"
                          innerHTML={TrashIcon}
                          onClick={() => this.saveOptions(field, options.filter((_, i) => i !== index))}
                        />
                      )}
                    </div>
                  ))}
                  <button type="button" class="insp-add" onClick={() => (this.optionsDraft = {name: field.name, options: [...options, {id: '', label: ''}]})}>
                    + Add option
                  </button>
                </Fragment>
              ),
              true,
            )}

          {!radio &&
            this.renderSection('developer', 'Developer', field.name, false, () => (
              <Fragment>
                <label class="insp-label">
                  API name
                  <input name="name" class="insp-input mono" value={field.name} onChange={(e: any) => this.saveFieldName(field, e.target.value)} onKeyDown={keys(field.name)} />
                </label>
                {this.nameError && <div class="insp-error">{this.nameError}</div>}
              </Fragment>
            ))}
        </div>

        <button type="button" class="insp-delete" onClick={() => this.deleteFields(members)}>
          <span innerHTML={TrashIcon} />
          {members.length > 1 ? 'Delete group' : 'Delete field'}
        </button>
      </div>
    );
  }

  renderQuickBar(field: ITemplateField) {
    return (
      <div class="quick-bar" ref={el => (this.quickBarEl = el)} onPointerDown={e => e.stopPropagation()}>
        <button class="quick-button signer" onClick={() => (this.signerMenuOpen = !this.signerMenuOpen)}>
          <span class="signer-dot" style={{background: this.roleColor(field.role_name)}} />
          <span class="signer-num">{this.roleNumber(field.role_name)}</span>
          {field.role_name}
          <span class="caret" />
        </button>
        <span class="separator" />
        <button
          class="quick-button"
          aria-pressed={String(!!field.required)}
          onClick={() => this.toggleRequired(field)}
        >
          <span class={{check: true, on: !!field.required}} />
          Required
        </button>
        <button
          class="quick-button"
          aria-pressed={String(!!field.readonly)}
          onClick={() => this.toggleReadonly(field)}
        >
          <span class={{check: true, on: !!field.readonly}} />
          Read-only
        </button>
        <span class="separator" />
        <button class="quick-button icon" title="Rename" aria-label="Rename" innerHTML={PencilIcon} onClick={() => (this.renaming = !this.renaming)} />
        <button class="quick-button icon" title="Duplicate" aria-label="Duplicate" innerHTML={DuplicateIcon} onClick={() => this.duplicateField(field)} />
        <button class="quick-button icon" title="Reset size and settings" aria-label="Reset size and settings" innerHTML={ResetIcon} onClick={() => this.resetField(field)} />
        <button class="quick-button icon delete" title="Delete" aria-label="Delete" innerHTML={TrashIcon} onClick={() => this.removeOption(field, field)} />
        <span class="separator" />
        <button class="quick-button icon" title="All settings" aria-label="All settings" innerHTML={SettingsIcon} onClick={() => (this.inspectorOpen = true)} />

        {this.signerMenuOpen && (
          <div class="quick-menu">
            <div class="quick-menu-heading">Who fills this in</div>
            {this.sortedRoles().map(role => (
              <button
                class={{'quick-menu-item': true, 'current': role.name === field.role_name}}
                onClick={() => {
                  this.signerMenuOpen = false;
                  if (role.name !== field.role_name) {
                    this.saveGroup(field, {role_name: role.name});
                  }
                }}
              >
                <span class="signer-dot" style={{background: this.roleColor(role.name)}} />
                <span class="signer-num">{this.roleNumber(role.name)}</span>
                {role.name}
              </button>
            ))}
          </div>
        )}

        {this.renaming && (
          <div class="quick-rename">
            <input
              type="text"
              value={field.label || ''}
              placeholder="Label"
              aria-label="Label"
              ref={el => el && requestAnimationFrame(() => el.focus())}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  this.saveRename(field, (e.target as HTMLInputElement).value);
                } else if (e.key === 'Escape') {
                  e.stopPropagation();
                  this.renaming = false;
                }
              }}
              onBlur={e => this.renaming && this.saveRename(field, (e.target as HTMLInputElement).value)}
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    const selectedField = this.findField(this.selectedFieldName);
    const roleOptions = this.sortedRoles().map(role => ({value: role.name, label: role.full_name ? `${role.name}: ${role.full_name}` : role.name}));
    const paletteRoleName = this.paletteRoleName();

    return (
      <Host>
        <div class="palette">
          <div class="palette-title">Recipient</div>
          <verdocs-select-input value={paletteRoleName} options={roleOptions} onInput={(e: any) => (this.selectedRoleName = e.target.value)} />

          <div class="palette-title">Fields</div>
          {FIELD_TYPES.map(fieldType => (
            <div class="palette-field" onPointerDown={(e: PointerEvent) => this.startPaletteDrag(e, fieldType.type)}>
              <span class="palette-icon" style={{'--vb-color': this.roleColor(paletteRoleName), '--vb-text': this.roleTextColor(paletteRoleName)}} innerHTML={fieldType.icon} />
              {fieldType.label}
              <span class="grip" />
            </div>
          ))}
          <div class="palette-hint">Drag a field onto the page.</div>
        </div>

        <div class="pages" ref={el => (this.pagesEl = el)}>
          {(this.template?.documents || []).map(document => {
            const pageNumbers = integerSequence(1, document.pages);

            return pageNumbers.map(page => {
              const pageSize = document.page_sizes[page];

              return (
                <Fragment>
                  {this.template?.documents.length > 1 && page === 1 && (
                    <div class="document-separator">
                      <div innerHTML={DocumentPageIcon} />
                      <span>{document.name}</span>
                    </div>
                  )}

                  <verdocs-template-document-page
                    templateId={this.templateId}
                    documentId={document.id}
                    pageNumber={page}
                    virtualWidth={pageSize?.width || 612}
                    virtualHeight={pageSize?.height || 792}
                    disabled={true}
                    editable={true}
                    done={false}
                    onClick={(e: PointerEvent) => this.handleClickPage(e)}
                    onPageRendered={e => this.handlePageRendered(e)}
                    layers={[
                      {name: 'page', type: 'canvas'},
                      {name: 'controls', type: 'div'},
                    ]}
                  />
                </Fragment>
              );
            });
          })}

          {selectedField && this.renderQuickBar(selectedField)}
        </div>

        <div class={{inspector: true, open: this.inspectorOpen}}>
          <div class="inspector-inner">
            {selectedField ? (
              this.renderInspector(selectedField)
            ) : (
              <Fragment>
                <div class="insp-head">
                  <span class="insp-title">Field settings</span>
                  <button class="inspector-close" title="Close" aria-label="Close" innerHTML={CloseIcon} onClick={() => (this.inspectorOpen = false)} />
                </div>
                <div class="inspector-empty">Select a field on the page to see its settings.</div>
              </Fragment>
            )}
          </div>
        </div>

        {this.showMustSelectRole && (
          <verdocs-ok-dialog
            heading="Unable to add field"
            message="Please add at least one role before adding fields."
            onNext={() => (this.showMustSelectRole = false)}
          />
        )}
      </Host>
    );
  }
}
