import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment} from '@stencil/core';
import {getRoleIndex, renderDocumentField, savePDF} from '../../../utils/utils';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

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
      console.error(`[VIEW] Missing reuqired envelopeId`);
      return;
    }

    try {
      await getEnvelopeById(this.endpoint, this.envelopeId);
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  // Determine whether a page is "rotated" (in either direction)
  // isRotated(rotation) {
  //   return rotation !== 0 && rotation % 180 !== 0;
  // }

  // Render one document page. Note that pageNumber is 1-based.
  // async renderPage(pageNumber: number): Promise<void> {
  //   const domPage = this.domPages[pageNumber];
  //
  //   // Two async operations happen here, loading the PDF and rendering the DOM div/canvas placeholders to draw the pages on.
  //   if (!domPage) {
  //     console.log('[VIEW] Skipping rendering page not yet in DOM', {pageNumber});
  //     return;
  //   }
  //
  //   const pageMetrics = this.sourcePageMetrics[pageNumber];
  //
  //   console.log('[VIEW] Rendering page', {pageNumber, pageMetrics, domPage});
  //   try {
  //     // const pdfPage = await this.pdfDocument.getPage(pageNumber);
  //     // const viewport = pdfPage.getViewport({scale: domPage.xScale});
  //     // console.log('[VIEW] Page viewport', domPage.xScale, viewport);
  //
  //     // const canvas = document.getElementById(`${domPage.containerId}-page`) as HTMLCanvasElement | null;
  //     // if (!canvas) {
  //     //   console.log('[VIEW] Unable to find canvas element');
  //     //   return;
  //     // }
  //     //
  //     // canvas.width = domPage.renderedWidth;
  //     // canvas.height = domPage.renderedHeight;
  //     // const canvasContext = canvas.getContext('2d');
  //     // canvasContext.clearRect(0, 0, domPage.renderedWidth, domPage.renderedHeight);
  //     // await pdfPage.render({canvasContext, viewport});
  //
  //     this.pageRendered.emit({
  //       renderedPage: domPage,
  //       sourcePageMetrics: pageMetrics,
  //       pages: this.domPages,
  //     });
  //   } catch (e) {
  //     this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
  //     console.warn('[VIEW] Error rendering page', e);
  //   }
  // }

  // async renderPages(): Promise<void> {
  //   const pageNumbersToRender = integerSequence(1, this.numPages);
  //   for await (let pageNumber of pageNumbersToRender) {
  //     try {
  //       await this.renderPage(pageNumber);
  //     } catch (e) {
  //       this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
  //       console.warn('[VIEW] Error rendering pages', e);
  //     }
  //   }
  // }

  // onProgress(progress: OnProgressParameters) {
  //   console.log(`[VIEW] Progress ${Math.floor((progress.loaded / progress.total) * 100)} (${progress.loaded} / ${progress.total})`);
  //   this.loadProgress = Math.floor((100 * progress.loaded) / progress.total);
  // }

  // After a document is done loading, go through its pages to get their dimensions
  // async parsePageMetrics(pdfDocument: pdfjsLib.PDFDocumentProxy) {
  //   const pageNumbersToRender = integerSequence(1, pdfDocument.numPages);
  //
  //   for await (let pageNumber of pageNumbersToRender) {
  //     const pdfPage = await pdfDocument.getPage(1);
  //     const [pageX0, pageY0, pageX1, pageY1] = pdfPage.view;
  //     this.sourcePageMetrics[pageNumber] = {width: pageX1 - pageX0, height: pageY1 - pageY0};
  //   }
  //
  //   console.log('[VIEW] Parsed page metrics', this.sourcePageMetrics);
  // }

  // loadAndRender(src: string): void {
  //   console.log('[VIEW] Loading', src);
  //
  //   const token = this.endpoint.getToken();
  //   const httpHeaders = token ? {Authorization: `Bearer ${token}`} : {};
  //
  //   const source = {
  //     url: src,
  //     cMapUrl: CMAPS_URL,
  //     cMapPacked: true,
  //     httpHeaders,
  //     withCredentials: true,
  //     stopAtErrors: true,
  //     verbosity: pdfjsLib.VerbosityLevel.WARNINGS,
  //     // verbosity: pdfjsLib.VerbosityLevel.INFOS,
  //   } as DocumentInitParameters;
  //
  //   // @ts-ignore
  //   const loadingTask = pdf.getDocument(source, null, null, this.onProgress);
  //   loadingTask.onProgress = this.onProgress;
  //   loadingTask.promise
  //     .then(async (pdfDocument: pdfjsLib.PDFDocumentProxy) => {
  //       await this.parsePageMetrics(pdfDocument);
  //
  //       this.pdfDocument = pdfDocument;
  //       this.numPages = pdfDocument.numPages;
  //       this.fingerprints = pdfDocument.fingerprints;
  //       console.log(`[VIEW] Got PDF document fingerprints "${this.fingerprints.join(', ')}", ${this.numPages} page(s)`);
  //
  //       // We don't try to render the pages here, setting loadProtress triggers that by adding the individual page entries in
  //       // DOM in render() below. Each page then fires onPageRendered when it is ready to receive content.
  //       this.loadProgress = 100;
  //     })
  //     .catch(e => {
  //       this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
  //       console.log('[VIEW] Loading error', e);
  //     });
  // }

  // async handlePageRendered(e: any) {
  //   e.stopPropagation();
  //
  //   const domPage = e.detail as IDocumentPageInfo;
  //   this.domPages[domPage.pageNumber] = domPage;
  //   await this.renderPage(domPage.pageNumber);
  // }

  attachFieldAttributes(pageInfo, roleIndex, el) {
    el.setAttribute('roleindex', roleIndex);
    el.setAttribute('xScale', pageInfo.xScale);
    el.setAttribute('yScale', pageInfo.yScale);
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[SIGN] Page rendered', pageInfo);

    EnvelopeStore.envelope.recipients.map(recipient => {
      const fields = recipient.fields.filter(field => field.page === pageInfo.pageNumber);
      // const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
      console.log('[SIGN] Fields on page', fields);
      fields.forEach(field => {
        const roleIndex = getRoleIndex(EnvelopeStore.roleNames, field.recipient_role);
        const el = renderDocumentField(field, pageInfo, roleIndex, {
          disabled: true,
          editable: false,
          draggable: false,
          done: true,
        });
        if (!el) {
          return;
        }

        if (Array.isArray(el)) {
          el.map(e => this.attachFieldAttributes(pageInfo, roleIndex, e));
        } else {
          this.attachFieldAttributes(pageInfo, roleIndex, el);
        }

        // interact(el).draggable({
        //   listeners: {
        //     start(event) {
        //       console.log('[FIELDS] Drag started', event.type, event.target);
        //     },
        //     move(event) {
        //       const oldX = +(event.target.getAttribute('posX') || 0);
        //       const oldY = +(event.target.getAttribute('posY') || 0);
        //       const xScale = +(event.target.getAttribute('xScale') || 1);
        //       const yScale = +(event.target.getAttribute('yScale') || 1);
        //       const newX = event.dx / xScale + oldX;
        //       const newY = event.dy / yScale + oldY;
        //       event.target.setAttribute('posX', newX);
        //       event.target.setAttribute('posy', newY);
        //       updateCssTransform(event.target, 'translate', `${newX}px, ${newY}px`);
        //     },
        //     end(event) {
        //       console.log('[FIELDS] Drag ended', event);
        //       // event.target.setAttribute('posX', 0);
        //       // event.target.setAttribute('posy', 0);
        //       // updateCssTransform(event.target, 'translate', `${0}px, ${0}px`);
        //     },
        //   },
        // });
      });
    });
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
