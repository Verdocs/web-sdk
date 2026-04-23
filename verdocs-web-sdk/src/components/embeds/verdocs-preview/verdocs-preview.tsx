import interact from 'interactjs';
import {getTemplate, integerSequence, ITemplate, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Event, EventEmitter, Host, Component, Prop, h, State, Fragment, Watch} from '@stencil/core';
import {renderDocumentField} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

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
  private renderedPages: Record<string, IDocumentPageInfo> = {};

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
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    // Defensive hack: fields rendered in other tabs (e.g. the builder's Fields tab) may share DOM
    // IDs with fields shown here, and interact.js — being vanilla JS — is unaware of Stencil's
    // re-renders. Unbind any drag/resize handlers on every .verdocs-field after each render so
    // fields stay non-interactive in preview mode regardless of where they came from.
    document.querySelectorAll('.verdocs-field').forEach(el => {
      interact(el as HTMLElement).unset();
    });
  }

  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    this.renderedPages[`${pageInfo.documentId}:${pageInfo.pageNumber}`] = pageInfo;

    const fields = (this.template?.fields || []).filter(field => {
      // Templates created on the new builder have document_id set, but old ones may not.
      // If document_id is missing, we assume it's for the first document or use legacy logic.
      // However, for this fix, we primarily care about multi-doc templates which should have IDs.
      if (field['document_id']) {
        return field['document_id'] === pageInfo.documentId && field.page === pageInfo.pageNumber;
      }
      return field.page === pageInfo.pageNumber;
    });

    // console.log('[PREVIEW] Page rendered', pageInfo, fields);
    fields.forEach(field => renderDocumentField('template', field, pageInfo, {disabled: true, editable: false, draggable: false}));
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
