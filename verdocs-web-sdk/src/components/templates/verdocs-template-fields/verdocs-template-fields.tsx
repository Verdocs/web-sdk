import interact from 'interactjs';
import {Component, h, Event, EventEmitter, Prop, Host, State, Listen, Watch} from '@stencil/core';
import {createField, getTemplate, integerSequence, ITemplate, ITemplateField, TFieldType, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {defaultHeight, defaultWidth, getFieldId, removeCssTransform, setControlStyles, updateCssTransform} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
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

const iconTimestamp =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M9 1h6v2H9zm10.03 6.39 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM13 14h-2V8h2v6z"></path></svg>';

const iconDropdown =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" stroke-width="1.5" stroke="currentColor"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>';

const iconAttachment =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>';

const separator = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.707 14.707"><g><rect x="6.275" y="0" fill="#ffffff7f" width="1" height="15"/></g></svg>';

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
  {id: 'timestamp', tooltip: 'Timestamp', icon: iconTimestamp, class: 'timestamp'},
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
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @Event({composed: true}) fieldsUpdated: EventEmitter<{endpoint: VerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; fields: ITemplateField[]}>;

  @State() placing: TFieldType | null = null;
  @State() showMustSelectRole = false;
  @State() selectedRoleName = '';

  @State() loading = true;
  @State() template: ITemplate | null = null;

  pageHeights: Record<number, number> = {};

  @Watch('templateId')
  onTemplateIdChanged() {
    this.listenToTemplate();
  }

  // Stop field-placement mode if ESC is pressed
  @Listen('keydown', {target: 'document'})
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.placing = null;
    }
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

    const toolbarTarget = this.toolbarTargetId ? document.getElementById(this.toolbarTargetId) : null;
    const toolbarEl = document.getElementById('verdocs-template-fields-toolbar');
    if (toolbarTarget && toolbarEl) {
      toolbarEl.remove();
      toolbarTarget.append(toolbarEl);
    }
  }

  componentWillUpdate() {
    // If a new role was added and there were none yet so far, or the "selected" role was deleted, reset our selection
    const roles = this.template?.roles || [];
    if (!this.selectedRoleName || !roles.find(role => role && role.name === this.selectedRoleName)) {
      this.selectedRoleName = roles[0]?.name || '';
      console.log('[FIELDS] Selected new role', this.selectedRoleName);
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        this.template = template;
        this.loading = false;

        if (!this.selectedRoleName) {
          this.selectedRoleName = template.roles?.[0]?.name || '';
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

  attachFieldAttributes(pageInfo: IDocumentPageInfo, field: ITemplateField, el: HTMLInputElement) {
    // el.addEventListener('input', e => this.handleFieldChange(field, e));
    el.addEventListener('settingsChanged', () => {
      this.templateUpdated?.emit({endpoint: this.endpoint, template: this.template, event: 'added-field'});
    });
    el.addEventListener('deleted', () => {
      el.remove();
      this.templateUpdated?.emit({endpoint: this.endpoint, template: this.template, event: 'updated-field'});
    });
    el.setAttribute('templateid', this.templateId);
    el.setAttribute('fieldname', field.name);
    el.setAttribute('pageNumber', String(pageInfo.pageNumber));
    el.setAttribute('xScale', String(pageInfo.xScale));
    el.setAttribute('yScale', String(pageInfo.yScale));
    el.setAttribute('name', field.name);
  }

  cachedPageInfo: Record<number, IDocumentPageInfo> = {};
  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    // console.log('[FIELDS] Page rendered', pageInfo.pageNumber, pageInfo.xScale, pageInfo.yScale);
    this.cachedPageInfo[pageInfo.pageNumber] = pageInfo;

    this.pageHeights[pageInfo.pageNumber] = pageInfo.naturalHeight;

    (this.template?.fields || [])
      .filter(field => field && field.page === pageInfo.pageNumber)
      .forEach(field => {
        const id = getFieldId(field);
        const el = document.getElementById(id);
        if (el) {
          el.setAttribute('fieldname', field.name);
          el.setAttribute('pagenumber', String(field.page));
          this.makeDraggable(el);
        }
      });
  }

  makeDraggable(el: HTMLElement) {
    interact(el).draggable({
      listeners: {
        move: this.handleMoveField.bind(this),
        end: this.handleMoveEnd.bind(this),
      },
    });
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
    let {naturalWidth = 612, naturalHeight = 792, renderedHeight = 792} = this.cachedPageInfo[pageNumber];
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
      renderedHeight = this.cachedPageInfo[newPageNumber].renderedHeight;

      console.log('Next page', {newPageNumber, newY, renderedHeight});
    } else if (newY < 0) {
      newPageNumber = Math.max(newPageNumber - 1, 1);
      renderedHeight = this.cachedPageInfo[newPageNumber].renderedHeight;
      newY += renderedHeight;
      console.log('[FIELDS] Next page', {newPageNumber, newY, renderedHeight});
    }

    const {x, y} = this.viewCoordinatesToPageCoordinates(newX, newY, pageNumber, naturalWidth - width, naturalHeight - height);
    try {
      const params = {x, y, page: newPageNumber};
      const updatedField = await updateField(this.endpoint, this.templateId, name, params);
      console.log('[FIELDS] Updated', updatedField);

      const newTemplate = JSON.parse(JSON.stringify(this.template));
      const fieldIndex = newTemplate.fields.findIndex(field => field.name === name);
      if (fieldIndex > -1) {
        newTemplate.fields[fieldIndex] = updatedField;
      }

      Store.updateTemplate(this.templateId, newTemplate);
      event.target.removeAttribute('posX');
      event.target.removeAttribute('posY');
      removeCssTransform(event.target);
      const {xScale = 1, yScale = 1} = this.cachedPageInfo[pageNumber];
      setControlStyles(event.target, updatedField, xScale, yScale);
      this.templateUpdated?.emit({endpoint: this.endpoint, template: newTemplate, event: 'updated-field'});
    } catch (e) {
      VerdocsToast('Error updating field, please try again later', {style: 'error'});
      console.log('[FIELDS] Error updating field', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      event.target.removeAttribute('posX');
      event.target.removeAttribute('posY');
      removeCssTransform(event.target);
    }
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
  viewCoordinatesToPageCoordinates(viewX: number, viewY: number, pageNumber: number, xMax: number, yMax: number) {
    const {xScale = 1, yScale = 1, renderedHeight = 792} = this.cachedPageInfo[pageNumber];
    const x = Math.floor(Math.min(viewX / xScale, xMax));
    const y = Math.floor(Math.min(Math.max(renderedHeight - viewY, 0) / yScale, yMax));
    return {x, y};
  }

  async handleClickPage(e: any, pageNumber: number) {
    if (this.placing) {
      const clickedX = e.offsetX;
      const clickedY = e.offsetY;

      const width = defaultWidth(this.placing);
      const height = defaultHeight(this.placing);

      const cachedPage = this.cachedPageInfo[pageNumber];
      const {naturalWidth = 612, naturalHeight = 792} = cachedPage;

      const coords = this.viewCoordinatesToPageCoordinates(clickedX, clickedY, pageNumber, naturalWidth - width, naturalHeight - height);
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
      console.log('[FIELDS] Will save new field', field);

      const newField = await createField(this.endpoint, this.templateId, field);
      console.log('[FIELDS] Saved field', newField);

      const newTemplate = JSON.parse(JSON.stringify(this.template));
      newTemplate.fields.push(newField);
      Store.updateTemplate(this.templateId, newTemplate);
      this.templateUpdated?.emit({endpoint: this.endpoint, template: newTemplate, event: 'added-field'});

      this.placing = null;
    }
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

    const selectableRoles = (this.template?.roles || []).map(role => ({value: role.name, label: role.full_name ? `${role.name}: ${role.full_name}` : role.name}));

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
                <verdocs-template-document-page
                  templateId={this.templateId}
                  documentId={document.id}
                  pageNumber={page}
                  virtualWidth={pageSize?.width || 612}
                  virtualHeight={pageSize?.height || 792}
                  disabled={true}
                  editable={true}
                  done={false}
                  onClick={(e: PointerEvent) => this.handleClickPage(e, page)}
                  onPageRendered={e => this.handlePageRendered(e)}
                  layers={[
                    {name: 'page', type: 'canvas'},
                    {name: 'controls', type: 'div'},
                  ]}
                />
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
