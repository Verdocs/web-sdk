import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, h, Element, Event, Host, Prop, EventEmitter, Fragment} from '@stencil/core';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {getEnvelopeById} from '../../../utils/Envelopes';
import EnvelopeStore from '../../../utils/envelopeStore';
import {IDocumentPageInfo} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';

export interface ISourcePageMetrics {
  width: number;
  height: number;
}

export interface IPageRenderEvent {
  renderedPage: IDocumentPageInfo;
  sourcePageMetrics: ISourcePageMetrics;
  pages: Record<number, IDocumentPageInfo>;
}

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

  async handleFieldChange(field: IDocumentField, e: any, optionId?: string) {
    console.log('fieldChange', field, e);
    switch (field.type) {
      case 'textbox':
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            if (e.response?.status === 401 && e.response?.data?.error === 'jwt expired') {
              console.log('jwt expired');
            }
            console.log('Error updating', e);
          });
        break;

      case 'checkbox_group':
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: {options: [{id: optionId, checked: e.detail}]}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'radio_button_group':
        const options = field.settings.options.map(option => ({id: option.id, selected: optionId === option.id}));
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: {options}})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'dropdown':
        Envelopes.updateEnvelopeField(this.endpoint, this.envelopeId, field.name, {prepared: false, value: e.detail})
          .then(r => console.log('Update result', r))
          .catch(e => {
            this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
            console.log('Error updating', e);
          });
        break;

      case 'initial':
        console.log('Got initial', e.detail);
        break;

      case 'signature':
        console.log('Got signature', e.detail);
        break;
    }
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IDocumentPageInfo;
    console.log('[SIGN] Page rendered', pageInfo);

    EnvelopeStore.envelope.recipients.map(recipient => {
      const fields = recipient.fields.filter(field => field.page === pageInfo.pageNumber);
      // const fields = this.fields.filter(field => field.page_sequence === pageInfo.renderedPage.pageNumber);
      console.log('[SIGN] Fields on page', fields);
      fields.forEach(field => {
        const el = renderDocumentField(field, pageInfo, getRoleIndex(EnvelopeStore.roleNames, field.recipient_role), this.handleFieldChange, true, false, false);
        console.log('rendered element', el);
        // const el = renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(this.roles, field.role_name), this.handleFieldChange, true, true, true);
        if (!el) {
          return;
        }

        el.addEventListener('recipientChanged', e => {
          el.setAttribute('roleindex', getRoleIndex(EnvelopeStore.roleNames, e.detail));
          // el.setAttribute('roleindex', getRoleIndex(this.roles, e.detail));
        });

        el.setAttribute('xScale', pageInfo.xScale);
        el.setAttribute('yScale', pageInfo.yScale);

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
      </Host>
    );
  }
}
