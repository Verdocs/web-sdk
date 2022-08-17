import pdf from 'pdfjs-dist';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import {Component, h, Element, Event, Prop, Watch, EventEmitter, State} from '@stencil/core';
import {DocumentInitParameters, OnProgressParameters} from 'pdfjs-dist/types/src/display/api';
import {integerSequence} from '../../../utils/utils';
import {IDocumentPageInfo} from '../../elements/verdocs-document-page/verdocs-document-page';

const CANVAS_MARGIN = 15;
const PDF_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
const CMAPS_URL = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`;

console.log('[VIEW] Loading PDF-JS', {PDF_WORKER_URL, CMAPS_URL});
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

export interface IPDFPageInfo {
  height: number;
  width: number;
  originalHeight: number;
  originalWidth: number;
  xRatio: number;
  yRatio: number;
  pageNumber: number;
  canvasTop: number;
  canvasRight: number;
  canvasLeft: number;
  canvasBottom: number;
}

export interface IPDFRenderEvent {
  numRendered: number;
  numPages: number;
  pages: IPDFPageInfo[];
  canvasContainer: HTMLDivElement;
  renderedPage: IPDFPageInfo;
}

@Component({
  tag: 'verdocs-view',
  styleUrl: 'verdocs-view.scss',
  shadow: false,
})
export class VerdocsView {
  @Element() component: HTMLElement;
  private resizeObserver: ResizeObserver;

  private pdfDocument: any;
  private pdfContainer: HTMLDivElement;
  private fingerprints = [] as string[];

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Rotate the PDF in degrees
   */
  @Prop() rotation: 0 | 90 | 180 | 270 = 0;

  /**
   * Src of the PDF to load and render
   */
  @Prop() source: string;

  /**
   * Listen for changes to src
   */
  @Watch('source')
  doSrc(newValue: string | null, oldValue: string | null): void {
    if (newValue === oldValue) {
      return;
    }
    this.loadAndRender(newValue);
  }

  /**
   * Fired when a page has been rendered
   */
  @Event() pageRendered: EventEmitter<IPDFRenderEvent>;

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
   * Fired when the document has completed rendered. The event will include the rendered page count.
   */
  @Event() documentRendered: EventEmitter<IPDFRenderEvent>;

  @State() loadProgress = 0;

  @State()
  numPages = 0;

  pagesRendered: IPDFPageInfo[] = [];

  domPages: Record<number, IDocumentPageInfo> = {};

  componentWillLoad(): void {
    this.endpoint.loadSession();
  }

  componentDidLoad(): void {
    this.pdfContainer = document.getElementById('verdocs-pdf-viewer-container') as HTMLDivElement;

    if (this.source) {
      this.loadAndRender(this.source);
    }

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        console.log('resizeObserver entry', entry.contentRect);
        // this.applySizeClasses(entry.contentRect.width);
      }
      // Do stuff!
    });
    this.resizeObserver.observe(this.component);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  // Determine whether a page is "rotated" (in either direction)
  isRotated(rotation) {
    return rotation !== 0 && rotation % 180 !== 0;
  }

  // Render one document page
  async renderPage(pageNumber: number): Promise<void> {
    const index = pageNumber - 1;
    const domPage = this.domPages[pageNumber];

    // Two async operations happen here, loading the PDF and rendering the DOM div/canvas placeholders to draw the pages on.
    if (!domPage) {
      console.log('[VIEW] Skipping rendering page not yet in DOM', {index, pageNumber});
      return;
    }

    console.log('[VIEW] Rendering page', {index, pageNumber, domPage});
    try {
      const page = await this.pdfDocument.getPage(pageNumber);
      const [pageX0, pageY0, pageX1, pageY1] = page.view;
      console.log('[VIEW] Page metrics', {pageX0, pageY0, pageX1, pageY1});
      const rotation = page.rotate;

      const viewport = page.getViewport({scale: domPage.xScale});
      console.log('[VIEW] Page viewport', viewport.width, viewport.height, viewport.viewBox);

      // const viewport = page.getViewport({scale: 1.5});
      const canvas = document.getElementById(`${domPage.containerId}-page`) as HTMLCanvasElement | null;
      if (!canvas) {
        console.log('[VIEW] Unable to find canvas element');
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      console.log('[VIEW] Canvas', canvas, canvas.width, canvas.height);

      const canvasContext = canvas.getContext('2d');
      await page.render({canvasContext, viewport});

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageWidth = pageX1 - pageX0;
      const pageHeight = pageY1 - pageY0;

      console.log('[VIEW] Final dimensions', {canvasWidth, canvasHeight, pageWidth, pageHeight});

      this.pagesRendered.sort((a, b) => a.pageNumber - b.pageNumber);
      const previousSibling = this.pagesRendered.filter(page => page.pageNumber < pageNumber).pop();
      const canvasTop = (previousSibling?.canvasBottom || 0) + CANVAS_MARGIN;

      const pageDetails: IPDFPageInfo = {
        pageNumber,
        width: canvasWidth,
        height: canvasHeight,
        originalWidth: this.isRotated(rotation) ? pageHeight : pageWidth,
        originalHeight: this.isRotated(rotation) ? pageWidth : pageHeight,
        xRatio: domPage.xScale,
        yRatio: domPage.yScale,
        canvasTop: canvasTop,
        canvasLeft: CANVAS_MARGIN,
        canvasRight: CANVAS_MARGIN + canvasWidth,
        canvasBottom: canvasTop + canvasHeight,
      };

      if (this.pagesRendered[index]) {
        this.pagesRendered[index] = pageDetails;
      } else {
        this.pagesRendered.push(pageDetails);
      }

      const eventData: IPDFRenderEvent = {
        pages: this.pagesRendered,
        numPages: this.numPages,
        numRendered: this.pagesRendered.length,
        canvasContainer: this.pdfContainer,
        renderedPage: pageDetails,
      };

      this.pageRendered.emit(eventData);

      if (pageNumber >= this.numPages) {
        console.log('[VIEW] Done rendering');
        this.pagesRendered.sort((a, b) => a.pageNumber - b.pageNumber);
        this.documentRendered.emit(eventData);
      }
    } catch (e) {
      console.warn('[VIEW] Error rendering page', e);
    }
  }

  async renderPages(): Promise<void> {
    const pageNumbersToRender = integerSequence(1, this.numPages);

    for await (let pageNumber of pageNumbersToRender) {
      try {
        await this.renderPage(pageNumber);
      } catch (e) {
        console.warn('[VIEW] Error rendering pages', e);
      }
    }
  }

  onProgress(progress: OnProgressParameters) {
    console.log(`[VIEW] Progress ${Math.floor((progress.loaded / progress.total) * 100)} (${progress.loaded} / ${progress.total})`);
    this.loadProgress = Math.floor((100 * progress.loaded) / progress.total);
  }

  loadAndRender(src: string): void {
    console.log('[VIEW] Loading', src);

    const token = this.endpoint.getToken();
    const httpHeaders = token ? {Authorization: `Bearer ${token}`} : {};

    const source = {
      url: src,
      cMapUrl: CMAPS_URL,
      cMapPacked: true,
      httpHeaders,
      withCredentials: true,
      verbosity: pdfjsLib.VerbosityLevel.INFOS,

      // TODO
      stopAtErrors: true,
    } as DocumentInitParameters;

    // @ts-ignore
    const loadingTask = pdf.getDocument(source, null, null, this.onProgress);
    loadingTask.onProgress = this.onProgress;
    loadingTask.promise
      .then((pdfDocument: pdfjsLib.PDFDocumentProxy) => {
        this.loadProgress = 100;
        this.numPages = pdfDocument.numPages;
        this.fingerprints = pdfDocument.fingerprints;
        console.log(`[VIEW] Got PDF document fingerprints "${this.fingerprints.join(', ')}", ${this.numPages} pages`);

        this.pdfDocument = pdfDocument;
        this.renderPages().catch(e => console.log('Rendering error', e));
      })
      .catch(e => {
        console.log('[VIEW] Loading error', e);
      });
  }

  render() {
    return (
      <div class="container">
        {this.loadProgress < 100 ? <verdocs-loader /> : <div style={{display: 'none'}} />}
        <div id="verdocs-pdf-viewer-container" />
        {Array.apply(null, Array(this.numPages)).map((_, index) => (
          <verdocs-document-page
            pageNumber={index + 1}
            virtualWidth={612}
            virtualHeight={792}
            layers={[
              {name: 'page', type: 'canvas'},
              {name: 'controls', type: 'div'},
            ]}
            onPageRendered={(e: any) => {
              const domPage = e.detail as IDocumentPageInfo;
              this.domPages[domPage.pageNumber] = domPage;
              console.log('[VIEW] Document pages updated', domPage.pageNumber, this.domPages);
              this.renderPage(domPage.pageNumber).catch(() => {});
            }}
          />
        ))}
      </div>
    );
  }
}
