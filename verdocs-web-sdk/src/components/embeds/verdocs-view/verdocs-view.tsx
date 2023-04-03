import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';
import {integerSequence} from '@verdocs/js-sdk/Utils/Primitives';
import {userCanCancelEnvelope} from '@verdocs/js-sdk/Envelopes/Permissions';
import {cancelEnvelope, throttledGetEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment, State} from '@stencil/core';
import {saveAttachment, saveCertificate, saveEnvelopesAsZip} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

/**
 * Render the documents attached to an envelope in read-only (view) mode. All documents are displayed in order.
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

  @State() isProcessing = false;
  @State() envelope: IEnvelope | null = null;
  @State() roleNames: string[] = [];
  @State() showCancelDone = false;

  componentWillLoad() {
    this.endpoint.loadSession();
  }

  // TODO: Handling signing vs preview-as-user cases
  // TODO: Handle anonymous case and failure to load due to not being logged in
  async componentWillRender() {
    if (!this.envelopeId) {
      console.error(`[VIEW] Missing required envelopeId`);
      return;
    }

    return this.reloadEnvelope();
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

  // TODO: Move this to the page renderer once the EnvelopePage model is deployed and envelope pages are individually processed
  async reloadEnvelope() {
    console.log('[VIEW] Loading envelope...');

    try {
      this.envelope = await throttledGetEnvelope(this.endpoint, this.envelopeId);
      this.roleNames = this.envelope.recipients.map(r => r.role_name);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[VIEW] Page rendered', pageInfo);
  }

  async handleOptionSelected(e) {
    switch (e.detail.id) {
      case 'cancel':
        // TODO: Better option for inline-flow confirmation and alert dialogs.
        if (confirm('Are you sure you wish to cancel this envelope? This action cannot be undone.')) {
          await cancelEnvelope(this.endpoint, this.envelopeId);
          this.showCancelDone = true;
          this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'canceled'});
        }
        break;

      case 'print':
        window.print();
        this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'printed'});
        break;

      case 'download-attachments':
        saveAttachment(this.endpoint, this.envelope, this.envelope.envelope_document_id)
          .then(() => {
            this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
          })
          .catch(e => {
            console.log('Error downloading PDF', e);
          });
        break;

      case 'download-certificate':
        saveCertificate(this.endpoint, this.envelope, this.envelope.certificate_document_id)
          .then(() => {
            this.envelopeUpdated?.emit({endpoint: this.endpoint, envelope: this.envelope, event: 'downloaded'});
          })
          .catch(e => {
            console.log('Error downloading PDF', e);
          });
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

    if (userCanCancelEnvelope(this.endpoint.session, this.envelope)) {
      menuOptions.push({id: 'cancel', label: 'Cancel'});
    }

    // Add download options to the menu
    const hasAttachments = this.envelope.documents.length > 0;
    const hasCertificate = !!this.envelope.certificate;
    if (hasAttachments || hasCertificate) {
      menuOptions.push({label: ''});
      if (hasAttachments) {
        menuOptions.push({id: 'download-attachments', label: 'Download Documents(s)'});
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
              const pageNumbers = integerSequence(1, envelopeDocument.page_numbers);

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
      </Host>
    );
  }
}
