import {Event, EventEmitter, Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, State, h} from '@stencil/core';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IPageRenderEvent} from '../verdocs-view/verdocs-view';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {SDKError} from '../../../utils/errors';

/**
 * Display a template preview experience.
 */
@Component({
  tag: 'verdocs-preview',
  styleUrl: 'verdocs-preview.scss',
  shadow: false,
})
export class VerdocsPreview {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() pdfUrl = null;
  @State() template: ITemplate | null = null;

  roles: string[] = [];
  fields: ITemplateField[] = [];

  async componentDidLoad() {
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
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
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
    return (
      <Host>
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
      </Host>
    );
  }
}
