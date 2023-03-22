import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h} from '@stencil/core';
import {Event, EventEmitter, Host} from '@stencil/core';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import TemplateStore from '../../../utils/templateStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {loadTemplate} from '../../../utils/Templates';
import {SDKError} from '../../../utils/errors';

/**
 * Display a template preview experience. This will display the template's attached
 * documents with signing fields overlaid on each page. Fields will be color-coded
 * by recipient, and will be read-only (cannot be filled, moved, or altered).
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

  // TODO: Move to state store so we can load this one time
  async componentDidLoad() {
    this.endpoint.loadSession();

    if (!this.templateId) {
      console.log(`[PREVIEW] Missing required template ID ${this.templateId}`);
      return;
    }

    try {
      console.log(`[PREVIEW] Loading template ${this.templateId}`);
      await loadTemplate(this.endpoint, this.templateId, true);
    } catch (e) {
      console.log('[PREVIEW] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    // console.log('[PREVIEW] Page rendered', pageInfo);

    const fields = TemplateStore.fields.filter(field => field.page_sequence === pageInfo.pageNumber);
    // console.log('[PREVIEW] Fields on page', fields);
    fields.forEach(field => renderDocumentField(field, pageInfo, getRoleIndex(TemplateStore.roleNames, field.role_name), {disabled: true, editable: false, draggable: false}));
  }

  render() {
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
      <Host>
        {pages.map(page => {
          return (
            <verdocs-template-document-page
              templateId={page.template_id}
              documentId={page.document_id}
              pageNumber={page.sequence}
              virtualWidth={612}
              virtualHeight={792}
              onPageRendered={e => this.handlePageRendered(e)}
              layers={[
                {name: 'page', type: 'canvas'},
                {name: 'controls', type: 'div'},
              ]}
            />
          );
        })}
      </Host>
    );
  }
}
