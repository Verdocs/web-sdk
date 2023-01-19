import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment} from '@stencil/core';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';
import {savePDF} from '../../../utils/utils';

const PrintIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"></path></svg>`;

const DownloadIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg>`;

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
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  componentWillLoad() {
    this.endpoint.loadSession();
  }

  // TODO: Handling signing vs preview-as-user cases
  // TODO: Handle anonymous case and failure to load due to not being logged in
  async componentDidLoad() {
    if (!this.envelopeId) {
      console.error(`[VIEW] Missing required envelopeId`);
      return;
    }

    try {
      await getEnvelopeById(this.endpoint, this.envelopeId);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[SIGN] Page rendered', pageInfo);
  }

  render() {
    console.log('[VIEW] Rendering', EnvelopeStore.error, EnvelopeStore.loading, EnvelopeStore.envelope);
    if (EnvelopeStore.loading || !EnvelopeStore.envelope) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (EnvelopeStore.error) {
      return (
        <Host>
          <div>{EnvelopeStore.error}</div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="header">
          <div class="inner">
            <div class="toolbar">
              <div class="tools">
                <Fragment>
                  <img src="https://verdocs.com/assets/white-logo.svg" alt="Verdocs Logo" class="logo" />
                  <div class="title">{EnvelopeStore.envelope.name}</div>
                  <div style={{flex: '1'}} />
                  <div innerHTML={PrintIcon} style={{width: '24px', height: '24px', fill: '#ffffff', cursor: 'pointer'}} onClick={() => window.print()} />
                  <div
                    innerHTML={DownloadIcon}
                    style={{width: '24px', height: '24px', fill: '#ffffff', cursor: 'pointer', marginLeft: '16px', maginRight: '30px'}}
                    onClick={() => savePDF(this.endpoint, EnvelopeStore.envelope, EnvelopeStore.envelope.envelope_document_id).catch(() => {})}
                  />
                </Fragment>
              </div>
            </div>
          </div>
        </div>

        <div class="document">
          {(EnvelopeStore.envelope?.documents || []).map(envelopeDocument => {
            const pages = [...(envelopeDocument?.pages || [])];
            pages.sort((a, b) => a.sequence - b.sequence);

            return (
              <Fragment>
                {pages.map(page => (
                  <verdocs-document-page
                    pageImageUri={page.display_uri}
                    virtualWidth={612}
                    virtualHeight={792}
                    pageNumber={page.sequence}
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
      </Host>
    );
  }
}
