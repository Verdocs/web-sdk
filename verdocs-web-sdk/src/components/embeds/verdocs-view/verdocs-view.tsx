import {cancelEnvelope, getDocumentDownloadLink, getEnvelope, IEnvelope, integerSequence, userCanCancelEnvelope, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment, State} from '@stencil/core';
import {saveEnvelopesAsZip} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

/**
 * Render the documents attached to an envelope in read-only (view) mode. All documents are
 * displayed in order.
 *
 * ```ts
 * <verdocs-view
 *   envelopeId={envelopeId}
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-view',
  styleUrl: 'verdocs-view.scss',
  shadow: false,
})
export class VerdocsView {
  @Element() component: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to render. Set ONE OF templateId or envelopeId. If both are set, envelopeId will be ignored.
   */
  @Prop() envelopeId: string = '';

  /**
   * If set, (recommended), the host application should create a <DIV> element with a unique ID. When this
   * component renders, the header will be removed from its default location and placed in the target element.
   * This allows the parent application to more easily control its placement and scroll effects (e.g. "fixed").
   *
   * The movement of the header to the target container is not dynamic - it is performed only on the initial
   * render. Host applications should not conditionally render this container. If the header's visibility must
   * be externally controlled, use CSS display options to hide/show it instead.
   */
  @Prop() headerTargetId: string | null = null;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) envelopeUpdated: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope; event: string}>;

  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) another: EventEmitter;

  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) view: EventEmitter;

  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
   * to redirect the user to the appropriate next workflow step.
   */
  @Event({composed: true}) next: EventEmitter;
  @State() canceling = false;
  @State() envelope: IEnvelope | null = null;
  @State() roleNames: string[] = [];
  @State() showCancelDone = false;

  async componentWillLoad() {
    this.endpoint.loadSession();

    if (!this.envelopeId) {
      console.error(`[VIEW] Missing required envelopeId`);
      return;
    }

    console.log('[VIEW] Loading envelope...');

    try {
      this.envelope = await getEnvelope(this.endpoint, this.envelopeId);
      console.log('[VIEW] Loaded envelope', this.envelope);
      this.roleNames = this.envelope.recipients.map(r => r.role_name);

      setTimeout(async () => {
        console.log('[VIEW] Reloading envelope...');
        this.envelope = await getEnvelope(this.endpoint, this.envelopeId);
        console.log('[VIEW] Reloaded envelope', this.envelope);
      }, 2000);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    const headerTarget = this.headerTargetId ? document.getElementById(this.headerTargetId) : null;
    const headerEl = document.getElementById('verdocs-view-header');
    if (headerTarget && headerEl) {
      console.log('[VIEW] Moving header');
      headerEl.remove();
      headerTarget.append(headerEl);
    }
  }

  handlePageRendered(e: any) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[VIEW] Page rendered', pageInfo);
  }

  async handleOptionSelected(e: any) {
    switch (e.detail.id) {
      case 'cancel':
        // TODO: Better option for inline-flow confirmation and alert dialogs.
        if (confirm('Are you sure you wish to cancel this envelope? This action cannot be undone.')) {
          this.canceling = true;
          cancelEnvelope(this.endpoint, this.envelopeId)
            .then(r => {
              this.canceling = false;
              console.log('[VIEW] Envelope canceled', r);
              return getEnvelope(this.endpoint, this.envelopeId);
            })
            .then(env => {
              console.log('[VIEW] Loaded new envelope details', env);
              this.envelope = env;
            })
            .catch(e => {
              this.canceling = false;
              console.log('[VIEW] Error canceling envelope', e);
              this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            });
          this.showCancelDone = true;
          this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'canceled'});
        }
        break;

      case 'print':
        window.print();
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'printed'});
        break;

      case 'download-attachments':
        // TODO: Multiple document support
        {
          const firstDoc = this.envelope.documents.find(doc => doc.type === 'attachment');
          if (firstDoc) {
            const url = await getDocumentDownloadLink(this.endpoint, this.envelopeId, firstDoc.id);
            window.open(url, '_blank');
          }
        }
        break;

      case 'download-certificate':
        // TODO: Multiple certificate support
        {
          const firstCert = this.envelope.documents.find(doc => doc.type === 'certificate');
          if (firstCert) {
            const url = await getDocumentDownloadLink(this.endpoint, this.envelopeId, firstCert.id);
            window.open(url, '_blank');
          }
        }
        // saveCertificate(this.endpoint, this.envelope, this.envelope.certificate_document_id)
        //   .then(() => {
        //     this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
        //   })
        //   .catch(e => {
        //     console.log('Error downloading PDF', e);
        //   });
        break;

      case 'download-all':
        saveEnvelopesAsZip(this.endpoint, [this.envelope])
          .then(() => {
            this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
          })
          .catch(e => {
            console.log('Error downloading Zip', e);
          });
        break;
    }
  }

  render() {
    if (!this.envelope) {
      return (
        <Host>
          <img
            src="https://verdocs-public-assets.s3.amazonaws.com/loading-placeholder.png"
            style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
            alt="Placeholder page"
          />
        </Host>
      );
    }

    const menuOptions: any[] = [{id: 'print', label: 'Print'}];

    if (userCanCancelEnvelope(this.endpoint.profile, this.envelope)) {
      menuOptions.push({id: 'cancel', label: 'Cancel'});
    }

    // Add download options to the menu
    const hasAttachments = this.envelope.documents.length > 0;
    const normalDocCount = this.envelope.documents.filter(doc => doc.type === 'attachment').length;
    const hasCertificate = this.envelope.documents.find(doc => doc.type === 'certificate') !== undefined;
    if (hasAttachments || hasCertificate) {
      menuOptions.push({label: ''});
      if (hasAttachments) {
        menuOptions.push({id: 'download-attachments', label: normalDocCount > 1 ? 'Download Documents' : 'Download Document'});
      }
      if (hasCertificate) {
        menuOptions.push({id: 'download-certificate', label: 'Download Certificate'});
      }
      if (hasAttachments && hasCertificate) {
        menuOptions.push({id: 'download-all', label: 'Download All Files'});
      }
    }

    return (
      <Host>
        <div id="verdocs-view-header">
          <div class="inner">
            <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
            <div class="title">{this.envelope.name}</div>
            <div style={{flex: '1'}} />
            <div style={{marginLeft: '10px'}} />
            <verdocs-dropdown options={menuOptions} onOptionSelected={e => this.handleOptionSelected(e)} />
          </div>
        </div>

        <div class="document" style={{paddingTop: this.headerTargetId ? '70px' : '15px'}}>
          {(this.envelope?.documents || [])
            .filter(document => document.type !== 'certificate')
            .map(envelopeDocument => {
              const pageNumbers = integerSequence(1, envelopeDocument.pages);

              return (
                <Fragment>
                  {pageNumbers.map(pageNumber => (
                    <verdocs-envelope-document-page
                      envelopeId={this.envelopeId}
                      documentId={envelopeDocument.id}
                      endpoint={this.endpoint}
                      type="filled"
                      virtualWidth={612}
                      virtualHeight={792}
                      pageNumber={pageNumber}
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
        </div>
        {this.showCancelDone && (
          <verdocs-ok-dialog
            heading="Cancelled"
            message={`This envelope has been cancelled successfully.`}
            onNext={() => {
              this.showCancelDone = false;
            }}
          />
        )}
        {this.canceling && (
          <div class="loading-indicator">
            <verdocs-loader />
          </div>
        )}
      </Host>
    );
  }
}
