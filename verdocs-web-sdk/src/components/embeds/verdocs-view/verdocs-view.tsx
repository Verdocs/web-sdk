import {cancelEnvelope, getEnvelopeDocumentDownloadLink, getEnvelope, IEnvelope, integerSequence, userCanCancelEnvelope, VerdocsEndpoint, getEnvelopesZip} from '@verdocs/js-sdk';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment, State} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

/**
 * Render the documents attached to an envelope in read-only (view) mode. All documents are
 * displayed in order.
 *
 * ```ts
 * <verdocs-view
 *   envelopeId={ENVELOPE_ID}
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }
 *   />
 * ```
 */
const ToolbarMinusIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 8C11.2761 8 11.5 8.22386 11.5 8.5C11.5 8.77614 11.2761 9 11 9H6C5.72386 9 5.5 8.77614 5.5 8.5C5.5 8.22386 5.72386 8 6 8H11ZM14 8.5C14 5.46243 11.5376 3 8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1464 16.8536L16.2157 16.9114C16.4106 17.0464 16.68 17.0271 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z" fill="#424242" /></svg>`;
const ToolbarPlusIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 8.5C11.5 8.22386 11.2761 8 11 8H9V6C9 5.72386 8.77614 5.5 8.5 5.5C8.22386 5.5 8 5.72386 8 6V8H6C5.72386 8 5.5 8.22386 5.5 8.5C5.5 8.77614 5.72386 9 6 9H8V11C8 11.2761 8.22386 11.5 8.5 11.5C8.77614 11.5 9 11.2761 9 11V9H11C11.2761 9 11.5 8.77614 11.5 8.5ZM8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z" fill="#424242" /></svg>`;
const ToolbarDownloadIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 16.9988C15.7761 16.9988 16 17.2226 16 17.4988C16 17.7442 15.8231 17.9484 15.5899 17.9907L15.5 17.9988H4.5C4.22386 17.9988 4 17.7749 4 17.4988C4 17.2533 4.17688 17.0492 4.41012 17.0068L4.5 16.9988H15.5ZM10.0001 2.00098C10.2456 2.00098 10.4497 2.17798 10.492 2.41124L10.5 2.50112L10.496 14.295L14.1414 10.6466C14.3148 10.4729 14.5842 10.4534 14.7792 10.5882L14.8485 10.646C15.0222 10.8194 15.0418 11.0888 14.907 11.2838L14.8492 11.3531L10.3574 15.8531C10.285 15.9257 10.1957 15.9714 10.1021 15.9901L9.99608 15.9999C9.83511 15.9999 9.69192 15.9237 9.60051 15.8056L5.14386 11.3537C4.94846 11.1586 4.94823 10.842 5.14336 10.6466C5.3168 10.4729 5.58621 10.4534 5.78117 10.5883L5.85046 10.6461L9.496 14.287L9.5 2.50083C9.50008 2.22469 9.724 2.00098 10.0001 2.00098Z" fill="#424242"/></svg>`;
const ToolbarPrintIcon = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.5C5 3.67157 5.67157 3 6.5 3H13.5C14.3284 3 15 3.67157 15 4.5V5H15.5C16.8807 5 18 6.11929 18 7.5V12.5C18 13.3284 17.3284 14 16.5 14H15V15.5C15 16.3284 14.3284 17 13.5 17H6.5C5.67157 17 5 16.3284 5 15.5V14H3.5C2.67157 14 2 13.3284 2 12.5V7.5C2 6.11929 3.11929 5 4.5 5H5V4.5ZM6 5H14V4.5C14 4.22386 13.7761 4 13.5 4H6.5C6.22386 4 6 4.22386 6 4.5V5ZM5 13V11.5C5 10.6716 5.67157 10 6.5 10H13.5C14.3284 10 15 10.6716 15 11.5V13H16.5C16.7761 13 17 12.7761 17 12.5V7.5C17 6.67157 16.3284 6 15.5 6H4.5C3.67157 6 3 6.67157 3 7.5V12.5C3 12.7761 3.22386 13 3.5 13H5ZM6.5 11C6.22386 11 6 11.2239 6 11.5V15.5C6 15.7761 6.22386 16 6.5 16H13.5C13.7761 16 14 15.7761 14 15.5V11.5C14 11.2239 13.7761 11 13.5 11H6.5Z" fill="#424242"/></svg>`;

@Component({
  tag: 'verdocs-view',
  styleUrl: 'verdocs-view.scss',
  shadow: false,
})
export class VerdocsView {
  private envelopeListenerId = null;

  @Element() component: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint | null = null;

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
  @State() showCancelDone = false;
  @State() showLoadError = false;

  @State() loading = true;
  @State() envelope: IEnvelope | null = null;
  @State() zoomLevel: 'normal' | 'zoom1' | 'zoom2' = 'normal';
  @State() showDownloadDialog = false;
  @State() polling = false;

  private pollingInterval: any = null;

  async componentWillLoad() {
    this.updateZoomFromWindow();
    window.addEventListener('resize', () => this.updateZoomFromWindow());
    if (!this.endpoint) {
      this.endpoint = VerdocsEndpoint.getDefault();
      this.endpoint.loadSession();
    }

    if (!this.envelopeId) {
      console.error(`[VIEW] Missing required envelopeId`);
      return;
    }

    await this.listenToEnvelope();

    if (!this.envelope) {
      try {
        console.log('[VIEW] Loading envelope...');
        this.envelope = await getEnvelope(this.endpoint, this.envelopeId);
        console.log('[VIEW] Loaded envelope', this.envelope);
      } catch (e) {
        this.showLoadError = true;
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      }
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

  disconnectedCallback() {
    this.stopPolling();
    this.unlistenToEnvelope();
    window.removeEventListener('resize', () => this.updateZoomFromWindow());
  }

  updateZoomFromWindow() {
    const width = window.innerWidth;
    if (width < 768) {
      if (this.zoomLevel !== 'zoom2') this.zoomLevel = 'zoom2';
    } else if (width < 1024) {
      if (this.zoomLevel !== 'zoom1') this.zoomLevel = 'zoom1';
    } else {
      if (this.zoomLevel !== 'normal') this.zoomLevel = 'normal';
    }
  }

  async listenToEnvelope() {
    console.log('[VIEW] Loading envelope', this.envelopeId);
    this.unlistenToEnvelope();
    Store.subscribe(
      'envelopes',
      this.envelopeId,
      () => getEnvelope(this.endpoint, this.envelopeId),
      true,
      (envelope: IEnvelope) => {
        this.envelope = envelope;
        this.loading = false;
      },
    );
  }

  unlistenToEnvelope() {
    if (this.envelopeListenerId) {
      Store.store.delListener(this.envelopeListenerId);
      this.envelopeListenerId = null;
    }
  }

  handlePageRendered(_e: any) {
    // const pageInfo = e.detail as IDocumentPageInfo;
    // console.log('[VIEW] Page rendered', pageInfo);
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

      case 'download':
        this.showDownloadDialog = true;
        this.startPolling();
        break;

      case 'download-attachments':
        // TODO: Multiple document support
        try {
          const firstDoc = this.envelope.documents.find(doc => doc.type === 'attachment');
          if (firstDoc) {
            const url = await getEnvelopeDocumentDownloadLink(this.endpoint, firstDoc.id);
            window.open(url, '_blank');
          }
        } catch (e) {
          console.log('Unable to download document', e);
          VerdocsToast(e.response?.data?.error || 'Unable to download document. Please try again later.', {style: 'error'});
        }
        break;

      case 'download-certificate':
        // TODO: Multiple certificate support
        {
          const firstCert = this.envelope.documents.find(doc => doc.type === 'certificate');
          if (firstCert) {
            const url = await getEnvelopeDocumentDownloadLink(this.endpoint, firstCert.id);
            window.open(url, '_blank');
          }
        }
        break;

      case 'download-all':
        getEnvelopesZip(this.endpoint, [this.envelope.id])
          .then(() => {
            this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
          })
          .catch(e => {
            console.log('Error downloading Zip', e);
          });
        break;
    }
  }

  startPolling() {
    this.stopPolling();

    const checkPollingConditions = () => {
      // NOTE: Polling logic for finalizing envelope
      const isSigned = this.envelope?.status === 'complete' || !!this.envelope?.signed;
      const hasCertificate = this.envelope?.documents?.some(d => d.type === 'certificate');
      const allRecipientsSubmitted = this.envelope?.recipients?.every(r => r.status === 'submitted');

      if (isSigned && hasCertificate) return false;
      if (!allRecipientsSubmitted) return false;

      return true;
    };

    if (!checkPollingConditions()) {
      return;
    }

    this.polling = true;
    this.pollingInterval = setInterval(async () => {
      try {
        const envelope = await getEnvelope(this.endpoint, this.envelopeId);
        this.envelope = envelope;
        Store.updateEnvelope(this.envelopeId, envelope);

        if (!checkPollingConditions()) {
          this.stopPolling();
        }
      } catch (e) {
        console.error('[VIEW] Polling error', e);
        this.stopPolling();
      }
    }, 5000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.polling = false;
  }

  handleZoomIn() {
    if (this.zoomLevel === 'normal') {
      this.zoomLevel = 'zoom1';
    } else if (this.zoomLevel === 'zoom1') {
      this.zoomLevel = 'zoom2';
    }
  }

  handleZoomOut() {
    if (this.zoomLevel === 'zoom1') {
      this.zoomLevel = 'normal';
    } else if (this.zoomLevel === 'zoom2') {
      this.zoomLevel = 'zoom1';
    }
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (this.showLoadError) {
      return (
        <Host>
          <verdocs-ok-dialog
            heading="Unable to View Envelope"
            message={`Sorry, that envelope is not valid.`}
            buttonLabel="OK"
            onNext={() => {
              this.showLoadError = false;
            }}
          />
        </Host>
      );
    }

    if (!this.envelope) {
      return (
        <Host>
          <img
            src="https://public-assets.verdocs.com/loading-placeholder.png"
            style={{width: '612px', height: '792px', boxShadow: '0 0 10px 5px #0000000f', marginTop: '15px'}}
            alt="Placeholder page"
          />
        </Host>
      );
    }

    // TODO: Review whether we want a different trigger for this.
    const showFooter = userCanCancelEnvelope(this.endpoint.profile, this.envelope);

    return (
      <Host>
        <div class="controls-toolbar" id="verdocs-view-header">
          <div class="left-controls">
            <div class="title">{this.envelope.name}</div>
          </div>
          <div class="center-controls">{/* Pagination controls hidden for now */}</div>
          <div class="right-controls">
            <div class={{'icon-button': true, 'minus': true, 'disabled': this.zoomLevel === 'normal'}} innerHTML={ToolbarMinusIcon} onClick={() => this.handleZoomOut()} />
            <div class={{'icon-button': true, 'plus': true, 'disabled': this.zoomLevel === 'zoom2'}} innerHTML={ToolbarPlusIcon} onClick={() => this.handleZoomIn()} />
            <div class="icon-button download" innerHTML={ToolbarDownloadIcon} onClick={() => this.handleOptionSelected({detail: {id: 'download'}})} />
            <div class="icon-button print" innerHTML={ToolbarPrintIcon} onClick={() => this.handleOptionSelected({detail: {id: 'print'}})} />
          </div>
        </div>

        <div class={`document signed-document-container zoom-${this.zoomLevel}`} style={{paddingTop: this.headerTargetId ? '70px' : '15px'}}>
          {(this.envelope?.documents || [])
            .filter(document => document.type !== 'certificate')
            .map(envelopeDocument => {
              const pageNumbers = integerSequence(1, envelopeDocument.pages);

              return (
                <Fragment>
                  {pageNumbers.map(pageNumber => {
                    const pageSize = envelopeDocument.page_sizes?.[pageNumber] || {width: 612, height: 792};

                    return (
                      <verdocs-envelope-document-page
                        envelopeId={this.envelopeId}
                        documentId={envelopeDocument.id}
                        endpoint={this.endpoint}
                        type="filled"
                        virtualWidth={pageSize.width}
                        virtualHeight={pageSize.height}
                        pageNumber={pageNumber}
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

        {this.showDownloadDialog && (
          <verdocs-download-dialog
            signed={this.envelope.status === 'complete' || this.envelope.signed}
            polling={this.polling}
            documents={this.envelope.documents}
            onExit={() => {
              this.showDownloadDialog = false;
              this.stopPolling();
            }}
            onDownload={async e => {
              const {action, documentId} = e.detail as any;
              console.log('[VIEW] Download action selected:', action, documentId);

              try {
                if (action === 'document') {
                  const targetDocId = documentId || this.envelope.documents.find(d => d.type === 'attachment')?.id;
                  if (targetDocId) {
                    const url = await getEnvelopeDocumentDownloadLink(this.endpoint, targetDocId);
                    window.open(url, '_blank');
                  }
                } else if (action === 'certificate') {
                  const cert = this.envelope.documents.find(d => d.type === 'certificate');
                  if (cert) {
                    const url = await getEnvelopeDocumentDownloadLink(this.endpoint, cert.id);
                    window.open(url, '_blank');
                  } else {
                    VerdocsToast('Certificate not yet available.', {style: 'info'});
                  }
                } else if (action === 'zip') {
                  const blob = await getEnvelopesZip(this.endpoint, [this.envelopeId]);
                  const url = window.URL.createObjectURL(blob.data);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${this.envelope.name}.zip`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                }
              } catch (err) {
                console.error('Download error', err);
                VerdocsToast('Unable to complete download request.', {style: 'error'});
              }
            }}
          />
        )}

        {!showFooter && (
          <verdocs-sign-footer endpoint={this.endpoint} envelopeId={this.envelopeId} isDone={true} onAskQuestion={() => {}} onDecline={() => {}} onFinishLater={() => {}} />
        )}
      </Host>
    );
  }
}
