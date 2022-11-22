import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Fragment, Prop, State, Host} from '@stencil/core';
import {IPageRenderEvent} from '../../embeds/verdocs-view/verdocs-view';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {SDKError} from '../../../utils/errors';
import interact from 'interactjs';

/**
 * Helper function to safely set/update components in a CSS transform attribute. Transform is normally set as a string of
 * `operation1(param) operation2(param) ...` components, which makes updating them a bit of a pain. This will remove the
 * specified component if it's already set and replace it with the new value, without touching the other components that
 * may already be set. Note that this operation moves the component to the end of the transform chain so it's not meant
 * to be used for order-sensitive components e.g. translate-then-rotate.
 */
const updateCssTransform = (el: HTMLElement, key: string, value: string) => {
  // e.g. 'scale(1.87908, 1.87908) translate(0px, 0px);'
  const currentTransform = el.style.transform;
  // e.g. ['scale(1.87908, 1.87908)', 'scale', '1.87908, 1.87908', ...], [ 'translate(0px, 0px)', 'translate', '0px, 0px']]
  const components = [...currentTransform.matchAll(/(\w+)\(([^)]*)\)/gi)];
  el.style.transform = [
    components //
      .filter(component => component[1] !== key) // Remove the entry if it's already set
      .map(component => component[0]), // Convert back the remaining entries
    `${key}(${value})`,
  ].join(' ');
};

const iconSingleline = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>';

const iconMultiline =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.225 20.725v-3.15h11.55v3.15Zm0-4.775V12.8h17.55v3.15Zm0-4.75V8.05h17.55v3.15Zm0-4.775v-3.15h17.55v3.15Z"/></svg>';

const iconCheck =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m10.55 16.55 7.275-7.275L16.05 7.5l-5.5 5.45-2.675-2.65L6.1 12.075Zm-5.375 4.925q-1.125 0-1.887-.763-.763-.762-.763-1.887V5.175q0-1.125.763-1.888.762-.762 1.887-.762h13.65q1.125 0 1.888.762.762.763.762 1.888v13.65q0 1.125-.762 1.887-.763.763-1.888.763Zm0-2.65h13.65V5.175H5.175v13.65Zm0-13.65v13.65-13.65Z"/></svg>';

const iconRadio =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5.85q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Zm0-3.15q3.25 0 5.475-2.225Q19.7 15.25 19.7 12q0-3.25-2.225-5.475Q15.25 4.3 12 4.3q-3.25 0-5.475 2.225Q4.3 8.75 4.3 12q0 3.25 2.225 5.475Q8.75 19.7 12 19.7Zm0-7.7Z"/></svg>';

const iconDatepicker =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.6 13.925q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375ZM5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Zm0 0V6.3 8Z"/></svg>';

const iconSignature =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Zm-3.725-.625-.6-.575 1.175 1.175Z"/></svg>';

const iconInitial = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6.225 20.775V7h-5V3.225H15V7h-5v13.775Zm9.775 0v-8h-3V9h9.775v3.775h-3v8Z"/></svg>';

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
  page0El: HTMLDivElement;
  toolbarEl: HTMLDivElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

  /**
   * Event fired when the fields are saved.
   */
  @Event({composed: true}) save: EventEmitter;

  /**
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() pdfUrl = null;
  @State() template: ITemplate | null = null;

  roles: string[] = [];
  fields: ITemplateField[] = [];

  async componentWillLoad() {
    try {
      console.log(`[PREVIEW] Loading template ${this.templateId}`);
      const template = await getTemplate(this.endpoint, this.templateId);

      console.log('[PREVIEW] Got template', this.template);
      this.template = template;

      this.pdfUrl = `${this.endpoint.getBaseURL()}/templates/${this.templateId}/documents/${template.template_document?.id}?file=true`;

      this.roles = template.roles.map(role => role.name);
      console.log('[PREVIEW] Loaded roles', this.roles);

      this.fields = [];
      template.roles.forEach(role => {
        this.fields.push(...role.fields);
      });
      console.log('[PREVIEW] Loaded fields', this.fields);
    } catch (e) {
      console.log('[PREVIEW] Error with preview session', e);
      // this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    // console.log('rendered', this.page0El, this.toolbarEl);
    // console.log('w', this.page0El.clientWidth);
    // console.log('t', this.toolbarEl.clientWidth);
    interact.dynamicDrop(true);
    this.toolbarEl.style.width = `${this.page0El.clientWidth}px`;
  }

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[PREVIEW] handleFieldChange', field, e, optionId);
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[PREVIEW] Page rendered', pageInfo);

    const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    console.log('[PREVIEW] Fields on page', fields);
    fields.forEach(field => {
      const el = renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(this.roles, field.role_name), this.handleFieldChange, true, true, true);

      interact(el).draggable({
        listeners: {
          start(event) {
            console.log('drag started', event.type, event.target);
          },
          move(event) {
            console.log('moved');
            const oldX = +(event.target.getAttribute('posX') || 0);
            const oldY = +(event.target.getAttribute('posY') || 0);
            const newX = event.dx + oldX;
            const newY = event.dy + oldY;
            event.target.setAttribute('posX', newX);
            event.target.setAttribute('posy', newY);
            updateCssTransform(event.target, 'translate', `${newX}px, ${newY}px`);
          },
          end(event) {
            console.log('ended', event);
            event.target.setAttribute('posX', 0);
            event.target.setAttribute('posy', 0);
            // updateCssTransform(event.target, 'translate', `${0}px, ${0}px`);
          },
        },
      });
    });
  }

  render() {
    const testField: ITemplateField = {
      template_id: '',
      name: 'test',
      role_name: 'Recipient 1',
      type: 'textbox',
      required: true,
      setting: {
        x: 0,
        y: 0,
      },
      page_sequence: 0,
    };

    return (
      <Host>
        {this.pdfUrl ? (
          <Fragment>
            <div class="fields-bar" ref={el => (this.toolbarEl = el as HTMLDivElement)}>
              <div class="label">Add Field:</div>
              <verdocs-toolbar-icon icon={iconSingleline} text="Single-line Text Box" onPress={() => console.log('single press')} />
              <verdocs-toolbar-icon icon={iconMultiline} text="Multi-line Text Box" onPress={() => console.log('multi press')} />
              <verdocs-toolbar-icon icon={iconCheck} text="Checkbox" onPress={() => console.log('check press')} />
              <verdocs-toolbar-icon icon={iconRadio} text="Radio Button" onPress={() => console.log('radio press')} />
              <verdocs-toolbar-icon icon={iconDatepicker} text="Date Picker" onPress={() => console.log('date press')} />
              <verdocs-toolbar-icon icon={iconSignature} text="Signature" onPress={() => console.log('signature press')} />
              <verdocs-toolbar-icon icon={iconInitial} text="Initials" onPress={() => console.log('initial press')} />
              <div style={{flex: '1'}} />
              <button onClick={() => console.log('save')} disabled={true} class="operation">
                Save
              </button>
              <button onClick={() => console.log('close')} class="operation">
                Close
              </button>
            </div>

            <div class="page-0" ref={el => (this.page0El = el as HTMLDivElement)}>
              <div class="user-placed-fields">
                <div class="title">User-Placed Fields</div>
                <verdocs-field-signature
                  field={testField}
                  style={{width: '82px', height: '41px', left: '20px', top: '40px', transform: 'scale(1,1)', backgroundColor: getRGBA(0)}}
                />
              </div>
            </div>

            <verdocs-view
              source={this.pdfUrl}
              endpoint={this.endpoint}
              onPageRendered={e => this.handlePageRendered(e)}
              pageLayers={[
                {name: 'page', type: 'canvas'},
                {name: 'controls', type: 'div'},
              ]}
            />
          </Fragment>
        ) : (
          <verdocs-loader />
        )}
      </Host>
    );
  }
}
