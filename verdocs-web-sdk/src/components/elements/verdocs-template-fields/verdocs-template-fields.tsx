import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, State, Host} from '@stencil/core';
import {IPageRenderEvent} from '../../embeds/verdocs-view/verdocs-view';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {SDKError} from '../../../utils/errors';

const iconSingleline = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.425 16.15V13h11.15v3.15Zm0-5.15V7.85h17.15V11Z"/></svg>';

const iconMultiline =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M3.225 20.725v-3.15h11.55v3.15Zm0-4.775V12.8h17.55v3.15Zm0-4.75V8.05h17.55v3.15Zm0-4.775v-3.15h17.55v3.15Z"/></svg>';

const iconCheck =
  '<svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m17.417 27.625 12.458-12.5L27 12.208l-9.583 9.542-4.459-4.458-2.916 2.916Zm-9.209 8.542q-1.833 0-3.104-1.271-1.271-1.271-1.271-3.104V8.208q0-1.833 1.271-3.125 1.271-1.291 3.104-1.291h23.584q1.833 0 3.125 1.291 1.291 1.292 1.291 3.125v23.584q0 1.833-1.291 3.104-1.292 1.271-3.125 1.271Zm0-4.375h23.584V8.208H8.208v23.584Zm0-23.584v23.584V8.208Z"/></svg>';

const iconRadio =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5.85q-2.275 0-4.25-.85t-3.438-2.312Q2.85 18.225 2 16.25q-.85-1.975-.85-4.25T2 7.75q.85-1.975 2.312-3.438Q5.775 2.85 7.75 2q1.975-.85 4.25-.85t4.25.85q1.975.85 3.438 2.312Q21.15 5.775 22 7.75q.85 1.975.85 4.25T22 16.25q-.85 1.975-2.312 3.438Q18.225 21.15 16.25 22q-1.975.85-4.25.85Zm0-3.15q3.25 0 5.475-2.225Q19.7 15.25 19.7 12q0-3.25-2.225-5.475Q15.25 4.3 12 4.3q-3.25 0-5.475 2.225Q4.3 8.75 4.3 12q0 3.25 2.225 5.475Q8.75 19.7 12 19.7Zm0-7.7Z"/></svg>';

const iconDatepicker =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M7.6 13.925q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375Zm4.4 0q-.55 0-.925-.375t-.375-.925q0-.55.375-.937.375-.388.925-.388t.925.388q.375.387.375.937t-.375.925q-.375.375-.925.375ZM5.3 22.85q-1.325 0-2.238-.912-.912-.913-.912-2.238V6.3q0-1.325.912-2.238.913-.912 2.238-.912H6v-2h2.575v2h6.85v-2H18v2h.7q1.325 0 2.238.912.912.913.912 2.238v13.4q0 1.325-.912 2.238-.913.912-2.238.912Zm0-3.15h13.4V10H5.3v9.7ZM5.3 8h13.4V6.3H5.3Zm0 0V6.3 8Z"/></svg>';

const iconSignature =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  fit="" preserveAspectRatio="xMidYMid meet" focusable="false">' +
  '      <defs></defs>' +
  '      <g id="Material-Design-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
  '          <g id="signer-signature">' +
  '              <g id="ic_gesture_black_24px">' +
  '                  <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>' +
  '                  <polygon id="Shape" fill="#000000" fill-rule="nonzero" points="4 17 20 17 20 19 4 19"></polygon>' +
  '                  <path d="M6,13.6367319 L6,16 L8.36326806,16 L15.3333333,9.02993473 L12.9700653,6.66666667 L6,13.6367319 Z M17.8007663,6.75351213 C18.0664112,6.48786718 18.0664112,6.0587484 17.8007663,5.79310345 L16.2068966,4.19923372 C15.9412516,3.93358876 15.5121328,3.93358876 15.2464879,4.19923372 L14,5.44572158 L16.5542784,8 L17.8007663,6.75351213 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>' +
  '              </g>' +
  '          </g>' +
  '      </g>' +
  '    </svg>';

const iconInitial =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">' +
  '      <defs></defs>' +
  '      <g id="Material-Design-Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
  '          <g id="signer-intial">' +
  '              <g id="ic_gesture_black_24px">' +
  '                  <polygon id="Shape" points="0 0 24 0 24 24 0 24"></polygon>' +
  '                  <polygon id="Shape" fill="#000000" fill-rule="nonzero" points="4 17 20 17 20 19 4 19"></polygon>' +
  '                  <path d="M5,12.3087071 L7.27440633,12.1662269 C7.323659,12.5356219 7.42392185,12.8170615 7.57519789,13.0105541 C7.82146121,13.3236603 8.17326069,13.4802111 8.63060686,13.4802111 C8.97185747,13.4802111 9.23482757,13.4001767 9.41952507,13.2401055 C9.60422256,13.0800344 9.69656992,12.8944602 9.69656992,12.6833773 C9.69656992,12.4828486 9.60862005,12.3034309 9.43271768,12.1451187 C9.2568153,11.9868066 8.84872792,11.8372918 8.20844327,11.6965699 C7.16006512,11.4608607 6.41249124,11.1477592 5.96569921,10.7572559 C5.51538913,10.3667527 5.29023747,9.86895641 5.29023747,9.26385224 C5.29023747,8.86631288 5.40545179,8.49076694 5.63588391,8.13720317 C5.86631602,7.78363939 6.2128385,7.50571781 6.67546174,7.30343008 C7.13808499,7.10114235 7.77220354,7 8.57783641,7 C9.56640776,7 10.3201381,7.18381522 10.8390501,7.55145119 C11.3579621,7.91908715 11.6666662,8.50395377 11.7651715,9.3060686 L9.51187335,9.43799472 C9.45206654,9.08970802 9.32629823,8.8364124 9.13456464,8.67810026 C8.94283106,8.51978813 8.67810195,8.44063325 8.34036939,8.44063325 C8.06244364,8.44063325 7.85312296,8.49955966 7.71240106,8.61741425 C7.57167916,8.73526884 7.50131926,8.87862712 7.50131926,9.0474934 C7.50131926,9.17062507 7.55936617,9.2814419 7.67546174,9.37994723 C7.78803926,9.48197061 8.05540686,9.57695646 8.47757256,9.66490765 C9.52243266,9.89006269 10.270886,10.1178528 10.7229551,10.348285 C11.1750242,10.5787171 11.5039568,10.8645541 11.7097625,11.2058047 C11.9155683,11.5470554 12.0184697,11.9287578 12.0184697,12.3509235 C12.0184697,12.8469682 11.8812679,13.3043075 11.6068602,13.7229551 C11.3324525,14.1416028 10.948991,14.4591018 10.4564644,14.6754617 C9.96393773,14.8918217 9.34301166,15 8.59366755,15 C7.27791778,15 6.36675715,14.7467044 5.86015831,14.2401055 C5.35355947,13.7335067 5.0668429,13.0897137 5,12.3087071 Z M13.364493,7.13192612 L15.7549943,7.13192612 L15.7549943,12.9630607 L19.4858651,12.9630607 L19.4858651,14.8680739 L13.364493,14.8680739 L13.364493,7.13192612 Z" id="SL" fill="#000000"></path>' +
  '              </g>' +
  '          </g>' +
  '      </g>' +
  '    </svg>';

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

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[PREVIEW] handleFieldChange', field, e, optionId);
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[PREVIEW] Page rendered', pageInfo);

    const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    console.log('[PREVIEW] Fields on page', fields);
    fields.forEach(field => renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(this.roles, field.role_name), this.handleFieldChange, true));
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
      <Host class={{storybook: !!window?.['STORYBOOK_ENV']}}>
        <div class="document">
          {this.pdfUrl ? (
            <div class="inner">
              <div class="fields-bar">
                <div class="label">Drag to Add Field:</div>
                <div class="icon" innerHTML={iconSingleline} title="Single-line Text" />
                <div class="icon" innerHTML={iconMultiline} title="Multi-line Text" />
                <div class="icon" innerHTML={iconCheck} title="Checkbox" />
                <div class="icon" innerHTML={iconRadio} title="Radio Button" />
                <div class="icon" innerHTML={iconDatepicker} title="Date Picker" />
                <div class="icon" innerHTML={iconSignature} title="Signature" />
                <div class="icon" innerHTML={iconInitial} title="Initials" />
              </div>

              <div class="page-0">
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

              <verdocs-dropdown options={[{label: 'Option 1'}, {label: 'Disabled Option', disabled: true}, {label: 'Option 2'}]} />
            </div>
          ) : (
            <verdocs-loader />
          )}
        </div>
      </Host>
    );
  }
}
