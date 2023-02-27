import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {TDocumentFieldType} from '@verdocs/js-sdk/Envelopes/Types';
import {createField, updateField} from '@verdocs/js-sdk/Templates/Fields';
import {IPage, ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, Host, State, Listen} from '@stencil/core';
import {defaultHeight, defaultWidth, getRoleIndex, renderDocumentField, updateCssTransform} from '../../../utils/utils';
import TemplateStore from '../../../utils/templateStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

const iconSingleline = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>';

const iconMultiline =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="#ffffff" d="M3.225 20.725v-3.15h11.55v3.15Zm0-4.775V12.8h17.55v3.15Zm0-4.75V8.05h17.55v3.15Zm0-4.775v-3.15h17.55v3.15Z"/></svg>';

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

const iconClock =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path fill="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

const iconBarsDown =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>';

const menuOptions = [
  // {id: 'attachment', tooltip: 'Attachment', icon: 'A'},
  {id: 'checkbox', tooltip: 'Check Box', icon: iconCheck},
  {id: 'date', tooltip: 'Date', icon: iconDatepicker},
  {id: 'dropdown', tooltip: 'Dropdown', icon: iconBarsDown},
  {id: 'initial', tooltip: 'Initials', icon: iconInitial},
  // {id: 'payment', tooltip: 'Payment', icon: 'P'},
  {id: 'radio', tooltip: 'Radio Button', icon: iconRadio},
  {id: 'signature', tooltip: 'Signature', icon: iconSignature},
  {id: 'textarea', tooltip: 'Text Area', icon: iconMultiline},
  {id: 'textbox', tooltip: 'Text Box', icon: iconSingleline},
  {id: 'timestamp', tooltip: 'Timestamp', icon: iconClock},
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
  // page0El: HTMLDivElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

  /**
   * If set, (recommended), the host application should create a <DIV> element with a unique ID. When this
   * component renders, the toolbar will be removed from its default location and placed in the target element.
   * This allows the parent application to more easily control its placement and scroll effects.
   */
  @Prop() toolbarTargetId: string | null = null;

  /**
   * Event fired when the user completes the step.
   */
  @Event({composed: true}) next: EventEmitter<ITemplate>;

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) templateUpdated: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate; event: string}>;

  @State() placing: TDocumentFieldType | null = null;
  @State() selectedRoleName = '';

  @State() rerender = 1;

  pageHeights: Record<number, number> = {};

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[FIELDS] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[BUILD] Unable to start builder session, must be authenticated');
        return;
      }

      try {
        console.log(`[FIELDS] Loading template ${this.templateId}`, this.endpoint.session);
        await loadTemplate(this.endpoint, this.templateId, true);

        this.selectedRoleName = TemplateStore.roleNames[0];
        console.log('Starting with role', this.selectedRoleName);
      } catch (e) {
        console.log('[FIELDS] Error loading template', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }
    } catch (e) {
      console.log('[FIELDS] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    interact.dynamicDrop(true);

    const toolbarTarget = this.toolbarTargetId ? document.getElementById(this.toolbarTargetId) : null;
    const toolbarEl = document.getElementById('verdocs-template-fields-toolbar');
    if (toolbarTarget && toolbarEl) {
      console.log('[FIELDS] Moving toolbar');
      toolbarEl.remove();
      toolbarTarget.append(toolbarEl);
    }
  }

  // Stop field-placement mode if ESC is pressed
  @Listen('keydown', {target: 'document'})
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.placing = null;
    }
  }

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[FIELDS] handleFieldChange', field, e, optionId);
    this.rerender++;
  }

  attachFieldAttributes(pageInfo, field, roleIndex, el) {
    el.addEventListener('input', e => this.handleFieldChange(field, e));
    el.addEventListener('settingsChanged', () => {
      console.log('settings changed', this, field);
      el.setAttribute('roleindex', getRoleIndex(TemplateStore.roleNames, field.role_name));
      this.rerender++;
      this.templateUpdated?.emit({endpoint: this.endpoint, template: TemplateStore.template, event: 'updated-field'});
    });

    el.addEventListener('deleted', () => {
      console.log('deleted', this, field);
      el.remove();
      this.rerender++;
      this.templateUpdated?.emit({endpoint: this.endpoint, template: TemplateStore.template, event: 'updated-field'});
    });

    el.setAttribute('roleindex', roleIndex);
    el.setAttribute('pageNumber', pageInfo.pageNumber);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);
    el.setAttribute('name', field.name);
  }

  cachedPageInfo: Record<number, IDocumentPageInfo> = {};
  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[FIELDS] Page rendered', pageInfo.pageNumber, pageInfo);
    this.cachedPageInfo[pageInfo.pageNumber] = pageInfo;

    this.pageHeights[pageInfo.pageNumber] = pageInfo.naturalHeight;

    const fields = TemplateStore.fields.filter(field => field.page_sequence === pageInfo.pageNumber);
    // const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    // console.log('[FIELDS] Fields on page', fields);
    fields.forEach(field => {
      const roleIndex = getRoleIndex(TemplateStore.roleNames, field.role_name);
      const el = renderDocumentField(field, pageInfo, roleIndex, {disabled: true, editable: true, draggable: true});
      if (!el) {
        return;
      }

      if (Array.isArray(el)) {
        el.map(e => this.attachFieldAttributes(pageInfo, field, roleIndex, e));
      } else {
        this.attachFieldAttributes(pageInfo, field, roleIndex, el);
      }

      interact(el).draggable({
        listeners: {
          start(event) {
            console.log('[FIELDS] Drag started', event.type, event.target);
          },
          move(event) {
            const oldX = +(event.target.getAttribute('posX') || 0);
            const oldY = +(event.target.getAttribute('posY') || 0);
            const xScale = +(event.target.getAttribute('xScale') || 1);
            const yScale = +(event.target.getAttribute('yScale') || 1);
            const newX = event.dx / xScale + oldX;
            const newY = event.dy / yScale + oldY;
            event.target.setAttribute('posX', newX);
            event.target.setAttribute('posy', newY);
            updateCssTransform(event.target, 'translate', `${newX}px, ${newY}px`);
          },
          end: this.handleMoveField.bind(this),
        },
      });
    });
  }

  async handleMoveField(e: any) {
    const pageNumber = e.target.getAttribute('pageNumber');
    const {naturalWidth = 612, naturalHeight = 792, renderedHeight = 792} = this.cachedPageInfo[pageNumber];
    console.log('[FIELDS] Drag ended', pageNumber, e.target);
    const clientRect = e.target.getBoundingClientRect();
    const parent = e.target.parentElement;
    const parentRect = parent.getBoundingClientRect();
    // These two being backwards is not a mistake. Left measures "over" from the left (positive displacement) while bottom measures
    // "up" from the bottom (negative displacement).
    const newX = Math.max(clientRect.left - parentRect.left, 0);
    const newY = Math.max(renderedHeight - (parentRect.bottom - clientRect.bottom), 0);
    const {x, y} = this.viewCoordinatesToPageCoordinates(newX, newY, pageNumber, naturalWidth - e.rect.width, naturalHeight - e.rect.height);

    const name = e.target.getAttribute('name');
    const field = TemplateStore.fields.find(field => field.name === name);
    if (field) {
      field.setting.x = x;
      field.setting.y = y;
      await updateField(this.endpoint, this.templateId, name, field);
      this.handlePageRendered({detail: this.cachedPageInfo[pageNumber]});
    }
  }

  generateFieldName(type: string, pageNumber: number) {
    let i = 1;
    let fieldName;
    do {
      fieldName = `${type}P${pageNumber}-${i}`;
      i++;
    } while (TemplateStore.fields.some(field => field.name === fieldName));

    console.log('Field name', fieldName);
    return fieldName;
  }

  // Scale the X,Y clicks to the virtual page dimensions. Also ensure the field doesn't go off the page.
  viewCoordinatesToPageCoordinates(viewX: number, viewY: number, pageNumber: number, xMax: number, yMax: number) {
    const {xScale = 1, yScale = 1, renderedHeight = 792} = this.cachedPageInfo[pageNumber];
    const x = Math.floor(Math.min(viewX / xScale, xMax));
    const y = Math.floor(Math.min(Math.max(renderedHeight - viewY, 0) / yScale, yMax));
    return {x, y};
  }

  async handleClickPage(e: any, page: IPage) {
    if (this.placing) {
      console.log('Placing field', this.placing, page.sequence, e.offsetX, e.offsetY);
      const pageNumber = page.sequence;
      const clickedX = e.offsetX;
      const clickedY = e.offsetY;

      const width = defaultWidth(this.placing);
      const height = defaultHeight(this.placing);
      const {naturalWidth = 612, naturalHeight = 792} = this.cachedPageInfo[pageNumber];

      const {x, y} = this.viewCoordinatesToPageCoordinates(clickedX, clickedY, pageNumber, naturalWidth - width, naturalHeight - height);

      const field: ITemplateField = {
        name: this.generateFieldName(this.placing, pageNumber), //  'textboxP1-22',
        role_name: this.selectedRoleName, // 'Buyer',
        template_id: this.templateId,
        type: this.placing,
        required: true,
        page_sequence: pageNumber,
        validator: null,
        setting: {x, y}, // In the future, this is all we should send, see below
      };

      // TODO: Fix how the server validates all this. It uses a JSON schema and is very particular about shapes for each field type.
      //  That makes it harder for third party developers to create fields via API calls. It would be better to always set X/Y and
      //  let the server normalize the rest, discarding properties that are invalid and back-filling defaults as needed.
      switch (field.type) {
        case 'attachment':
        case 'payment':
          field.setting = {x, y};
          break;
        case 'initial':
        case 'signature':
          field.setting = {x, y, result: ''};
          break;
        case 'checkbox_group':
          field.setting = {x, y, minimum_checked: 0, maximum_checked: 1000};
          break;
        case 'date':
          field.setting = {x, y, width, height, result: ''};
          break;

        // TODO: Remove this everywhere
        // case 'checkbox':break;
        // TODO: What is this?
        // case 'placeholder':break;
        case 'dropdown':
          field.setting = {x, y, width, height, value: '', placeholder: 'Select a value'};
          break;

        case 'radio_button_group':
          field.setting = {x, y};
          break;

        // TODO: What about textareas?
        case 'textbox':
          field.setting = {x, y, width, height, result: '', leading: 0, alignment: 0, upperCase: false};
          break;

        case 'timestamp':
          field.setting = {x, y, width, height};
          break;
      }

      const saved = await createField(this.endpoint, this.templateId, field);
      console.log('Saved field', saved);

      TemplateStore.fields.push(saved);
      this.placing = null;

      this.templateUpdated?.emit({endpoint: this.endpoint, template: TemplateStore.template, event: 'added-field'});

      this.handlePageRendered({detail: this.cachedPageInfo[pageNumber]});
    }
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    // TODO: Render a better error
    if (TemplateStore.loading || !TemplateStore.template) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    const pages = [...TemplateStore.template.pages];
    pages.sort((a, b) => a.sequence - b.sequence);

    return (
      <Host
        class={this.placing ? {[`placing-${this.placing}`]: true} : {}}
        data-r={this.rerender}
        onSubmit={() => {
          console.log('onSubmit');
        }}
      >
        <div id="verdocs-template-fields-toolbar">
          {menuOptions.map(option => (
            <verdocs-toolbar-icon text={option.tooltip} icon={option.icon} onClick={() => (this.placing = option.id as TDocumentFieldType)} />
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
          {pages.map(page => {
            return (
              <verdocs-template-document-page
                templateId={page.template_id}
                documentId={page.document_id}
                pageNumber={page.sequence}
                virtualWidth={612}
                virtualHeight={792}
                onClick={(e: PointerEvent) => this.handleClickPage(e, page)}
                onPageRendered={e => this.handlePageRendered(e)}
                layers={[
                  {name: 'page', type: 'canvas'},
                  {name: 'controls', type: 'div'},
                ]}
              />
            );
          })}
        </div>

        {/*<verdocs-floating-menu*/}
        {/*  options={menuOptions}*/}
        {/*  onOptionSelected={e => {*/}
        {/*    this.placing = e.detail.id as TDocumentFieldType;*/}
        {/*  }}*/}
        {/*/>*/}
      </Host>
    );
  }
}
