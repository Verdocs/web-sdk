import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, State} from '@stencil/core';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {renderDocumentField} from '../../../utils/utils';
import {Event, EventEmitter, Host} from '@stencil/core';
import {IDocumentPageInfo} from '../../../utils/Types';
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

  @State() loading = true;

  templateStore: TTemplateStore | null = null;
  fieldStore: TTemplateFieldStore | null = null;
  roleStore: TTemplateRoleStore | null = null;

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[PREVIEW] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[PREVIEW] Unable to start builder session, must be authenticated');
        return;
      }

      getTemplateStore(this.endpoint, this.templateId, false)
        .then(ts => {
          this.templateStore = ts;
          console.log('[PREVIEW] Loaded Template Store', ts.state);
          this.fieldStore = getTemplateFieldStore(this.templateId);
          this.roleStore = getTemplateRoleStore(this.templateId);
          console.log('RS', this.roleStore?.state);
          console.log('FS', this.fieldStore?.state);
          console.log('[PREVIEW] Loaded template', this.templateStore.state, this.roleStore.get('roles'), this.fieldStore.get('fields'));
          this.loading = false;
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log('[PREVIEW] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;

    const fields = this.templateStore?.state?.fields.filter(field => field.page_sequence === pageInfo.pageNumber);
    console.log('[PREVIEW] Page rendered', pageInfo, fields);
    fields.forEach(field => renderDocumentField(field, pageInfo, {disabled: true, editable: false, draggable: false}));
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    const pages = [...this.templateStore?.state?.pages];
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
