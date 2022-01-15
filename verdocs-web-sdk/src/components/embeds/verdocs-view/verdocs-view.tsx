import pdf from 'pdfjs-dist';
import {PDFDocumentProxy, VerbosityLevel, version as PDFJSversion} from 'pdfjs-dist';
import {Component, h, Element, Event, Prop, Watch, EventEmitter, State} from '@stencil/core';
import {DocumentInitParameters, OnProgressParameters} from 'pdfjs-dist/types/src/display/api';
import {integerSequence} from '../../../utils/utils';

const CANVAS_MARGIN = 15;
const PDF_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJSversion}/pdf.worker.min.js`;
const CMAPS_URL = `https://unpkg.com/pdfjs-dist@${PDFJSversion}/cmaps/`;
// https://unpkg.com/pdfjs-dist@2.0.550/cmaps/78-EUC-H.bcmap

console.log('[VIEW] Loading PDF-JS', {PDF_WORKER_URL, CMAPS_URL});

// pdf.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
pdf.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

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
}

@Component({
  tag: 'verdocs-view',
  styleUrl: 'verdocs-view.scss',
  shadow: false,
})
export class VerdocsView {
  @Element() component: HTMLElement;

  private pdfDocument: any;
  private pdfContainer: HTMLDivElement;
  private numPages = 1;
  private fingerprint = null as string | null;

  /**
   * Rotate the PDF in degrees
   */
  @Prop() rotation: 0 | 90 | 180 | 270 = 0;

  /**
   * Src of the PDF to load and render
   */
  @Prop() source: string;

  /**
   * Access token to use. This component is a wrapper for PDF.js which does not use a VerdocsEndpoint, so the token must be supplied
   * directly.
   */
  @Prop() token: string | null = null;

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

  pagesRendered: IPDFPageInfo[] = [];

  isRotated(rotation) {
    return rotation !== 0 && rotation % 180 !== 0;
  }

  async renderPages(): Promise<void> {
    const pageNumbersToRender = integerSequence(1, this.numPages);

    for await (let pageNumber of pageNumbersToRender) {
      const index = pageNumber - 1;

      console.log('[VIEW] Rendering page', pageNumber);
      const page = await this.pdfDocument.getPage(pageNumber);
      const [pageX0, pageY0, pageX1, pageY1] = page.view;
      const rotation = page.rotate;

      const viewport = page.getViewport({scale: 1 / 0.75});
      // const viewport = page.getViewport({scale: 1.5});
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({canvasContext, viewport});
      this.pdfContainer.appendChild(canvas);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageWidth = pageX1 - pageX0;
      const pageHeight = pageY1 - pageY0;

      this.pagesRendered.sort((a, b) => a.pageNumber - b.pageNumber);
      const previousSibling = this.pagesRendered.filter(page => page.pageNumber < pageNumber).pop();
      const canvasTop = (previousSibling?.canvasBottom || 0) + CANVAS_MARGIN;
      console.log(`Computed top of ${canvasTop} for page ${pageNumber}`);

      const pageDetails = {
        pageNumber,
        width: canvasWidth,
        height: canvasHeight,
        originalWidth: this.isRotated(rotation) ? pageHeight : pageWidth,
        originalHeight: this.isRotated(rotation) ? pageWidth : pageHeight,
        xRatio: canvasWidth / pageWidth,
        yRatio: canvasHeight / pageHeight,
        canvasTop: canvasTop,
        canvasLeft: CANVAS_MARGIN,
        canvasRight: CANVAS_MARGIN + canvasWidth,
        canvasBottom: canvasTop + canvasHeight,
      } as IPDFPageInfo;

      if (this.pagesRendered[index]) {
        this.pagesRendered[index] = pageDetails;
      } else {
        this.pagesRendered.push(pageDetails);
      }

      const eventData = {pages: this.pagesRendered, numPages: this.numPages, numRendered: this.pagesRendered.length, canvasContainer: this.pdfContainer} as IPDFRenderEvent;
      this.pageRendered.emit(eventData);

      if (pageNumber >= this.numPages) {
        console.log('[VIEW] Done rendering');
        this.pagesRendered.sort((a, b) => a.pageNumber - b.pageNumber);
        this.documentRendered.emit(eventData);
      }
    }
  }

  componentDidLoad(): void {
    this.pdfContainer = document.getElementById('verdocs-pdf-viewer-container') as HTMLDivElement;

    if (this.source) {
      this.loadAndRender(this.source);
    }
  }

  onProgress(progress: OnProgressParameters) {
    this.loadProgress = Math.floor((100 * progress.loaded) / progress.total);
  }

  loadAndRender(src: string): void {
    console.log('[VIEW] Loading', src);
    const httpHeaders = this.token ? {Authorization: `Bearer ${this.token}`} : {};

    const source = {
      url: src,
      withCredentials: true,
      cMapUrl: CMAPS_URL,
      cMapPacked: true,
      verbosity: VerbosityLevel.WARNINGS,
      httpHeaders,
    } as DocumentInitParameters;

    // @ts-ignore
    const loadingTask = pdf.getDocument(source, null, null, this.onProgress);
    loadingTask.onProgress = this.onProgress;
    loadingTask.promise.then((pdfDocument: PDFDocumentProxy) => {
      this.loadProgress = 100;
      this.numPages = pdfDocument.numPages;
      this.fingerprint = pdfDocument.fingerprints[0];
      console.log(`[VIEW] Got PDF document fingerprint "${this.fingerprint}, ${this.numPages} pages`, pdfDocument);

      this.pdfDocument = pdfDocument;
      this.renderPages().catch(e => console.log('Rendering error', e));
    });
  }

  render() {
    return (
      <div class="container">
        {this.loadProgress < 100 ? <verdocs-loader /> : <div style={{display: 'none'}} />}
        <div id="verdocs-pdf-viewer-container" />
      </div>
    );
  }
}
