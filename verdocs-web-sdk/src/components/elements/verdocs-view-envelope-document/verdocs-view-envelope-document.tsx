import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IEnvelopeDocument} from '@verdocs/js-sdk/Envelopes/Types';
import {getEnvelopeDocument} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {Component, h, Element, Event, Host, Prop, EventEmitter, State} from '@stencil/core';
import {IDocumentPageInfo, IPageLayer} from '../../../utils/Types';
import {SDKError} from '../../../utils/errors';
// import TemplateStore from '../../../utils/templateStore';
import {getRoleIndex, renderDocumentField} from '../../../utils/utils';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';

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
 * View a single document attached to an envelope. Note that envelopes always require authentication to access them. If you are viewing
 * this component in Storybook, visit Embeds > Auth first to log in, then paste a valid envelopeId and documentId in the properties
 * below from your account to view that envelope. If you want to see an anonymous-access use case, this component is functionally similar
 * to ViewTemplateDocument, which is pre-configured to display a public template.
 */
@Component({
  tag: 'verdocs-view-envelope-document',
  styleUrl: 'verdocs-view-envelope-document.scss',
  shadow: false,
})
export class VerdocsViewEnvelopeDocument {
  @Element() component: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The envelope ID to render
   */
  @Prop() envelopeId: string = '';

  /**
   * The document ID to render
   */
  @Prop() documentId: string = '';

  /**
   * The mode to render in. 'preview' will display the document fields in readonly mode.
   * 'sign' will make them editable.
   */
  @Prop() mode: string = '';

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

  @State() envelopeDocument: IEnvelopeDocument | null = null;

  domPages: Record<number, IDocumentPageInfo> = {};

  sourcePageMetrics: Record<number, {width: number; height: number}> = {};

  componentWillLoad() {
    this.endpoint.loadSession();
  }

  // TODO: Handling signing vs preview-as-user cases
  // TODO: Handle anonymous case and failure to load due to not being logged in
  async componentDidLoad() {
    if (!this.envelopeId || !this.documentId) {
      console.log(`[ENVELOPE] Missing required envelope ID ${this.envelopeId}`);
      return;
    }

    try {
      console.log(`[ENVELOPE] Loading envelope ${this.envelopeId}`);
      this.envelopeDocument = await getEnvelopeDocument(this.endpoint, this.envelopeId, this.documentId);
      if (!this.envelopeDocument) {
        console.error('[ENVELOPE] Unable to load envelope document', this.envelopeId, this.documentId);
      }

      console.log('[ENVELOPE] Got envelope document', this.envelopeDocument);
    } catch (e) {
      console.log('[ENVELOPE] Error loading envelope', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  // Render one document page. Note that pageNumber is 1-based.
  async renderPage(pageNumber: number): Promise<void> {
    const domPage = this.domPages[pageNumber];

    // Two async operations happen here, loading the PDF and rendering the DOM div/canvas placeholders to draw the pages on.
    if (!domPage) {
      console.log('[ENVELOPE] Skipping rendering page not yet in DOM', {pageNumber});
      return;
    }

    const pageMetrics = this.sourcePageMetrics[pageNumber];

    console.log('[ENVELOPE] Rendering page', {pageNumber, pageMetrics, domPage});
    try {
      // const pdfPage = await this.pdfDocument.getPage(pageNumber);
      // const viewport = pdfPage.getViewport({scale: domPage.xScale});
      // console.log('[VIEW-TEMPLATE] Page viewport', domPage.xScale, viewport);

      // const canvas = document.getElementById(`${domPage.containerId}-page`) as HTMLCanvasElement | null;
      // if (!canvas) {
      //   console.log('[VIEW-TEMPLATE] Unable to find canvas element');
      //   return;
      // }
      //
      // canvas.width = domPage.renderedWidth;
      // canvas.height = domPage.renderedHeight;
      // const canvasContext = canvas.getContext('2d');
      // canvasContext.clearRect(0, 0, domPage.renderedWidth, domPage.renderedHeight);
      // await pdfPage.render({canvasContext, viewport});

      this.pageRendered.emit({
        renderedPage: domPage,
        sourcePageMetrics: pageMetrics,
        pages: this.domPages,
      });
    } catch (e) {
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      console.warn('[VIEW-ENVELOPE] Error rendering page', e);
    }
  }

  // async renderPages(): Promise<void> {
  //   const pageNumbersToRender = integerSequence(1, this.numPages);
  //   for await (let pageNumber of pageNumbersToRender) {
  //     try {
  //       await this.renderPage(pageNumber);
  //     } catch (e) {
  //       this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
  //       console.warn('[VIEW-TEMPLATE] Error rendering pages', e);
  //     }
  //   }
  // }

  // onProgress(progress: OnProgressParameters) {
  //   console.log(`[VIEW-TEMPLATE] Progress ${Math.floor((progress.loaded / progress.total) * 100)} (${progress.loaded} / ${progress.total})`);
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
  //   console.log('[VIEW-TEMPLATE] Parsed page metrics', this.sourcePageMetrics);
  // }

  // loadAndRender(src: string): void {
  //   console.log('[VIEW-TEMPLATE] Loading', src);
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
  //       console.log(`[VIEW-TEMPLATE] Got PDF document fingerprints "${this.fingerprints.join(', ')}", ${this.numPages} page(s)`);
  //
  //       // We don't try to render the pages here, setting loadProtress triggers that by adding the individual page entries in
  //       // DOM in render() below. Each page then fires onPageRendered when it is ready to receive content.
  //       this.loadProgress = 100;
  //     })
  //     .catch(e => {
  //       this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
  //       console.log('[VIEW-TEMPLATE] Loading error', e);
  //     });
  // }

  async handleFieldChange(field: ITemplateField, e: any, optionId?: string) {
    console.log('[ENVELOPE] handleFieldChange', field, e, optionId);
  }

  handlePageRendered(e) {
    const pageInfo = e.detail as IPageRenderEvent;
    console.log('[ENVELOPE] Page rendered', pageInfo, this.envelopeDocument);
    // console.log('[PREVIEW] Page rendered', pageInfo, TemplateStore.fields);

    const fields = this.envelopeDocument.pages[pageInfo.renderedPage.pageNumber].fields;
    console.log('[ENVELOPE] Fields on page', fields);
    fields.forEach(field => renderDocumentField(field, pageInfo.renderedPage, getRoleIndex(TemplateStore.roleNames, field.role_name), this.handleFieldChange, true));
  }

  // async handlePageRendered(e: any) {
  //   e.stopPropagation();
  //
  //   const domPage = e.detail as IDocumentPageInfo;
  //   this.domPages[domPage.pageNumber] = domPage;
  //   await this.renderPage(domPage.pageNumber);
  // }

  render() {
    console.log('[ENVELOPE] Rendering pages', this.envelopeDocument?.pages);

    // TODO: The API is supposed to always return these sorted...
    const pages = [...(this.envelopeDocument?.pages || [])];
    pages.sort((a, b) => a.sequence - b.sequence);

    // TODO: Error handling for missing pages. Is it better to skip the page or show a placeholder?
    return (
      <Host>
        {pages.map(page => (
          <verdocs-document-page
            pageImageUri={page.display_uri}
            virtualWidth={612}
            virtualHeight={792}
            // TODO: Store image dimensions in the DB rows and pass them to clients with the page data
            // virtualWidth={this.sourcePageMetrics[pageNumber]?.width || 612}
            // virtualHeight={this.sourcePageMetrics[pageNumber]?.height || 792}
            pageNumber={page.sequence}
            layers={this.pageLayers}
            onPageRendered={p => this.handlePageRendered(p)}
          />
        ))}
      </Host>
    );
  }
}
