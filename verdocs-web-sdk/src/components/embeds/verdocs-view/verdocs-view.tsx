import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {getEnvelope} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {Component, h, Element, Event, Host, Prop, EventEmitter, State} from '@stencil/core';
import {IDocumentPageInfo, IPageLayer} from '../../../utils/Types';
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
 * View all of the documents attached to a template or envelope. All documents are displayed, in order. This embed wraps
 * verdocs-view-envelope-document or verdocs-view-template-document, as appropriate, and those controls may be used if
 * fine-grained control over which documents are displayed (or their order) is required.
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
   * The template ID to render. Set ONE OF templateId or envelopeId.
   */
  @Prop() templateId: string = '';

  /**
   * The envelope ID to render. Set ONE OF templateId or envelopeId. If both are set, envelopeId will be ignored.
   */
  @Prop() envelopeId: string = '';

  /**
   * Rotate the PDF in degrees
   */
  @Prop() rotation: 0 | 90 | 180 | 270 = 0;

  /**
   * Layers will be passed through to the individual pages inside this component.
   */
  @Prop() pageLayers: IPageLayer[] = [
    {name: 'page', type: 'canvas'},
    {name: 'controls', type: 'div'},
  ];

  /**
   * Fired when a page has been rendered
   */
  @Event() pageRendered: EventEmitter<IPageRenderEvent>;

  /**
   * Fired when a page has been changed
   */
  @Event() pageLoaded: EventEmitter<number>;

  /**
   * Fired when a page has been changed
   */
  @Event() pageChange: EventEmitter<number>;

  /**
   * Fired when a page has been initialized
   */
  @Event() pageInit: EventEmitter<number>;

  /**
   * Fired when a page has been scaled
   */
  @Event() scaleChange: EventEmitter<number>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() template?: ITemplate = null;
  @State() envelope?: IEnvelope = null;

  componentWillLoad() {
    this.endpoint.loadSession();
  }

  // TODO: Handling signing vs preview-as-user cases
  // TODO: Handle anonymous case and failure to load due to not being logged in
  async componentDidLoad() {
    if (!this.templateId && !this.envelopeId) {
      console.error(`[VIEW] Must specify one of templateId or envelopeId`);
      return;
    }

    if (this.templateId && this.envelopeId) {
      console.warn(`[VIEW] Both templateId and envelopeId specified, using templateId`);
    }

    try {
      if (this.templateId) {
        console.log('[VIEW] Loading template', this.templateId);
        this.template = await getTemplate(this.endpoint, this.templateId);
        console.log('[VIEW] Loaded template', this.template);
      } else if (this.envelopeId) {
        console.log('[VIEW] Loading envelope', this.envelopeId);
        this.envelope = await getEnvelope(this.endpoint, this.envelopeId);
        console.log('[VIEW] Loaded envelope', this.envelope);
      }

      // console.log(`[VIEW] Loading template ${this.templateId}`);
      // const template = await getTemplate(this.endpoint, this.templateId);
      //
      // console.log('[VIEW] Got template', this.template);
      // this.template = template;
      // this.pageNumbers = integerSequence(1, template.pages.length);
      //
      // const pageUris: Record<number, string> = {};
      // for await (let page of template.pages) {
      //   console.log('[VIEW] Loading page', page);
      //   // TODO: Make an endpoint to get all of the pages for a template
      //   // TODO: When uploading a new template, pre-process its pages into images and comment that the individual page-loader is a utility,
      //   //  not the primary mechanism.
      //   const image = await getPageImage(this.endpoint, this.templateId, page.sequence);
      //   // TODO: Make this uri to match the rest of the terminology?
      //   pageUris[page.sequence] = image.url;
      //   console.log('[VIEW] Got image Uri', image.url);
      //   this.loadProgress = page.sequence / template.pages.length;
      // }
      //
      // this.pageUris = pageUris;
      // this.loadProgress = 100;
      //
      // // this.pdfUrl = `${this.endpoint.getBaseURL()}/templates/${this.templateId}/documents/${template.template_document?.id}?file=true`;
    } catch (e) {
      console.log('[VIEW] Error loading data', e);
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

  render() {
    console.log('[VIEW] Rendering', this.templateId, this.envelopeId);

    // TODO: Error handling for missing pages. Is it better to skip the page or show a placeholder?
    return (
      <Host>
        {this.template && (
          <verdocs-view-template-document
            endpoint={this.endpoint}
            templateId={this.templateId}
            documentId={this.template.template_document?.id}
            onPageRendered={p => this.pageRendered?.emit(p.detail)}
          />
        )}
        {this.envelope && (
          <verdocs-view-envelope-document
            endpoint={this.endpoint}
            envelopeId={this.envelopeId}
            documentId={this.envelope.envelope_document_id}
            onPageRendered={p => this.pageRendered?.emit(p.detail)}
          />
        )}
      </Host>
    );
  }
}
