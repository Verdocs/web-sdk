import pdf from 'pdfjs-dist';
// import pdf from 'pdfjs-dist/build/pdf';
// import pdf from 'pdfjs-dist/build/pdf';
import {PDFDocumentProxy, VerbosityLevel, version as PDFJSversion} from 'pdfjs-dist';
// import {PDFDocumentProxy, PDFProgressData, PDFSource, VerbosityLevel, version as PDFJSversion} from 'pdfjs-dist';
import {Component, h, Element, Event, Prop, Watch, EventEmitter, State} from '@stencil/core';
// import {PDFDocumentProxy, PDFPageProxy, PDFPageViewport, PDFRenderParams, PDFRenderTask} from 'pdfjs-dist';
// import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import {integerSequence} from '../../../utils/utils';
import {DocumentInitParameters, OnProgressParameters} from 'pdfjs-dist/types/src/display/api';

const PDF_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJSversion}/pdf.worker.min.js`;
const CMAPS_URL = `https://unpkg.com/pdfjs-dist@${PDFJSversion}/cmaps/`;
// https://unpkg.com/pdfjs-dist@2.0.550/cmaps/78-EUC-H.bcmap

console.log('[VIEW] Loading PDF-JS', {PDF_WORKER_URL, CMAPS_URL});

// pdf.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
// pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJSversion}/pdf.worker.min.js`;

// TODO: Re-enable this
pdf.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

// export interface PDFViewerEvent {
//   type: 'click';
//   pdfDocument: any;
// }

@Component({
  tag: 'verdocs-view',
  styleUrl: 'verdocs-view.scss',
  shadow: false,
})
export class VerdocsView {
  @Element() component: HTMLElement;

  // @Event() pdfClicked: EventEmitter<PDFViewerEvent>;

  buttonClicked() {
    console.log('PDF clicked', this);
    // this.pdfClicked.emit({type: 'click', pdfDocument: {name: 'test', active: true}});
  }

  // private isPageRendering: boolean;
  private pdfDocument: any;
  // private pageNumPending: number = null;
  private pdfContainer: HTMLDivElement;
  // private canvas: HTMLCanvasElement;
  // private ctx: CanvasRenderingContext2D;
  // private scale = 1.319852941176471;
  // private scale = 2;
  // private pageNum = 1;
  private numPages = 1;

  private fingerprint = null as string | null;

  /**
   * Rotate the PDF in degrees
   * {number}
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

  //
  // --- Event Emitters --- //
  //
  @Event() pageRendered: EventEmitter<number>;
  // @Event() error: EventEmitter<any>;
  @Event() pageChange: EventEmitter<number>;

  @State() loadProgress = 0;

  // @Method()
  // async pageNext(e: MouseEvent) {
  //   e.preventDefault();
  //
  //   if (this.pageNum >= this.pdfDocument.numPages) {
  //     return;
  //   }
  //   this.pageNum += 1;
  //   this.queueRenderPage(this.pageNum);
  // }

  /**
   * Page backward
   * e
   */
  // @Method()
  // async pagePrev(e: MouseEvent) {
  //   e.preventDefault();
  //
  //   if (this.pageNum <= 1) {
  //     return;
  //   }
  //
  //   this.pageNum -= 1;
  //   this.queueRenderPage(this.pageNum);
  // }

  async renderPages(): Promise<void> {
    // async renderPage(pageNumber: number): Promise<void> {
    // this.isPageRendering = true;

    // console.log('offset width', this.component.offsetWidth);

    // const numPages = this.pdf._pdfInfo.numPages;
    // const offsetWidth = 10;
    //this.container.offsetWidth;
    // let largestWidth = 0;
    // let scale = 1;
    // let stickToPage = true;
    const pageNumbersToRender = integerSequence(1, this.numPages);

    console.log('Page numbers to render', pageNumbersToRender);
    for await (let pageNum of pageNumbersToRender) {
      console.log('Rendering page', pageNum);
      const page = await this.pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({scale: 1.5});
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      if (pageNum > 1) {
        canvas.style.marginTop = '10px';
        // canvas.style.maxWidth = '100%';
      }
      await page.render({canvasContext, viewport});
      this.pdfContainer.appendChild(canvas);
    }
    // for (let pageNum = 1; pageNum <= this.numPages; pageNum++) {
    //   await this.pdfDocument.getPage(pageNum).then(page => {
    //     // { width: 816, height: 1056, offsetX: 0, offsetY: 0, rotation: 0, scale: 1.3333333333333333,
    //     //   viewBox: [0, 0, 612, 792], transform: [1.3333333333333333, 0, 0, -11.3333333333333333, 0, 1056] }
    //     // const viewport = page.getViewport({scale: 2});
    //     // console.log('Viewport', pageNum, viewport);
    //     // largestWidth = largestWidth === 0 || viewport.width > largestWidth ? viewport.width : largestWidth;
    //     // const viewportWidth = largestWidth > viewport.width ? largestWidth : viewport.width;
    //     // if (viewport.width > offsetWidth) {
    //     //   scale = offsetWidth / viewportWidth;
    //     //   stickToPage = false;
    //     // }
    //
    //     // var scale = pageScale;
    //     const viewport = page.getViewport({scale: 2});
    //     const canvas = document.createElement('canvas');
    //     const canvasContext = canvas.getContext('2d');
    //     canvas.height = viewport.height;
    //     canvas.width = viewport.width;
    //     page.render({canvasContext, viewport});
    //     document.body.appendChild(canvas);
    //   });
    // }
    // console.log({largestWidth, scale, stickToPage});

    // this.pdfDocument.setScale()
    // this.pdfViewer._setScale(scale, stickToPage);

    // console.log('Rendering page', pageNumber);
    // this.pdfDocument.getPage(pageNumber).then((page: PDFPageProxy) => {
    //   const viewport: PDFPageViewport = page.getViewport({scale: this.scale, rotation: this.rotation});
    //   // const viewport: PDFPageViewport = page.getViewport({scale: this.scale, rotation: this.rotation});
    //   this.canvas.height = viewport.height;
    //   this.canvas.width = viewport.width;
    //
    //   // Render PDF page into canvas context
    //   const renderContext: PDFRenderParams = {
    //     viewport,
    //     canvasContext: this.ctx,
    //   };
    //
    //   // Render page method
    //   const renderTask: PDFRenderTask = page.render(renderContext);
    //
    //   // Wait for rendering to finish
    //   renderTask.promise.then(() => {
    //     this.isPageRendering = false;
    //     this.pageRendered.emit(this.pageNum);
    //
    //     if (this.pageNumPending !== null) {
    //       this.renderPage(this.pageNumPending); // New page rendering is pending
    //       this.pageChange.emit(this.pageNumPending); // emit
    //       this.pageNumPending = null;
    //     }
    //   });
    // });
  }

  // private queueRenderPage(pageNumber: number): void {
  //   if (this.isPageRendering) {
  //     this.pageNumPending = pageNumber;
  //   } else {
  //     this.renderPage(pageNumber);
  //   }
  // }

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
      // verbosity: VerbosityLevel.INFOS,
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
        {this.loadProgress < 100 ? (
          <div class="load-progress">
            <div class="bar" style={{width: `${this.loadProgress}%`}}>
              &nbsp;
            </div>
          </div>
        ) : (
          <div style={{display: 'none'}} />
        )}
        <div id="verdocs-pdf-viewer-container" />
      </div>
    );
  }
}
