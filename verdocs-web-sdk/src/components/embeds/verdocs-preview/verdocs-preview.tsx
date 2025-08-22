import {getTemplate, integerSequence, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Event, EventEmitter, Host, Component, Prop, h, State, Fragment, Watch} from '@stencil/core';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';
import { VerdocsToast } from '../../../utils/Toast';

/**
 * Display a template preview experience. This will display the template's attached
 * documents with signing fields overlaid on each page. Fields will be color-coded
 * by recipient, and will be read-only (cannot be filled, moved, or altered).
 *
 * ```ts
 * <verdocs-preview
 *   templateId={TEMPLATE_ID}
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-preview',
  styleUrl: 'verdocs-preview.scss',
  shadow: false,
})
export class VerdocsPreview {
  private templateListenerId = null;

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
  @State() template: ITemplate | null = null;

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
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string) {
    console.log('[PREVIEW] Template ID changed', newTemplateId);
    this.listenToTemplate();
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();
      if (!this.endpoint.session) {
        console.log('[PREVIEW] Unable to start builder session, must be authenticated');
        return;
      }

      if (!this.templateId) {
        console.log(`[PREVIEW] Missing required template ID ${this.templateId}`);
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[PREVIEW] Error with preview session', e);
      VerdocsToast('Unable to load template: ' + e.message, {style: 'error'});
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handlePageRendered(_e: any) {
    // const pageInfo = e.detail as IDocumentPageInfo;
    // const fields = (this.template?.fields || []).filter(field => field.page === pageInfo.pageNumber);
    // console.log('[PREVIEW] Page rendered', pageInfo, fields);
    // fields.forEach(field => renderDocumentField(field, pageInfo, {disabled: true, editable: false, draggable: false}));
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    return (
      <Host>
        {(this.template?.documents || []).map(document => {
          const pageNumbers = integerSequence(1, document.pages);
          return (
            <Fragment>
              {pageNumbers.map(pageNumber => {
                const pageSize = document.page_sizes?.[pageNumber] || {width: 612, height: 792};

                return (
                  <verdocs-template-document-page
                    templateId={document.template_id}
                    documentId={document.id}
                    pageNumber={pageNumber}
                    disabled={true}
                    editable={false}
                    done={false}
                    virtualWidth={pageSize.width}
                    virtualHeight={pageSize.height}
                    onPageRendered={e => this.handlePageRendered(e)}
                    layers={[
                      {name: 'page', type: 'canvas'},
                      {name: 'controls', type: 'div'},
                    ]}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </Host>
    );
  }
}
