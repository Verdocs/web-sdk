import {Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, State, h} from '@stencil/core';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {ITemplate, ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
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

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[SEND] handleFieldChange', field, e, optionId);
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[SEND] Page rendered', pageInfo);

    const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
    console.log('[SEND] Fields on page', fields);
    fields.forEach(field => renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(this.roles, field.role_name), this.handleFieldChange, false));
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
