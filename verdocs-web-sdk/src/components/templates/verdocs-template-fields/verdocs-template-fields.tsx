import interact from 'interactjs';
import {Component, h, Element, Event, EventEmitter, Fragment, Prop, Host, State, Listen, Watch} from '@stencil/core';
import {createField, getTemplate, integerSequence, ITemplate, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {defaultHeight, defaultWidth, getFieldId, removeCssTransform, setControlStyles, updateCssTransform} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
import {DocumentPageIcon} from '../../../utils/Icons';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const iconTextbox = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>';

const iconCheck =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="m10.55 16.55 7.275-7.275L16.05 7.5l-5.5 5.45-2.675-2.65L6.1 12.075Zm-5.375 4.925q-1.125 0-1.887-.763-.763-.762-.763-1.887V5.175q0-1.125.763-1.888.762-.762 1.887-.762h13.65q1.125 0 1.888.762.762.763.762 1.888v13.65q0 1.125-.762 1.887-.763.763-1.888.763Zm0-2.65h13.65V5.175H5.175v13.65Zm0-13.65v13.65-13.65Z"/></svg>';

const iconRadio =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5.85q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Zm0-3.15q3.25 0 5.475-2.225Q19.7 15.25 19.7 12q0-3.25-2.225-5.475Q15.25 4.3 12 4.3q-3.25 0-5.475 2.225Q4.3 8.75 4.3 12q0 3.25 2.225 5.475Q8.75 19.7 12 19.7Zm0-7.7Z"/></svg>';

const iconDatepicker =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M7.6 13.925q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375ZM5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Zm0 0V6.3 8Z"/></svg>';

const iconSignature =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Zm-3.725-.625-.6-.575 1.175 1.175Z"/></svg>';

const iconInitial =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M6.225 20.775V7h-5V3.225H15V7h-5v13.775Zm9.775 0v-8h-3V9h9.775v3.775h-3v8Z"/></svg>';

// const iconTimestamp =
//   '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M9 1h6v2H9zm10.03 6.39 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM13 14h-2V8h2v6z"></path></svg>';

const iconDropdown =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" stroke-width="1.5" stroke="currentColor"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>';

const iconAttachment =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>';

const separator = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.707 14.707"><g><rect x="6.275" y="0" fill="#ffffff7f" width="1" height="15"/></g></svg>';

// We include multiline because a text field's height controls it, so undoing a resize has to restore both.
type TFieldGeometry = Pick<ITemplateField, 'x' | 'y' | 'width' | 'height' | 'page' | 'multiline'>;

const GEOMETRY_KEYS: (keyof TFieldGeometry)[] = ['x', 'y', 'width', 'height', 'page', 'multiline'];

// We save a burst of arrow-key nudges once the keys go quiet instead of on every press.
const NUDGE_SAVE_DELAY_MS = 400;

const MAX_UNDO = 50;

const isTypingTarget = (el: Element | null) => !!el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || (el as HTMLElement).isContentEditable);

const menuOptions = [
  {id: 'signature', tooltip: 'Signature', icon: iconSignature, class: 'signature'},
  {id: 'initial', tooltip: 'Initials', icon: iconInitial, class: 'initial'},
  {id: 'sep1', tooltip: '', icon: separator, class: 'separator'},
  {id: 'textbox', tooltip: 'Text Box', icon: iconTextbox, class: 'textbox'},
  {id: 'checkbox', tooltip: 'Check Box', icon: iconCheck, class: 'checkbox'},
  {id: 'radio', tooltip: 'Radio Button', icon: iconRadio, class: 'radio'},
  {id: 'dropdown', tooltip: 'Dropdown', icon: iconDropdown, class: 'dropdown'},
  {id: 'sep2', tooltip: '', icon: separator, class: 'separator'},
  {id: 'date', tooltip: 'Date', icon: iconDatepicker, class: 'date'},
  // {id: 'timestamp', tooltip: 'Timestamp', icon: iconTimestamp, class: 'timestamp'},
  // {id: 'sep3', tooltip: '', icon: separator},
  {id: 'attachment', tooltip: 'Attachment', icon: iconAttachment, class: 'attachment'},
  // {id: 'payment', tooltip: 'Payment', icon: 'P'},
];

/**
 * Displays a builder experience for laying out fields in a template. Note that this experience requires a large display area to
 * present all of the required controls, so it is primarily intended to be used in desktop environments.
 */
@Component({
  tag: 'verdocs-template-fields',
  styleUrl: 'verdocs-template-fields.scss',
  shadow: false,
})
export class VerdocsTemplateFields {
  private templateListenerId = null;

  @Element() el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop({reflect: true, mutable: true}) templateId: string | null = null;

  /**
   * If set, (recommended), the host application should create a <DIV> element with a unique ID. When this
   * component renders, the toolbar will be removed from its default location and placed in the target element.
   * This allows the parent application to more easily control its placement and scroll effects.
   *
   * The movement of the toolbar to the target container is not dynamic - it is performed only on the initial
   * render. Host applications should not conditionally render this container. If the toolbar's visibility must
   * be externally controlled, use CSS display options to hide/show it instead.
   */
  @Prop() toolbarTargetId: string | null = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: 'added-field' | 'updated-field' | 'deleted-field'}>;

  @State() placing: TFieldType | null = null;
  @State() showMustSelectRole = false;
  @State() selectedRoleName = '';

  @State() loading = true;
  @State() template: ITemplate | null = null;

  pageHeights: Record<number, number> = {};

  // Selection lives on the DOM (a class on the field element) so picking a field doesn't re-render every page.
  selectedFieldName: string | null = null;

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

  // Stable references so makeDraggable can re-bind them on every render without stacking duplicates.
  handleFieldTap = (e: any) => this.selectField(e.currentTarget?.getAttribute?.('fieldname') || null);
  handleFieldResizeStart = (e: any) => {
    const name = e.target?.getAttribute?.('fieldname') || null;
    this.flushNudge();
    this.selectField(name);
    this.startResize(name);
  };

  @Watch('templateId')
  onTemplateIdChanged() {
    this.listenToTemplate();
  }

  // Escape clears placement and selection, arrows nudge the selected field (Shift for 10pt), and Cmd/Ctrl+Z undoes a move or resize.
  @Listen('keydown', {target: 'document'})
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.placing = null;
      this.selectField(null);
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

    if ((ev.metaKey || ev.ctrlKey) && !ev.shiftKey && !ev.altKey && ev.key.toLowerCase() === 'z') {
      if (this.pendingNudge || this.undoStack.length > 0 || this.inFlight.size > 0 || this.pendingResizes.size > 0) {
        ev.preventDefault();
        this.undo();
      }
      return;
    }

    const step = ev.shiftKey ? 10 : 1;
    const delta = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step]}[ev.key];
    if (!delta || !this.selectedFieldName || ev.metaKey || ev.ctrlKey || ev.altKey) {
      return;
    }

    // Once the selected field has scrolled out of view, arrows go back to scrolling the page.
    const field = this.findField(this.selectedFieldName);
    const rect = field ? document.getElementById(getFieldId(field))?.getBoundingClientRect() : null;
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

  @Listen('deleted')
  handleFieldDeleted(e: CustomEvent<{fieldName: string}>) {
    const name = e.detail?.fieldName;
    if (name) {
      this.forgetField(name);
    }

    this.templateUpdated?.emit({endpoint: this.endpoint, template: this.template, event: 'deleted-field'});
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[FIELDS] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[FIELDS] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[FIELDS] Error with fields session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    interact.dynamicDrop(true);

    // Defensive re-attach: when returning to the Fields tab from Preview, the preview component
    // may have unset interact bindings on shared field DOM elements. pageRendered doesn't always
    // refire in that case, so ensure every .verdocs-field in the document has a drag handler.
    // makeDraggable is idempotent (interact re-configures the same Interactable).
    document.querySelectorAll('.verdocs-field').forEach(el => {
      this.makeDraggable(el as HTMLElement);
    });

    const toolbarTarget = this.toolbarTargetId ? document.getElementById(this.toolbarTargetId) : null;
    const toolbarEl = document.getElementById('verdocs-template-fields-toolbar');
    if (toolbarTarget && toolbarEl) {
      toolbarEl.remove();
      toolbarTarget.append(toolbarEl);
    }

    this.applySelection();
  }

  componentWillUpdate() {
    // If a new role was added and there were none yet so far, or the "selected" role was deleted, reset our selection
    const roles = [...(this.template?.roles || [])].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    if (!this.selectedRoleName || !roles.find(role => role && role.name === this.selectedRoleName)) {
      this.selectedRoleName = roles[0]?.name || '';
      console.log('[FIELDS] Selected new role', this.selectedRoleName);
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
    this.flushNudge();
    this.selectField(null);
  }

  async listenToTemplate() {
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        console.log('Template updated');
        this.template = template;
        this.loading = false;

        if (!this.selectedRoleName) {
          const sorted = [...(template.roles || [])].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
          this.selectedRoleName = sorted[0]?.name || '';
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

  cachedPageInfo: Record<string, Record<number, IDocumentPageInfo>> = {};
  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[FIELDS] Page rendered', pageInfo.documentId, pageInfo.pageNumber, pageInfo.xScale, pageInfo.yScale);
    this.cachedPageInfo[pageInfo.documentId] ??= {};
    this.cachedPageInfo[pageInfo.documentId][pageInfo.pageNumber] = pageInfo;

    this.pageHeights[pageInfo.pageNumber] = pageInfo.naturalHeight;

    (this.template?.fields || [])
      .filter(field => field && field.page === pageInfo.pageNumber)
      .forEach(field => {
        const id = getFieldId(field);
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute('templateid', this.templateId);
          el.setAttribute('fieldname', field.name);
          el.setAttribute('documentid', String(field.document_id));
          el.setAttribute('pagenumber', String(field.page));
          el.setAttribute('xScale', String(pageInfo.xScale));
          el.setAttribute('yScale', String(pageInfo.yScale));
          this.makeDraggable(el);
        }
      });
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

    this.selectedFieldName = name;
    this.applySelection();
  }

  applySelection() {
    document.querySelectorAll('.verdocs-field-selected').forEach(el => el.classList.remove('verdocs-field-selected'));
    const field = this.findField(this.selectedFieldName);
    if (field) {
      document.getElementById(getFieldId(field))?.classList.add('verdocs-field-selected');
    }
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
      await this.saveGeometry(pending.name, {x: pending.x, y: pending.y}, pending.before);
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
        await this.saveGeometry(name, before);
        return;
      }
    }
  }

  // Saves a move, nudge, or undo, drawing the field at its new spot right away. Pass `before` to make it undoable.
  saveGeometry(name: string, geometry: Partial<TFieldGeometry>, before?: TFieldGeometry) {
    const field = this.findField(name);
    if (!field) {
      return Promise.resolve();
    }

    const sent = {...geometry};
    this.optimistic.set(name, sent);
    this.drawField(field, geometry);

    const save = (async () => {
      try {
        const updatedField = await updateField(this.endpoint, this.templateId, name, geometry);
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
        console.log('[FIELDS] Error saving field position', e);
        VerdocsToast(e.response?.data?.error || 'Unable to move the field. Please try again.', {style: 'error'});
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

  handleMoveStart(event: any) {
    const name = event.target.getAttribute('fieldname');
    this.flushNudge();
    this.selectField(name);

    const field = this.findField(name);
    this.dragBefore = field ? {name, before: this.currentGeometry(field)} : null;
  }

  async handleMoveField(event: any) {
    const oldX = +(event.target.getAttribute('posX') || 0);
    const oldY = +(event.target.getAttribute('posY') || 0);
    const xScale = +(event.target.getAttribute('xScale') || 1);
    const yScale = +(event.target.getAttribute('yScale') || 1);
    const newX = event.dx / xScale + oldX;
    const newY = event.dy / yScale + oldY;
    event.target.setAttribute('posX', newX);
    event.target.setAttribute('posy', newY);
    updateCssTransform(event.target, 'translate', `${newX}px, ${newY}px`);
  }

  async handleMoveEnd(event: any) {
    const name = event.target.getAttribute('fieldname');
    const field = (this.template?.fields || []).find(field => field.name === name);
    if (!field) {
      console.log('[FIELDS] Unable to find field', name, event.target);
      return;
    }

    const pageNumber = event.target.getAttribute('pagenumber');
    const documentId = event.target.getAttribute('documentid');
    let {naturalWidth = 612, naturalHeight = 792, renderedHeight = 792} = this.cachedPageInfo[documentId][pageNumber];
    const clientRect = event.target.getBoundingClientRect();
    const parent = event.target.parentElement;
    const parentRect = parent.getBoundingClientRect();

    const width = field.width || defaultWidth(field.type);
    const height = field.height || defaultHeight(field.type);

    // These two being backwards is not a mistake. Left measures "over" from the left
    // (positive displacement) while bottom measures "up" from the bottom (negative displacement).
    const newX = Math.max(clientRect.left - parentRect.left, 0);
    let newY = Math.max(renderedHeight - (parentRect.bottom - clientRect.bottom), 0);

    let newPageNumber = parseInt(pageNumber);
    if (newY > renderedHeight) {
      newPageNumber = Math.min(newPageNumber + 1, (this.template?.documents || [])?.[0]?.pages || 1);
      newY -= renderedHeight;
      renderedHeight = this.cachedPageInfo[documentId][newPageNumber].renderedHeight;

      console.log('Next page', {newPageNumber, newY, renderedHeight});
    } else if (newY < 0) {
      newPageNumber = Math.max(newPageNumber - 1, 1);
      renderedHeight = this.cachedPageInfo[documentId][newPageNumber].renderedHeight;
      newY += renderedHeight;
      console.log('[FIELDS] Next page', {newPageNumber, newY, renderedHeight});
    }

    const {x, y} = this.viewCoordinatesToPageCoordinates(newX, newY, documentId, pageNumber, naturalWidth - width, naturalHeight - height);
    event.target.removeAttribute('posX');
    event.target.removeAttribute('posY');
    removeCssTransform(event.target);

    const before = this.dragBefore?.name === name ? this.dragBefore.before : undefined;
    this.dragBefore = null;
    await this.saveGeometry(name, {x, y, page: newPageNumber}, before);
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

  async handleClickPage(e: any, documentId: string, pageNumber: number) {
    // Clicks on a field select it through interact's tap, so only a click on the bare page clears the selection.
    if (!this.placing && !e.target?.closest?.('.verdocs-field')) {
      this.selectField(null);
    }

    if (this.placing) {
      // console.log('Placing field', {documentId, pageNumber});
      const clickedX = e.offsetX;
      const clickedY = e.offsetY;

      const width = defaultWidth(this.placing);
      const height = defaultHeight(this.placing);

      const cachedPage = this.cachedPageInfo[documentId][pageNumber];
      const {naturalWidth = 612, naturalHeight = 792} = cachedPage;

      const coords = this.viewCoordinatesToPageCoordinates(clickedX, clickedY, documentId, pageNumber, naturalWidth - width, naturalHeight - height);
      const x = Math.floor(coords.x);
      const y = Math.floor(coords.y);

      const field: ITemplateField = {
        name: this.generateFieldName(this.placing, pageNumber), //  'textboxP1-22',
        role_name: this.selectedRoleName,
        template_id: this.templateId,
        document_id: cachedPage.documentId,
        type: this.placing,
        required: this.placing !== 'radio' && this.placing !== 'attachment' && this.placing !== 'checkbox',
        page: pageNumber,
        validator: null,
        label: null,
        default: null,
        placeholder: null,
        group: null,
        settings: {},
        x,
        y,
        width,
        height,
        multiline: false,
        readonly: false,
        options: this.placing === 'radio' ? [{id: 'option-1', label: 'Option 1'}] : [],
      };

      const newField = await createField(this.endpoint, this.templateId, field);
      console.log('[FIELDS] Created field', newField);

      const newTemplate = JSON.parse(JSON.stringify(this.template));
      newTemplate.fields.push(newField);

      Store.updateTemplate(this.templateId, newTemplate);
      this.templateUpdated?.emit({endpoint: this.endpoint, template: newTemplate, event: 'added-field'});

      this.placing = null;
    }
  }

  render() {
    console.log('Rendering');
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

    const sortedRoles = [...(this.template?.roles || [])].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    const selectableRoles = sortedRoles.map(role => ({value: role.name, label: role.full_name ? `${role.name}: ${role.full_name}` : role.name}));

    return (
      <Host class={this.placing ? {[`placing-${this.placing}`]: true} : {}} onSubmit={() => {}}>
        <div id="verdocs-template-fields-toolbar">
          <div class="add-for">Add field:</div>
          <verdocs-select-input value={this.selectedRoleName} options={selectableRoles} onInput={(e: any) => (this.selectedRoleName = e.target.value)} />

          {menuOptions.map(option => (
            <verdocs-toolbar-icon
              text={option.tooltip}
              icon={option.icon}
              class={option.class}
              onClick={() => {
                // We ignore empty-tooltip entries because they're separators
                if (option.tooltip) {
                  // We require a role to be selected first
                  if (this.selectedRoleName) {
                    this.placing = option.id as TFieldType;
                  } else {
                    this.showMustSelectRole = true;
                  }
                }
              }}
            />
          ))}
        </div>

        {/* <div class="page-0" ref={el => (this.page0El = el as HTMLDivElement)}>*/}
        {/*  <div class="user-placed-fields">*/}
        {/*    <div class="title">User-Placed Fields</div>*/}
        {/*    <verdocs-field-signature*/}
        {/*      field={testField}*/}
        {/*      style={{width: '82px', height: '41px', left: '20px', top: '40px', transform: 'scale(1,1)', backgroundColor: getRGBA(0)}}*/}
        {/*      moveable={true}*/}
        {/*      editable={true}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div class="pages">
          {(this.template?.documents || []).map(document => {
            const pageNumbers = integerSequence(1, document.pages);

            return pageNumbers.map(page => {
              const pageSize = document.page_sizes[page];

              return (
                <Fragment>
                  {this.template?.documents.length > 1 && (
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
                    onClick={(e: PointerEvent) => this.handleClickPage(e, document.id, page)}
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
        </div>
        {this.showMustSelectRole && (
          <verdocs-ok-dialog
            heading="Unable to add field"
            message={(this.template?.roles || []).length > 0 ? 'Please select a role before adding fields.' : 'Please add at least one role before adding fields.'}
            onNext={() => (this.showMustSelectRole = false)}
          />
        )}
      </Host>
    );
  }
}
