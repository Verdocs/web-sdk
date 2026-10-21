import interact from 'interactjs';
import {Component, h, Element, Event, EventEmitter, Fragment, Host, Listen, Prop, State, Watch} from '@stencil/core';
import {createField, getTemplate, integerSequence, ITemplate, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {defaultHeight, defaultWidth, getFieldId, removeCssTransform, setControlStyles, updateCssTransform} from '../../../utils/utils';
import {CloseIcon, DocumentPageIcon, DuplicateIcon, LockIcon, PencilIcon, ResetIcon, SettingsIcon} from '../../../utils/Icons';
import {IDocumentPageInfo} from '../../../utils/Types';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const FIELD_TYPES: {type: TFieldType; label: string; icon: string}[] = [
  {
    type: 'signature',
    label: 'Signature',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Z"/></svg>',
  },
  {
    type: 'initial',
    label: 'Initials',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6.225 20.775V7h-5V3.225H15V7h-5v13.775Zm9.775 0v-8h-3V9h9.775v3.775h-3v8Z"/></svg>',
  },
  {
    type: 'textbox',
    label: 'Text box',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>',
  },
  {
    type: 'date',
    label: 'Date',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Z"/></svg>',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m10.55 16.55 7.275-7.275L16.05 7.5l-5.5 5.45-2.675-2.65L6.1 12.075Zm-5.375 4.925q-1.125 0-1.887-.763-.763-.762-.763-1.887V5.175q0-1.125.763-1.888.762-.762 1.887-.762h13.65q1.125 0 1.888.762.762.763.762 1.888v13.65q0 1.125-.762 1.887-.763.763-1.888.763Zm0-2.65h13.65V5.175H5.175v13.65Z"/></svg>',
  },
  {
    type: 'radio',
    label: 'Radio button',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5.85q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Zm0-3.15q3.25 0 5.475-2.225Q19.7 15.25 19.7 12q0-3.25-2.225-5.475Q15.25 4.3 12 4.3q-3.25 0-5.475 2.225Q4.3 8.75 4.3 12q0 3.25 2.225 5.475Q8.75 19.7 12 19.7Z"/></svg>',
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>',
  },
  {
    type: 'attachment',
    label: 'Attachment',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>',
  },
];

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
  @State() inspectorRevision = 0;

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

    // composedPath reaches inputs inside a host page's shadow DOM, where activeElement would only show the host.
    const target = (ev.composedPath?.()[0] || ev.target) as Element;
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

  async componentWillLoad() {
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
        if (this.selectedFieldName && !this.findField(this.selectedFieldName)) {
          this.selectedFieldName = null;
        }
      },
    );
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

  // Recipients take their color from the role's position in the template, repeating after eight.
  roleNumber(roleName: string) {
    return (Math.max((this.template?.roles || []).findIndex(role => role.name === roleName), 0) % 8) + 1;
  }

  roleColor(roleName: string) {
    return `var(--verdocs-builder-recipient-${this.roleNumber(roleName)})`;
  }

  // We draw Builder fields ourselves, in the recipient's color with an icon, label, and badges, instead of the signing theme.
  decorateField(el: HTMLElement, field: ITemplateField) {
    const n = this.roleNumber(field.role_name);
    const toggle = field.type === 'checkbox' || field.type === 'radio';
    const fieldType = FIELD_TYPES.find(fieldType => fieldType.type === field.type) || FIELD_TYPES.find(fieldType => fieldType.type === 'textbox');
    const label = toggle ? '' : field.label || field.placeholder || fieldType.label;
    const key = [n, field.type, label, field.required, field.readonly].join('|');

    el.classList.add('vb-field');
    el.style.setProperty('--vb-color', `var(--verdocs-builder-recipient-${n})`);
    el.style.setProperty('--vb-text', `var(--verdocs-builder-recipient-${n}-text)`);
    el.style.setProperty('--vb-scale', String(this.cachedPageInfo[field.document_id]?.[field.page]?.xScale || 1));

    let face = el.querySelector<HTMLElement>('.vb-face');
    if (face?.dataset.key === key) {
      return;
    }

    if (!face) {
      face = document.createElement('span');
      face.className = 'vb-face';
      el.appendChild(face);
    }

    face.dataset.key = key;
    face.classList.toggle('has-badges', !!field.readonly);
    face.textContent = '';

    if (!toggle) {
      const icon = document.createElement('span');
      icon.className = 'vb-icon';
      icon.innerHTML = fieldType.icon;
      const text = document.createElement('span');
      text.className = 'vb-label';
      text.textContent = label;
      face.append(icon, text);
    }

    if (field.required) {
      const req = document.createElement('span');
      req.className = 'vb-req';
      req.textContent = '*';
      face.append(req);
    }

    if (field.readonly) {
      const badges = document.createElement('span');
      badges.className = 'vb-badges';
      badges.innerHTML = `<i title="Read-only">${LockIcon}</i>`;
      face.append(badges);
    }

    const handle = document.createElement('span');
    handle.className = 'vb-handle';
    face.append(handle);
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
      this.renaming = false;
    }

    this.selectedFieldName = name;
    this.applySelection();
  }

  applySelection() {
    this.el.querySelectorAll('.verdocs-field-selected').forEach(el => el.classList.remove('verdocs-field-selected'));
    const field = this.findField(this.selectedFieldName);
    if (field) {
      document.getElementById(getFieldId(field))?.classList.add('verdocs-field-selected');
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
    const height = field.height || defaultHeight(field.type);
    const copy: ITemplateField = {...field, name: this.generateFieldName(field.type, field.page), y: Math.max(0, field.y - height - 10)};
    if (field.type === 'radio') {
      const optionNumber = (this.template?.fields || []).filter(other => other.type === 'radio' && other.group === field.group).length + 1;
      copy.options = [{id: `option-${optionNumber}`, label: `Option ${optionNumber}`}];
    }

    return this.addField(copy);
  }

  resetField(field: ITemplateField) {
    return this.saveField(
      field.name,
      {
        width: defaultWidth(field.type),
        height: defaultHeight(field.type),
        multiline: false,
        required: defaultRequired(field.type),
        readonly: false,
      },
      this.currentGeometry(field),
    );
  }

  saveRename(field: ITemplateField, label: string) {
    this.renaming = false;
    if (label.trim() !== (field.label || '')) {
      this.saveField(field.name, {label: label.trim() || null});
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
      group: null,
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

  renderQuickBar(field: ITemplateField) {
    return (
      <div class="quick-bar" ref={el => (this.quickBarEl = el)} onPointerDown={e => e.stopPropagation()}>
        <button class="quick-button signer" onClick={() => (this.signerMenuOpen = !this.signerMenuOpen)}>
          <span class="signer-dot" style={{background: this.roleColor(field.role_name)}} />
          {field.role_name}
          <span class="caret" />
        </button>
        <span class="separator" />
        <button
          class="quick-button"
          aria-pressed={String(!!field.required)}
          onClick={() => this.saveField(field.name, {required: !field.required, readonly: field.required ? field.readonly : false})}
        >
          <span class={{check: true, on: !!field.required}} />
          Required
        </button>
        <button
          class="quick-button"
          aria-pressed={String(!!field.readonly)}
          onClick={() => this.saveField(field.name, {readonly: !field.readonly, required: field.readonly ? field.required : false})}
        >
          <span class={{check: true, on: !!field.readonly}} />
          Read-only
        </button>
        <span class="separator" />
        <button class="quick-button icon" title="Rename" aria-label="Rename" innerHTML={PencilIcon} onClick={() => (this.renaming = !this.renaming)} />
        <button class="quick-button icon" title="Duplicate" aria-label="Duplicate" innerHTML={DuplicateIcon} onClick={() => this.duplicateField(field)} />
        <button class="quick-button icon" title="Reset size and settings" aria-label="Reset size and settings" innerHTML={ResetIcon} onClick={() => this.resetField(field)} />
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
                    this.saveField(field.name, {role_name: role.name});
                  }
                }}
              >
                <span class="signer-dot" style={{background: this.roleColor(role.name)}} />
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
              <span class="palette-icon" style={{background: this.roleColor(paletteRoleName)}} innerHTML={fieldType.icon} />
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
            <div class="inspector-header">
              <span>Field settings</span>
              <button class="inspector-close" title="Close" aria-label="Close" innerHTML={CloseIcon} onClick={() => (this.inspectorOpen = false)} />
            </div>

            {selectedField ? (
              <verdocs-template-field-properties
                key={`${selectedField.name}-${this.inspectorRevision}`}
                endpoint={this.endpoint}
                templateId={this.templateId}
                fieldName={selectedField.name}
                onClose={() => this.inspectorRevision++}
                onDelete={() => this.handleInspectorDelete(selectedField.name)}
              />
            ) : (
              <div class="inspector-empty">Select a field to see its settings.</div>
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
