import interact from 'interactjs';
import type {IAttachmentFieldConfig, IDateFieldConfig, TDataCatalogEntryType} from '@verdocs/js-sdk';
import {Component, h, Element, Event, EventEmitter, Fragment, Host, Listen, Prop, State, Watch} from '@stencil/core';
import {formatFieldNumber, getDataCatalog, getDataCatalogs, IDataCatalog, IDataCatalogEntry, ITextFieldConfig, saveDataCatalogEntries} from '@verdocs/js-sdk';
import {createField, deleteField, getTemplate, IDropdownOption, integerSequence, ITemplate, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import type {ICheckboxFieldConfig, IDropdownFieldConfig, IFieldTextFit, IRadioFieldConfig, ISignatureFieldConfig, ITimestampFieldConfig, TFieldConfig} from '@verdocs/js-sdk';
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
const SECTIONS_OPEN_BY_DEFAULT = ['group', 'options', 'format', 'text', 'checkbox', 'stamp', 'timestamp', 'date', 'attachment'];
const SECTIONS_STORAGE_KEY = 'verdocs-builder-inspector-sections';

const readOpenSections = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(SECTIONS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

// "page" fits a whole page in view, "width" fills the column, and a number is a percent of the page's own size.
type TZoom = 'page' | 'width' | number;
const ZOOM_STORAGE_KEY = 'verdocs-builder-zoom';
const ZOOM_STEPS = [25, 50, 75, 100, 125, 150, 200];
// The pages column has 15px of padding on each side
const PAGES_PADDING = 30;

const readZoom = (): TZoom => {
  try {
    const saved = localStorage.getItem(ZOOM_STORAGE_KEY);
    return saved === 'width' ? 'width' : Number(saved) > 0 ? Number(saved) : 'page';
  } catch {
    return 'page';
  }
};

// The what's-new tour. Steps that need a selected field are skipped when the template has none.
const TOUR_SEEN_KEY = 'verdocs-builder-tour-seen';
type TTourLayout = {spot: {left: number; top: number; width: number; height: number} | null; left: number; top: number; arrow: string; arrowAt: number};
const TOUR_STEPS: {title: string; body: string; target: string; needsField?: boolean; inspector?: boolean}[] = [
  {
    title: 'Drag a field onto the page',
    body: 'Pick a recipient, then drag any field from this list onto the document, or click one and then click where it goes.',
    target: '.palette',
  },
  {
    title: 'Everything for the selected field',
    body: 'Required, read-only, recipient, rename, duplicate, and reset are one click away. All settings opens the Inspector.',
    target: '.quick-bar',
    needsField: true,
  },
  {
    title: 'Fine-tune in the Inspector',
    body: 'Formats, fit, stamping, and position live in sections you can open and close.',
    target: '.inspector',
    needsField: true,
    inspector: true,
  },
  {title: 'Nudge with the arrow keys', body: 'Arrow keys move the selected field one point. Hold Shift to move ten.', target: 'field', needsField: true},
  {title: 'Undo a move', body: 'Cmd+Z, or Ctrl+Z, puts back the last move or resize.', target: 'field', needsField: true},
  {title: 'Reset a field', body: 'Reset puts a field back to its default size and settings.', target: '.quick-bar .reset', needsField: true},
  {title: 'Zoom to fit', body: 'Show the whole page, fill the width, or pick a size. Your choice is remembered.', target: '.zoom-bar'},
  {title: 'See this again', body: 'The help button replays this tour anytime.', target: '.tour-help'},
];

const TEXT_CASES = [
  ['', 'As typed'],
  ['upper', 'UPPERCASE'],
  ['lower', 'lowercase'],
];

const NUMBER_STYLES = [
  ['', 'As typed'],
  ['number', 'Number'],
  ['currency', 'Currency'],
  ['percent', 'Percent'],
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'JPY', 'CHF', 'MXN', 'BRL', 'INR', 'CNY', 'SEK', 'NOK', 'DKK', 'ZAR', 'SGD', 'HKD'];

const tidy = (settings: Record<string, any>) => {
  const kept: Record<string, any> = {};
  Object.keys(settings)
    .filter(key => settings[key] !== undefined && settings[key] !== null && settings[key] !== '')
    .forEach(key => (kept[key] = settings[key]));
  return kept;
};

// A config without its empty settings, or null when only its type is left
const tidyConfig = <T extends TFieldConfig>(config: T) => {
  const kept = tidy(config);
  return Object.keys(kept).length > 1 ? (kept as T) : null;
};

// Nested settings without their empty values, or undefined when nothing is left
const tidyGroup = <T extends object>(settings: T) => {
  const kept = tidy(settings);
  return Object.keys(kept).length ? (kept as T) : undefined;
};

// Stamping starts text at 11 pt
const FIT_DEFAULT = 11;
const FIT_RANGE = {min: 6, max: 24};

// Settings that match the defaults drop out, so an untouched Fit stays empty
const tidyFit = (fit: IFieldTextFit) =>
  tidyGroup({
    ...fit,
    max_font_size: fit.max_font_size === FIT_DEFAULT ? undefined : fit.max_font_size,
    min_font_size: fit.min_font_size === (fit.max_font_size ?? FIT_DEFAULT) ? undefined : fit.min_font_size,
    overflow: fit.overflow === 'overflow' ? undefined : fit.overflow,
  });

const OVERFLOWS: [IFieldTextFit['overflow'], string][] = [
  ['truncate', 'Cut off'],
  ['ellipsize', 'Ellipsis …'],
  ['overflow', 'Run over'],
];

// The smallest a field can be typed in, matching what dragging its corner allows
const MIN_SIZES: Record<string, [number, number]> = {
  textbox: [30, 10],
  textarea: [30, 10],
  date: [50, 12],
  signature: [71, 36],
  initial: [71, 36],
  checkbox: [8, 8],
  radio: [8, 8],
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

// Signing's upload limit
const MAX_ATTACHMENT_MB = 25;
const FILE_TYPE = /^(\.[a-z0-9]+|[a-z]+\/[a-z0-9.+*-]+)$/i;

// 2026-12-31 as 12/31/2026
const usDate = (iso: string) => iso.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$2/$3/$1');

const SHOW_HIDE: ['show' | 'hide', string][] = [
  ['show', 'Show'],
  ['hide', 'Hide'],
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
  private tourEl: HTMLElement | null = null;
  private tourCardEl: HTMLElement | null = null;
  private tourOffered = false;
  private inspectorBeforeTour = false;

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
   * Shows a short tour of the builder the first time each person opens it, and a help button that replays it. Off unless the
   * host turns it on.
   */
  @Prop() showTour: boolean = false;

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
  @State() fitDraft: {name: string; min: number; max: number} | null = null;
  @State() dateBetween = '';
  @State() acceptError = '';
  @State() catalog: IDataCatalog | null = null;
  @State() fillMenuOpen = false;
  @State() fillSearch = '';
  @State() openSections: Record<string, boolean> = readOpenSections();
  @State() zoom: TZoom = readZoom();
  @State() zoomPercent = 100;
  @State() zoomMenuOpen = false;
  @State() tourSteps: typeof TOUR_STEPS | null = null;
  @State() tourIndex = 0;
  @State() tourLayout: TTourLayout | null = null;
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
    startX: number;
    startY: number;
    moved: boolean;
    placing: boolean;
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

    if (ev.key === 'Escape' && this.tourSteps) {
      this.endTour();
      return;
    }

    if (ev.key === 'Escape') {
      if (this.zoomMenuOpen) {
        this.zoomMenuOpen = false;
      } else if (this.signerMenuOpen || this.renaming) {
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

    // Cmd/Ctrl with plus, minus, or 0 zooms the pages instead of the browser
    if ((ev.metaKey || ev.ctrlKey) && !ev.altKey && ['=', '+', '-', '0'].includes(ev.key)) {
      ev.preventDefault();
      if (ev.key === '0') {
        this.setZoom('page');
      } else {
        this.stepZoom(ev.key === '-' ? -1 : 1);
      }
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
    this.stopTourListeners();
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
    this.zoomPercent = Math.round(pageInfo.xScale * 100);
    this.offerTour();

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
      this.dateBetween = '';
      this.acceptError = '';
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

  offerTour() {
    if (!this.showTour || this.tourOffered) {
      return;
    }

    this.tourOffered = true;
    try {
      if (localStorage.getItem(TOUR_SEEN_KEY)) {
        return;
      }
    } catch {
      return;
    }

    setTimeout(() => this.startTour(), 600);
  }

  startTour() {
    const hasFields = (this.template?.fields || []).length > 0;
    this.inspectorBeforeTour = this.inspectorOpen;
    this.zoomMenuOpen = false;
    this.tourSteps = TOUR_STEPS.filter(step => hasFields || !step.needsField);
    window.addEventListener('resize', this.placeTour);
    document.addEventListener('scroll', this.placeTour, true);
    this.showTourStep(0);
  }

  showTourStep(index: number) {
    const step = this.tourSteps?.[index];
    if (!step) {
      this.endTour();
      return;
    }

    this.tourIndex = index;
    this.tourLayout = null;
    if (step.needsField && !this.findField(this.selectedFieldName)) {
      const first = [...(this.template?.fields || [])].sort((a, b) => (a.page || 0) - (b.page || 0) || (b.y || 0) - (a.y || 0))[0];
      if (first) {
        this.selectField(first.name);
      }
    }

    this.inspectorOpen = step.inspector || this.inspectorBeforeTour;
    // Placed after this render, and again once the Inspector finishes sliding open
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.tourTarget()?.scrollIntoView({block: 'nearest', inline: 'nearest'});
        this.placeTour();
      }),
    );
    setTimeout(this.placeTour, 260);
  }

  endTour() {
    this.stopTourListeners();
    this.tourSteps = null;
    this.tourLayout = null;
    this.inspectorOpen = this.inspectorBeforeTour;
    try {
      localStorage.setItem(TOUR_SEEN_KEY, '1');
    } catch {
      // Private windows can refuse storage, so the tour may show again next time.
    }
  }

  stopTourListeners() {
    window.removeEventListener('resize', this.placeTour);
    document.removeEventListener('scroll', this.placeTour, true);
  }

  tourTarget(): HTMLElement | null {
    const step = this.tourSteps?.[this.tourIndex];
    if (step?.target !== 'field') {
      return step ? this.el.querySelector<HTMLElement>(step.target) : null;
    }

    const field = this.findField(this.selectedFieldName);
    const el = field ? document.getElementById(getFieldId(field)) : null;
    return el && this.el.contains(el) ? el : null;
  }

  // Spotlights the step's target and puts the card beside tall targets, otherwise below (or above, near the bottom).
  placeTour = () => {
    if (!this.tourSteps || !this.tourEl) {
      return;
    }

    const frame = this.tourEl.getBoundingClientRect();
    const cardWidth = 300;
    const cardHeight = this.tourCardEl?.offsetHeight || 190;
    const gap = 14;
    const rect = this.tourTarget()?.getBoundingClientRect();
    let layout: TTourLayout;
    if (!rect) {
      layout = {spot: null, left: (frame.width - cardWidth) / 2, top: (frame.height - cardHeight) / 2, arrow: 'none', arrowAt: 0};
    } else {
      const spot = {left: rect.left - frame.left - 6, top: rect.top - frame.top - 6, width: rect.width + 12, height: rect.height + 12};
      const inside = (left: number) => clamp(left, 12, frame.width - cardWidth - 12);
      if (spot.height > frame.height * 0.5) {
        const right = spot.left + spot.width + gap + cardWidth <= frame.width - 12;
        const top = clamp(spot.top + 40, 12, frame.height - cardHeight - 12);
        layout = {spot, left: right ? spot.left + spot.width + gap : spot.left - gap - cardWidth, top, arrow: right ? 'left' : 'right', arrowAt: 26};
      } else {
        const below = spot.top + spot.height + gap + cardHeight <= frame.height - 12;
        const left = inside(spot.left);
        layout = {
          spot,
          left,
          top: below ? spot.top + spot.height + gap : spot.top - gap - cardHeight,
          arrow: below ? 'up' : 'down',
          arrowAt: clamp(spot.left + Math.min(spot.width, 80) / 2 - left, 16, cardWidth - 30),
        };
      }
    }

    if (JSON.stringify(layout) !== JSON.stringify(this.tourLayout)) {
      this.tourLayout = layout;
    }
  };

  renderTour() {
    const step = this.tourSteps[this.tourIndex];
    const last = this.tourIndex === this.tourSteps.length - 1;
    const layout = this.tourLayout;
    const px = (value: number) => `${Math.round(value)}px`;

    return (
      <div class="tour" ref={el => (this.tourEl = el)} role="dialog" aria-modal="true" aria-label="Builder tour">
        {layout?.spot ? (
          <div class="tour-spot" style={{left: px(layout.spot.left), top: px(layout.spot.top), width: px(layout.spot.width), height: px(layout.spot.height)}} />
        ) : (
          <div class="tour-shade" />
        )}
        <div
          class={{'tour-card': true, [`arrow-${layout?.arrow}`]: !!layout}}
          ref={el => (this.tourCardEl = el)}
          style={layout ? {'left': px(layout.left), 'top': px(layout.top), '--arrow-at': px(layout.arrowAt)} : {visibility: 'hidden'}}
        >
          <div class="tour-rail">
            {this.tourSteps.map((_, index) => (
              <i class={{done: index < this.tourIndex, on: index === this.tourIndex}} />
            ))}
          </div>
          <div class="tour-title">
            <span class="tour-num">{this.tourIndex + 1}</span>
            {step.title}
          </div>
          <div class="tour-body">{step.body}</div>
          <div class="tour-actions">
            {!last && (
              <button type="button" class="tour-skip" onClick={() => this.endTour()}>
                Skip tour
              </button>
            )}
            {this.tourIndex > 0 && (
              <button type="button" class="tour-back" onClick={() => this.showTourStep(this.tourIndex - 1)}>
                Back
              </button>
            )}
            <button type="button" class="tour-next" onClick={() => this.showTourStep(this.tourIndex + 1)}>
              {last ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  setZoom(zoom: TZoom) {
    this.zoom = zoom;
    this.zoomMenuOpen = false;
    try {
      localStorage.setItem(ZOOM_STORAGE_KEY, String(zoom));
    } catch {
      // Private windows can refuse storage, and zoom still works for this visit.
    }
  }

  // Pages never grow past their column, so that's the widest zoom, as a percent of the first page's own width.
  widestZoom() {
    const pageWidth = this.template?.documents?.[0]?.page_sizes?.[1]?.width || 612;
    return Math.floor((((this.pagesEl?.clientWidth || 0) - PAGES_PADDING) / pageWidth) * 100);
  }

  stepZoom(direction: 1 | -1) {
    const widest = this.widestZoom();
    if (direction > 0) {
      const next = ZOOM_STEPS.find(step => step > this.zoomPercent + 1);
      this.setZoom(!next || next >= widest ? 'width' : next);
    } else {
      const next = [...ZOOM_STEPS].reverse().find(step => step < this.zoomPercent - 1);
      if (next) {
        this.setZoom(next);
      }
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

    this.paletteDrag = {type, roleName, ghost, width, height, over: null, startX: e.clientX, startY: e.clientY, moved: false, placing: false};
    window.addEventListener('pointermove', this.handlePaletteMove);
    window.addEventListener('pointerup', this.handlePaletteDrop);
    this.handlePaletteMove(e);
  }

  // For anyone who can't drag: the next press on a page places the field, and a press anywhere else puts it back.
  handlePlacementPress = (e: PointerEvent) => {
    const drag = this.paletteDrag;
    if (!drag) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    // The click that follows would land on the page and clear the new field's selection
    window.addEventListener('click', ev => ev.stopPropagation(), {capture: true, once: true});
    this.handlePaletteMove(e);
    drag.moved = true;
    this.handlePaletteDrop();
  };

  // Enter or Space on a palette field adds it to the middle of the page in view, selected, so arrow keys can move it.
  placeFromKeyboard(e: KeyboardEvent, type: TFieldType) {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    e.preventDefault();
    const roleName = this.paletteRoleName();
    if (!roleName) {
      this.showMustSelectRole = true;
      return;
    }

    const middle = window.innerHeight / 2;
    const pages = [...this.el.querySelectorAll('verdocs-template-document-page')];
    const page = pages.find(el => {
      const rect = el.getBoundingClientRect();
      return rect.top <= middle && rect.bottom >= middle;
    }) || pages.find(el => el.getBoundingClientRect().bottom > 0);
    const documentId = page?.getAttribute('document-id');
    const pageNumber = +page?.getAttribute('page-number');
    const pageInfo = documentId ? this.cachedPageInfo[documentId]?.[pageNumber] : null;
    if (!pageInfo) {
      return;
    }

    const rect = page.getBoundingClientRect();
    const width = defaultWidth(type);
    const height = defaultHeight(type);
    const {naturalWidth = 612, naturalHeight = 792, yScale = 1} = pageInfo;
    const visibleMiddle = (Math.max(rect.top, 0) + Math.min(rect.bottom, window.innerHeight)) / 2 - rect.top;
    const x = Math.round(naturalWidth / 2 - width / 2);
    const y = Math.round((rect.height - visibleMiddle) / yScale - height / 2);

    this.addField({
      name: this.generateFieldName(type, pageNumber),
      role_name: roleName,
      template_id: this.templateId,
      document_id: documentId,
      type,
      required: defaultRequired(type),
      page: pageNumber,
      validator: null,
      label: null,
      default: null,
      placeholder: null,
      group: type === 'radio' ? this.generateGroupName() : null,
      settings: {},
      x: Math.min(Math.max(x, 0), naturalWidth - width),
      y: Math.min(Math.max(y, 0), naturalHeight - height),
      width,
      height,
      multiline: false,
      readonly: false,
      options: type === 'radio' ? [{id: 'option-1', label: 'Option 1'}] : [],
    });
  }

  handlePaletteMove = (e: PointerEvent) => {
    const drag = this.paletteDrag;
    if (!drag) {
      return;
    }

    if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4) {
      drag.moved = true;
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
      tip.textContent = drag.placing ? 'Click a page to place it' : 'Drop on a page';
    }

    drag.ghost.style.left = `${left}px`;
    drag.ghost.style.top = `${top}px`;
  };

  handlePaletteDrop = () => {
    const drag = this.paletteDrag;
    // A press and release without moving picks the field up instead of dropping it
    if (drag && !drag.moved && !drag.placing) {
      drag.placing = true;
      drag.ghost.querySelector('.tip').textContent = 'Click a page to place it';
      window.removeEventListener('pointerup', this.handlePaletteDrop);
      window.addEventListener('pointerdown', this.handlePlacementPress, {capture: true});
      return;
    }

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
    window.removeEventListener('pointerdown', this.handlePlacementPress, {capture: true});
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
      <div class={{'insp-col': true, open}} data-section={id}>
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
    const config = (field.config?.type === 'textbox' || field.config?.type === 'textarea' ? field.config : {type: field.type}) as ITextFieldConfig;
    const saveConfig = (changes: Partial<ITextFieldConfig>) => this.saveField(field.name, {config: tidyConfig({...config, ...changes})});
    const formatValue = !field.validator && (config.validation?.pattern || this.patternField === field.name) ? 'pattern' : field.validator || '';
    // A radio group's members all share one config
    const settings = <T extends TFieldConfig>() => (field.config?.type === field.type ? field.config : {type: field.type}) as T;
    const saveSettings = <T extends TFieldConfig>(changes: Partial<T>) => this.saveGroup(field, {config: tidyConfig({...settings<T>(), ...changes})});

    const fit =
      this.fitDraft?.name === field.name ? this.fitDraft : {max: config.fit?.max_font_size ?? FIT_DEFAULT, min: config.fit?.min_font_size ?? config.fit?.max_font_size ?? FIT_DEFAULT};
    const fitRatio = (size: number) => String(Math.min(1, Math.max(0, (size - FIT_RANGE.min) / (FIT_RANGE.max - FIT_RANGE.min))));
    // Dragging one handle past the other pushes it along
    const dragFit = (min: number, max: number) => (this.fitDraft = {name: field.name, min, max});
    const saveFitSizes = () => {
      const draft = this.fitDraft;
      if (draft?.name === field.name) {
        saveConfig({fit: tidyFit({...config.fit, max_font_size: draft.max, min_font_size: draft.min})}).then(() => (this.fitDraft = null));
      }
    };
    const fitSummary = [
      fit.min < fit.max ? `${fit.max} to ${fit.min} pt` : `${fit.max} pt`,
      config.fit?.overflow === 'truncate' ? 'Cut off' : config.fit?.overflow === 'ellipsize' ? 'Ellipsis' : '',
    ]
      .filter(Boolean)
      .join(' · ');

    const stamp = settings<ISignatureFieldConfig>().stamp || {};
    const signer = field.type === 'initial' ? 'initials' : 'signature';
    const stampSummary =
      stamp.hash !== false && stamp.date !== false ? 'Hash and date' : stamp.hash !== false ? 'Hash only' : stamp.date !== false ? 'Date only' : `${signer.charAt(0).toUpperCase()}${signer.slice(1)} only`;
    const includeTime = settings<ITimestampFieldConfig>().include_time !== false;
    const checkbox = settings<ICheckboxFieldConfig>();

    const geometry = this.currentGeometry(field);
    const pageSize = (this.template?.documents || []).find(doc => doc.id === field.document_id)?.page_sizes?.[field.page];
    const pageWidth = pageSize?.width || 612;
    const pageHeight = pageSize?.height || 792;
    const toggleField = field.type === 'checkbox' || field.type === 'radio';
    const [minWidth, minHeight] = MIN_SIZES[field.type] || [8, 8];
    // Typed values stay on the page and no smaller than dragging allows. A radio group's options share one size.
    const saveGeometry = (key: 'x' | 'y' | 'width' | 'height' | 'size', e: any) => {
      const typed = Math.round(Number(e.target.value));
      if (e.target.value.trim() === '' || !Number.isFinite(typed)) {
        e.target.value = String(key === 'size' ? geometry.width : geometry[key]);
        return;
      }

      const {x, y, width, height} = geometry;
      if (key === 'size') {
        const size = clamp(typed, minWidth, Math.min(pageWidth - x, pageHeight - y));
        e.target.value = String(size);
        members.forEach(member => this.saveField(member.name, {width: size, height: size}, this.currentGeometry(member)));
        return;
      }

      const value =
        key === 'x'
          ? clamp(typed, 0, pageWidth - width)
          : key === 'y'
            ? clamp(typed, 0, pageHeight - height)
            : key === 'width'
              ? clamp(typed, minWidth, pageWidth - x)
              : clamp(typed, minHeight, pageHeight - y);
      e.target.value = String(value);
      if (value !== geometry[key]) {
        // A text field's height decides whether it takes more than one line, as when it's resized
        this.saveField(field.name, {[key]: value, ...(key === 'height' && textField ? {multiline: value > 15} : {})}, geometry);
      }
    };

    const date = settings<IDateFieldConfig>();
    const allowed = this.dateBetween === field.name || date.min || date.max ? 'between' : date.allowed || 'any';
    const dateSummary = [
      allowed === 'past'
        ? 'Past dates'
        : allowed === 'future'
          ? 'Future dates'
          : date.min && date.max
            ? `${usDate(date.min)} to ${usDate(date.max)}`
            : date.min
              ? `From ${usDate(date.min)}`
              : date.max
                ? `Until ${usDate(date.max)}`
                : 'Any date',
      date.starts_today && 'Starts today',
    ]
      .filter(Boolean)
      .join(' · ');

    const attachment = settings<IAttachmentFieldConfig>();
    const attachmentSummary = [
      attachment.accept?.length ? attachment.accept.join(', ') : 'Any file',
      `Up to ${attachment.max_size_mb ?? 20} MB`,
      attachment.stamp_card === false && 'Card hidden',
    ]
      .filter(Boolean)
      .join(' · ');
    const saveAccept = (text: string) => {
      const accept = text
        .split(',')
        .map(type => type.trim())
        .filter(Boolean);
      const bad = accept.find(type => !FILE_TYPE.test(type));
      this.acceptError = bad ? `"${bad}" isn't a file type. Use an extension like .pdf or a type like image/*.` : accept.length > 20 ? 'Use 20 file types or fewer.' : '';
      if (!this.acceptError) {
        saveSettings<IAttachmentFieldConfig>({accept: accept.length ? accept : undefined});
      }
    };

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

    const segmented = <T extends string>(label: string, name: string, value: T, choices: [T, string][], pick: (choice: T) => void) => (
      <div class="insp-label">
        {label}
        <div class="insp-seg" role="radiogroup" aria-label={label} data-name={name}>
          {choices.map(([choice, text]) => (
            <button type="button" role="radio" aria-checked={String(choice === value)} class={{on: choice === value}} onClick={() => choice !== value && pick(choice)}>
              {text}
            </button>
          ))}
        </div>
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
        <div class="insp-head" style={{'--vb-color': this.roleColor(field.role_name), '--vb-text': this.roleTextColor(field.role_name)}}>
          <span class="insp-tile" innerHTML={fieldType.icon} />
          <div class="insp-head-text">
            {/* Group names and API names are keys, so they show in mono like their inputs below */}
            <span class={{'insp-title': true, 'mono': radio ? !!field.group : !field.label}}>{(radio && field.group) || field.label || field.name}</span>
            <span class="insp-sub">
              {radio ? `Radio group · ${members.length}` : fieldType.label} · <b>{field.role_name}</b>
            </span>
          </div>
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
                  {segmented('Unselected on the signed PDF', 'stamp_unselected', settings<IRadioFieldConfig>().stamp_unselected ? 'show' : 'hide', SHOW_HIDE, choice =>
                    saveSettings<IRadioFieldConfig>({stamp_unselected: choice === 'show' || undefined}),
                  )}
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
              [
                formatLabel,
                config.number?.style === 'currency' ? config.number.currency || 'USD' : NUMBER_STYLES.find(([style]) => style && style === config.number?.style)?.[1],
                config.input_mask && 'Masked',
              ]
                .filter(Boolean)
                .join(' · '),
              !!(field.validator || config.validation || config.input_mask || config.number),
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
                        // Leaving Pattern or Number drops their settings
                        const next = tidyConfig({
                          ...config,
                          validation: value === 'pattern' ? config.validation : undefined,
                          number: value === 'number' ? config.number : undefined,
                        });
                        const configChange = JSON.stringify(next) !== JSON.stringify(tidyConfig(config)) ? {config: next} : {};
                        if (value !== 'pattern') {
                          this.saveField(field.name, {validator: value || null, ...configChange});
                        } else if (field.validator || configChange.config !== undefined) {
                          this.saveField(field.name, {validator: null, ...configChange});
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
                          value={config.validation?.pattern || ''}
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
                            saveConfig({validation: pattern ? {...config.validation, pattern} : undefined});
                          }}
                          onKeyDown={keys(config.validation?.pattern || '')}
                        />
                      </label>
                      <label class="insp-label">
                        Message when it doesn't match
                        <input
                          name="validation_message"
                          class="insp-input"
                          value={config.validation?.message || ''}
                          placeholder="Optional"
                          onChange={(e: any) => config.validation && saveConfig({validation: {pattern: config.validation.pattern, message: e.target.value.trim() || undefined}})}
                          onKeyDown={keys(config.validation?.message || '')}
                        />
                      </label>
                    </Fragment>
                  )}

                  {formatValue === 'number' && (
                    <Fragment>
                      <div class="insp-two">
                        <label class="insp-label">
                          Show as
                          <select
                            name="number_style"
                            class="insp-input"
                            onChange={(e: any) => {
                              const style = e.target.value || null;
                              saveConfig({number: style ? {...config.number, style, ...(style === 'currency' && !config.number?.currency ? {currency: 'USD'} : {})} : undefined});
                            }}
                          >
                            {NUMBER_STYLES.map(([value, label]) => (
                              <option value={value} selected={(config.number?.style || '') === value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {config.number && (
                          <label class="insp-label">
                            Decimals
                            <select
                              name="number_decimals"
                              class="insp-input"
                              onChange={(e: any) => saveConfig({number: {...config.number, decimals: e.target.value === '' ? undefined : Number(e.target.value)}})}
                            >
                              {['', '0', '1', '2', '3', '4', '5', '6'].map(value => (
                                <option value={value} selected={String(config.number?.decimals ?? '') === value}>
                                  {value || 'Auto'}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      </div>

                      {config.number?.style === 'currency' && (
                        <label class="insp-label">
                          Currency
                          <select name="currency" class="insp-input" onChange={(e: any) => saveConfig({number: {...config.number, currency: e.target.value}})}>
                            {[...new Set([...CURRENCIES, config.number.currency || 'USD'])].map(code => (
                              <option value={code} selected={(config.number.currency || 'USD') === code}>
                                {code}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}

                      {config.number && <div class="insp-hint">Signers see {formatFieldNumber(config.number, '12450')}</div>}

                      {config.number && advanced && (
                        <Fragment>
                          <label class="insp-label">
                            Locale
                            <input
                              name="locale"
                              class="insp-input mono"
                              value={config.number.locale || ''}
                              placeholder="en-US"
                              onChange={(e: any) => {
                                const locale = e.target.value.trim();
                                let known = !locale;
                                try {
                                  known = known || Intl.NumberFormat.supportedLocalesOf([locale]).length > 0;
                                } catch {
                                  known = false;
                                }

                                if (!known) {
                                  this.formatError = 'Use a locale like en-US or de-DE.';
                                  return;
                                }

                                this.formatError = '';
                                saveConfig({number: {...config.number, locale: locale || undefined}});
                              }}
                              onKeyDown={keys(config.number.locale || '')}
                            />
                          </label>
                          <div class="insp-two">
                            {(['min', 'max'] as const).map(key => (
                              <label class="insp-label">
                                {key === 'min' ? 'Minimum' : 'Maximum'}
                                <input
                                  name={`number_${key}`}
                                  type="number"
                                  class="insp-input"
                                  value={config.number[key] ?? ''}
                                  placeholder="None"
                                  onChange={(e: any) => {
                                    const limit = parseFloat(e.target.value);
                                    saveConfig({number: {...config.number, [key]: Number.isNaN(limit) ? undefined : limit}});
                                  }}
                                  onKeyDown={keys(String(config.number[key] ?? ''))}
                                />
                              </label>
                            ))}
                          </div>
                        </Fragment>
                      )}
                    </Fragment>
                  )}

                  {(advanced || config.input_mask) && (
                    <label class="insp-label">
                      Input mask
                      <input
                        name="input_mask"
                        class="insp-input mono"
                        value={config.input_mask || ''}
                        placeholder="(___) ___-____"
                        onChange={(e: any) => {
                          const mask = e.target.value;
                          if (mask && !mask.includes('_')) {
                            this.formatError = 'Use _ for each character the signer types.';
                            return;
                          }

                          this.formatError = '';
                          saveConfig({input_mask: mask || undefined});
                        }}
                        onKeyDown={keys(config.input_mask || '')}
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
                config.max_length && `Up to ${config.max_length} characters`,
                config.text_case && TEXT_CASES.find(([value]) => value === config.text_case)?.[1],
                field.placeholder && `Placeholder "${field.placeholder}"`,
                field.default && `Starts as "${field.default}"`,
              ]
                .filter(Boolean)
                .join(' · ') || 'No placeholder',
              !!(config.max_length || config.text_case || field.placeholder || field.default),
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
                        value={config.max_length ?? ''}
                        placeholder={`Fits the box (${Math.floor((field.width || 150) / 5)})`}
                        onChange={(e: any) => {
                          const max = parseInt(e.target.value, 10);
                          saveConfig({max_length: max > 0 ? max : undefined});
                        }}
                        onKeyDown={keys(String(config.max_length ?? ''))}
                      />
                    </label>
                    <label class="insp-label">
                      Letter case
                      <select name="text_case" class="insp-input" onChange={(e: any) => saveConfig({text_case: e.target.value || undefined})}>
                        {TEXT_CASES.map(([value, label]) => (
                          <option value={value} selected={(config.text_case || '') === value}>
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

          {textField &&
            this.renderSection('fit', 'Fit', fitSummary, !!config.fit, () => (
              <Fragment>
                <div class="insp-label">
                  Font size
                  <div class="insp-range" style={{'--from': fitRatio(fit.min), '--to': fitRatio(fit.max)}}>
                    <input
                      type="range"
                      name="min_font_size"
                      aria-label="Smallest font size"
                      min={FIT_RANGE.min}
                      max={FIT_RANGE.max}
                      step={0.5}
                      value={fit.min}
                      onInput={(e: any) => dragFit(Number(e.target.value), Math.max(Number(e.target.value), fit.max))}
                      onChange={saveFitSizes}
                    />
                    <input
                      type="range"
                      name="max_font_size"
                      aria-label="Starting font size"
                      min={FIT_RANGE.min}
                      max={FIT_RANGE.max}
                      step={0.5}
                      value={fit.max}
                      onInput={(e: any) => dragFit(Math.min(Number(e.target.value), fit.min), Number(e.target.value))}
                      onChange={saveFitSizes}
                    />
                  </div>
                  <div class="insp-range-labels">
                    <span>{fit.min < fit.max ? `Shrinks down to ${fit.min} pt` : "Doesn't shrink"}</span>
                    <span>Starts at {fit.max} pt</span>
                  </div>
                </div>
                {segmented("If it still doesn't fit", 'overflow', config.fit?.overflow || 'overflow', OVERFLOWS, overflow => saveConfig({fit: tidyFit({...config.fit, overflow})}))}
              </Fragment>
            ))}

          {(field.type === 'signature' || field.type === 'initial') &&
            this.renderSection('stamp', 'Stamp', stampSummary, stamp.hash === false || stamp.date === false, () => (
              <Fragment>
                {toggle('Hash', stamp.hash !== false, () => saveSettings<ISignatureFieldConfig>({stamp: tidyGroup({...stamp, hash: stamp.hash === false ? undefined : false})}))}
                {toggle('Date and time', stamp.date !== false, () => saveSettings<ISignatureFieldConfig>({stamp: tidyGroup({...stamp, date: stamp.date === false ? undefined : false})}))}
                <div class="insp-hint">Printed beside the {signer} on the signed PDF.</div>
              </Fragment>
            ))}

          {field.type === 'timestamp' &&
            this.renderSection('timestamp', 'Timestamp', includeTime ? 'Date and time' : 'Date only', !includeTime, () =>
              segmented(
                'Shows',
                'include_time',
                includeTime ? 'time' : 'date',
                [
                  ['time', 'Date and time'],
                  ['date', 'Date only'],
                ],
                choice => saveSettings<ITimestampFieldConfig>({include_time: choice === 'date' ? false : undefined}),
              ),
            )}

          {field.type === 'date' &&
            this.renderSection('date', 'Date', dateSummary, allowed !== 'any' || !!date.starts_today, () => (
              <Fragment>
                {segmented(
                  'Allowed dates',
                  'allowed',
                  allowed,
                  [
                    ['any', 'Any'],
                    ['past', 'Past'],
                    ['future', 'Future'],
                    ['between', 'Between'],
                  ],
                  choice => {
                    this.dateBetween = choice === 'between' ? field.name : '';
                    if (choice !== 'between') {
                      saveSettings<IDateFieldConfig>({allowed: choice === 'any' ? undefined : choice, min: undefined, max: undefined});
                    }
                  },
                )}
                {allowed === 'between' && (
                  <div class="insp-two">
                    <label class="insp-label">
                      From
                      <input
                        name="min"
                        type="date"
                        class="insp-input"
                        value={date.min || ''}
                        max={date.max}
                        onChange={(e: any) => saveSettings<IDateFieldConfig>({allowed: undefined, min: e.target.value || undefined})}
                      />
                    </label>
                    <label class="insp-label">
                      To
                      <input
                        name="max"
                        type="date"
                        class="insp-input"
                        value={date.max || ''}
                        min={date.min}
                        onChange={(e: any) => saveSettings<IDateFieldConfig>({allowed: undefined, max: e.target.value || undefined})}
                      />
                    </label>
                  </div>
                )}
                {segmented(
                  'Starts as',
                  'starts_today',
                  date.starts_today ? 'today' : 'empty',
                  [
                    ['empty', 'Empty'],
                    ['today', 'Today'],
                  ],
                  choice => saveSettings<IDateFieldConfig>({starts_today: choice === 'today' || undefined}),
                )}
              </Fragment>
            ))}

          {field.type === 'attachment' &&
            this.renderSection('attachment', 'Attachment', attachmentSummary, !!attachment.accept?.length || !!attachment.max_size_mb || attachment.stamp_card === false, () => (
              <Fragment>
                <label class="insp-label">
                  File types
                  <input
                    name="accept"
                    class="insp-input mono"
                    value={(attachment.accept || []).join(', ')}
                    placeholder=".pdf, image/*"
                    onChange={(e: any) => saveAccept(e.target.value)}
                    onKeyDown={keys((attachment.accept || []).join(', '))}
                  />
                </label>
                {this.acceptError ? <div class="insp-error">{this.acceptError}</div> : <div class="insp-hint">Leave empty to accept PDF, Word, and image files.</div>}
                <label class="insp-label">
                  Largest file (MB)
                  <input
                    name="max_size_mb"
                    type="number"
                    min="1"
                    max={MAX_ATTACHMENT_MB}
                    class="insp-input"
                    value={attachment.max_size_mb ?? ''}
                    placeholder="20"
                    onChange={(e: any) => {
                      const size = parseFloat(e.target.value);
                      saveSettings<IAttachmentFieldConfig>({max_size_mb: size > 0 ? Math.min(size, MAX_ATTACHMENT_MB) : undefined});
                    }}
                    onKeyDown={keys(String(attachment.max_size_mb ?? ''))}
                  />
                </label>
                {segmented('Card on the signed PDF', 'stamp_card', attachment.stamp_card === false ? 'hide' : 'show', SHOW_HIDE, choice =>
                  saveSettings<IAttachmentFieldConfig>({stamp_card: choice === 'hide' ? false : undefined}),
                )}
              </Fragment>
            ))}

          {field.type === 'checkbox' &&
            this.renderSection(
              'checkbox',
              'Checkbox',
              [field.default === 'true' ? 'Starts checked' : 'Starts unchecked', checkbox.image === 'x' && 'X mark', checkbox.stamp_unchecked === false && 'Unchecked hidden']
                .filter(Boolean)
                .join(' · '),
              field.default === 'true' || checkbox.image === 'x' || checkbox.stamp_unchecked === false,
              () => (
                <Fragment>
                  {toggle('Pre-checked', field.default === 'true', () => this.saveField(field.name, {default: field.default === 'true' ? 'false' : 'true'}))}
                  {segmented(
                    'Mark',
                    'image',
                    checkbox.image === 'x' ? 'x' : 'check',
                    [
                      ['check', '✓ Check'],
                      ['x', '✕ X'],
                    ],
                    image => saveSettings<ICheckboxFieldConfig>({image: image === 'x' ? 'x' : undefined}),
                  )}
                  {segmented('Unchecked on the signed PDF', 'stamp_unchecked', checkbox.stamp_unchecked === false ? 'hide' : 'show', SHOW_HIDE, choice =>
                    saveSettings<ICheckboxFieldConfig>({stamp_unchecked: choice === 'hide' ? false : undefined}),
                  )}
                </Fragment>
              ),
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
                  {segmented(
                    'The signed PDF shows',
                    'stamp',
                    settings<IDropdownFieldConfig>().stamp === 'label' ? 'label' : 'id',
                    [
                      ['label', 'Label'],
                      ['id', 'ID'],
                    ],
                    choice => saveSettings<IDropdownFieldConfig>({stamp: choice === 'label' ? 'label' : undefined}),
                  )}
                </Fragment>
              ),
              true,
            )}

          {this.renderSection(
            'position',
            'Position',
            toggleField ? `${geometry.width} pt at ${geometry.x}, ${geometry.y}` : `${geometry.width} × ${geometry.height} at ${geometry.x}, ${geometry.y}`,
            false,
            () => (
              <Fragment>
                <div class="insp-two">
                  <label class="insp-label">
                    X
                    <input name="x" type="number" class="insp-input" value={geometry.x} onChange={(e: any) => saveGeometry('x', e)} onKeyDown={keys(String(geometry.x))} />
                  </label>
                  <label class="insp-label">
                    Y
                    <input name="y" type="number" class="insp-input" value={geometry.y} onChange={(e: any) => saveGeometry('y', e)} onKeyDown={keys(String(geometry.y))} />
                  </label>
                </div>
                {toggleField ? (
                  <div class="insp-two">
                    <label class="insp-label">
                      Size
                      <input
                        name="size"
                        type="number"
                        min={minWidth}
                        class="insp-input"
                        value={geometry.width}
                        onChange={(e: any) => saveGeometry('size', e)}
                        onKeyDown={keys(String(geometry.width))}
                      />
                    </label>
                  </div>
                ) : (
                  <div class="insp-two">
                    <label class="insp-label">
                      Width
                      <input
                        name="width"
                        type="number"
                        min={minWidth}
                        class="insp-input"
                        value={geometry.width}
                        onChange={(e: any) => saveGeometry('width', e)}
                        onKeyDown={keys(String(geometry.width))}
                      />
                    </label>
                    <label class="insp-label">
                      Height
                      <input
                        name="height"
                        type="number"
                        min={minHeight}
                        class="insp-input"
                        value={geometry.height}
                        onChange={(e: any) => saveGeometry('height', e)}
                        onKeyDown={keys(String(geometry.height))}
                      />
                    </label>
                  </div>
                )}
                <div class="insp-hint">In points, from the page's bottom-left corner.</div>
              </Fragment>
            ),
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

  renderZoomBar() {
    const widest = this.widestZoom();
    const choices: [TZoom, string][] = [['page', 'Whole page'], ['width', 'Page width'], ...ZOOM_STEPS.filter(step => step < widest).map(step => [step, `${step}%`] as [TZoom, string])];

    return (
      <div class="zoom-dock">
        {this.zoomMenuOpen && <div class="zoom-backdrop" onClick={() => (this.zoomMenuOpen = false)} />}
        <div class="zoom-bar">
          <button type="button" class="zoom-step" title="Zoom out" aria-label="Zoom out" disabled={this.zoomPercent <= ZOOM_STEPS[0]} onClick={() => this.stepZoom(-1)}>
            −
          </button>
          <button type="button" class="zoom-current" aria-haspopup="menu" aria-expanded={String(this.zoomMenuOpen)} onClick={() => (this.zoomMenuOpen = !this.zoomMenuOpen)}>
            {this.zoom === 'page' ? 'Whole page' : this.zoom === 'width' ? 'Page width' : `${this.zoomPercent}%`}
          </button>
          <button
            type="button"
            class="zoom-step"
            title="Zoom in"
            aria-label="Zoom in"
            disabled={this.zoom === 'width' || this.zoomPercent >= widest}
            onClick={() => this.stepZoom(1)}
          >
            +
          </button>
          {this.zoomMenuOpen && (
            <div class="zoom-menu" role="menu">
              {choices.map(([value, label]) => (
                <button type="button" role="menuitemradio" aria-checked={String(value === this.zoom)} data-zoom={String(value)} onClick={() => this.setZoom(value)}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
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
        <button class="quick-button icon reset" title="Reset size and settings" aria-label="Reset size and settings" innerHTML={ResetIcon} onClick={() => this.resetField(field)} />
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
            <div
              class="palette-field"
              role="button"
              tabIndex={0}
              aria-label={`Add a ${fieldType.label.toLowerCase()} field`}
              onPointerDown={(e: PointerEvent) => this.startPaletteDrag(e, fieldType.type)}
              onKeyDown={(e: KeyboardEvent) => this.placeFromKeyboard(e, fieldType.type)}
            >
              <span class="palette-icon" style={{'--vb-color': this.roleColor(paletteRoleName), '--vb-text': this.roleTextColor(paletteRoleName)}} innerHTML={fieldType.icon} />
              {fieldType.label}
              <span class="grip" />
            </div>
          ))}
          <div class="palette-hint">Drag a field onto the page, or click it and then click where it goes.</div>
          {this.showTour && (
            <button type="button" class="tour-help" title="Show the builder tour" aria-label="Show the builder tour" onClick={() => this.startTour()}>
              ?
            </button>
          )}
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
                    style={
                      this.zoom === 'page'
                        ? {width: `min(100%, calc((100cqh - ${PAGES_PADDING}px) * ${(pageSize?.width || 612) / (pageSize?.height || 792)}))`}
                        : typeof this.zoom === 'number'
                          ? {width: `min(100%, ${((pageSize?.width || 612) * this.zoom) / 100}px)`}
                          : {}
                    }
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
          {this.renderZoomBar()}
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

        {this.tourSteps && this.renderTour()}

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
