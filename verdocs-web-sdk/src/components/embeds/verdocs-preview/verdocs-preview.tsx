import {integerSequence, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Prop, h, State, Fragment, Watch} from '@stencil/core';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {Event, EventEmitter, Host} from '@stencil/core';
// import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

/**
 * Display a template preview experience. This will display the template's attached
 * documents with signing fields overlaid on each page. Fields will be color-coded
 * by recipient, and will be read-only (cannot be filled, moved, or altered).
 *
 * ```ts
 * <verdocs-preview templateId={templateId} />
 * ```
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

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string) {
    console.log('[PREVIEW] Template ID changed', newTemplateId);
    this.loadTemplate(newTemplateId).catch((e: any) => console.log('Unknown Error', e));
  }

  templateStore: TTemplateStore | null = null;
  fieldStore: TTemplateFieldStore | null = null;
  roleStore: TTemplateRoleStore | null = null;

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

      return this.loadTemplate(this.templateId);
    } catch (e) {
      console.log('[PREVIEW] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  async loadTemplate(templateId: string) {
    if (templateId) {
      console.log('lt', templateId);
      getTemplateStore(this.endpoint, templateId, false)
        .then(ts => {
          this.templateStore = ts;
          this.fieldStore = getTemplateFieldStore(this.templateId);
          this.roleStore = getTemplateRoleStore(this.templateId);
          this.loading = false;
        })
        .catch(e => {
          console.log('Unable to load template', e);
          throw e;
        });
    }
  }

  handlePageRendered(_e: any) {
    // const pageInfo = e.detail as IDocumentPageInfo;
    // const fields = this.templateStore?.state?.fields.filter(field => field.page === pageInfo.pageNumber);
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
        {(this.templateStore?.state?.documents || []).map(document => {
          const pageNumbers = integerSequence(1, document.pages);
          return (
            <Fragment>
              {pageNumbers.map(pageNumber => (
                <verdocs-template-document-page
                  templateId={document.template_id}
                  documentId={document.id}
                  pageNumber={pageNumber}
                  disabled={true}
                  editable={false}
                  done={false}
                  virtualWidth={612}
                  virtualHeight={792}
                  onPageRendered={e => this.handlePageRendered(e)}
                  layers={[
                    {name: 'page', type: 'canvas'},
                    {name: 'controls', type: 'div'},
                  ]}
                />
              ))}
            </Fragment>
          );
        })}
      </Host>
    );
  }
}
