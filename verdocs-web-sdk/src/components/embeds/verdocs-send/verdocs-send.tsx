import {Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {rescale} from '@verdocs/js-sdk/Utils/Fields';
import {Component, Prop, State, h} from '@stencil/core';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentPageInfo} from '../../elements/verdocs-document-page/verdocs-document-page';
import {IPageRenderEvent} from '../verdocs-view/verdocs-view';

/**
 * Display a document sending experience.
 *
 * ***NOTE: This sample document will reset every 10 minutes...***
 */
@Component({
  tag: 'verdocs-send',
  styleUrl: 'verdocs-send.scss',
  shadow: false,
})
export class VerdocsSend {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

  @State() pdfUrl = null;
  @State() template: ITemplate | null = null;

  roles: string[] = [];
  fields: ITemplateField[] = [];

  async componentDidLoad() {
    try {
      console.log(`[SEND] Loading template ${this.templateId}`);
      const template = await getTemplate(this.endpoint, this.templateId);

      console.log('[SEND] Got template', this.template);
      this.template = template;

      this.pdfUrl = `${this.endpoint.getBaseURL()}/templates/${this.templateId}/documents/${template.template_document?.id}?file=true`;

      this.roles = template.roles.map(role => role.name);
      console.log('[SEND] Loaded roles', this.roles);

      this.fields = [];
      template.roles.forEach(role => {
        this.fields.push(...role.fields);
      });
      console.log('[SEND] Loaded fields', this.fields);
    } catch (e) {
      console.log('[SEND] Error with signing session', e);
    }
  }

  async handleOptionSelected(e: any) {
    console.log('[SEND] handleOptionSelected', e);
    // e.detail.id
  }

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[SEND] handleFieldChange', field, e, optionId);
  }

  getRoleIndex(role: string) {
    return this.roles.indexOf(role) || 0;
  }

  // renderCheckboxGroupOption(page: IDocumentPageInfo, field: ITemplateField, option: any, index: number) {
  //   const left = rescale(page.xScale, option.x);
  //   const bottom = rescale(page.yScale, option.y);
  //
  //   const style = {
  //     left: `${left}px`,
  //     bottom: `${bottom}px`,
  //     position: 'absolute',
  //     transform: `scale(${page.xScale}, ${page.yScale})`,
  //     backgroundColor: getRGBA(this.getRoleIndex(field.role_name)),
  //   } as any;
  //
  //   return <verdocs-field-checkbox style={style} order={index} value={option.checked} onFieldChange={e => this.handleFieldChange(field, e, option.id)} />;
  // }

  renderRadioGroupOption(page: IDocumentPageInfo, field: ITemplateField, option: any) {
    const left = rescale(page.xScale, option.x);
    const bottom = rescale(page.yScale, option.y);

    const style = {
      left: `${left}px`,
      bottom: `${bottom}px`,
      position: 'absolute',
      transform: `scale(${page.xScale}, ${page.yScale})`,
      backgroundColor: getRGBA(this.getRoleIndex(field.role_name)),
    } as any;

    return <verdocs-field-radio-button style={style} field={field} onFieldChange={e => this.handleFieldChange(field, e, option.id)} />;
  }

  getFieldId(field: ITemplateField) {
    return `verdocs-doc-fld-${field.name}`;
  }

  setControlStyles(el: HTMLElement, field: ITemplateField, docPage: IDocumentPageInfo) {
    const {x = 0, y = 0, width = 150, height = 50} = field.setting;

    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.position = 'absolute';
    el.style.left = `${rescale(docPage.xScale, x)}px`;
    el.style.bottom = `${rescale(docPage.yScale, y)}px`;
    el.style.transform = `scale(${docPage.xScale}, ${docPage.yScale})`;
    el.style.backgroundColor = field['rgba'] || getRGBA(this.getRoleIndex(field.role_name));
  }

  renderField(field: ITemplateField, docPage: IDocumentPageInfo /*, index: number*/) {
    const controlsDiv = document.getElementById(docPage.containerId + '-controls');
    if (!controlsDiv) {
      return;
    }

    const id = this.getFieldId(field);

    const existingField = document.getElementById(id);

    if (existingField) {
      this.setControlStyles(existingField, field, docPage);
      return;
    }

    let el;
    switch (field.type) {
      case 'attachment':
      case 'checkbox':
      case 'date':
      case 'dropdown':
      case 'initial':
      case 'payment':
      case 'signature':
      case 'timestamp':
      case 'textarea':
      case 'textbox':
        el = document.createElement(`verdocs-field-${field.type}`);
        break;
      case 'checkbox_group':
        //   el = document.createElement('verdocs-field-signature');
        //   el.setAttribute('value', base64);
        break;
      //   return field.settings.options.map((option: any, index) => this.renderCheckboxGroupOption(renderOnPage, field, option, index));
      case 'radio_button_group':
        //   el = document.createElement('verdocs-field-signature');
        //   el.setAttribute('value', base64);
        break;
      //   return field.settings.options.map((option: any, index) => this.renderRadioGroupOption(renderOnPage, field, option, index));
      // case 'attachment':
      //   el = document.createElement('verdocs-field-attachment');
      //   el.setAttribute('value', result || '');
      //   break;
      // case 'payment':
      //   el = document.createElement('verdocs-field-payment');
      //   break;
      default:
        console.log('[SEND] Skipping unsupported field type', field);
    }

    if (el) {
      el.field = field;
      el.setAttribute('id', id);
      el.setAttribute('disabled', true);
      // el.setAttribute('required', required);
      el.addEventListener('fieldChange', e => this.handleFieldChange(field, e));
      this.setControlStyles(el, field, docPage);
      controlsDiv.appendChild(el);
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[SEND] Page rendered', pageInfo);

    const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    console.log('[SEND] Fields on page', fields);
    fields.forEach(field => this.renderField(field, pageInfo.renderedPage));
    // .map((field, index) => this.renderField(field, index));
    // this.pdfPageInfo = e.detail;
  }

  render() {
    return (
      <Host class={{storybook: !!window?.['STORYBOOK_ENV']}}>
        <div class="document">
          {this.pdfUrl ? (
            <div class="inner">
              <verdocs-view
                source={this.pdfUrl}
                endpoint={this.endpoint}
                onPageRendered={e => this.handlePageRendered(e)}
                pageLayers={[
                  {name: 'page', type: 'canvas'},
                  {name: 'controls', type: 'div'},
                ]}
              />
            </div>
          ) : (
            <verdocs-loader />
          )}
        </div>
      </Host>
    );
  }
}
