// NOTE: This component does not have a story because it's not intended for external use.

import {Component, h, Host, Prop, Event, EventEmitter, State, Element} from '@stencil/core';
import {IDocumentPageInfo, IPageLayer} from '../../../utils/Types';

/**
 * Represents one document page. This is primarily a layout container used to coordinate positions of
 * page-related layers such as the page itself, signature fields, etc. It is not intended to be used
 * on its own as an individual component.
 */
@Component({
  tag: 'verdocs-document-page',
  styleUrl: 'verdocs-document-page.scss',
  shadow: false,
})
export class VerdocsDocumentPage {
  @Element() container: HTMLElement;
  private resizeObserver: ResizeObserver;

  /**
   * The URL of the image to render as the page background.
   */
  @Prop() pageImageUri: string = '';

  /**
   * The page number being rendered. Not used internally, but included in callbacks/events beacuse page numbers
   * are used everywhere in document handling. (Reminder: page numbers are 1-based.)
   */
  @Prop() pageNumber: number = 1;

  /**
   * The "virtual" width of the page canvas. Defaults to 612 which at 72dpi is 8.5" wide. This is used to compute
   * the aspect ratio of the final rendered element when scaling up/down.
   */
  @Prop() virtualWidth: number = 612;

  /**
   * The "virtual" height of the page canvas.  Defaults to 792 which at 72dpi is 11" tall. This is used to compute
   * the aspect ratio of the final rendered element when scaling up/down.
   */
  @Prop() virtualHeight: number = 792;

  /**
   * The layers that will be rendered. The DOM structure will be a DIV container with one child DIV for each layer.
   * The parent DIV will have a unique ID, and each child DIV will have that ID with the layer name appended, e.g.
   * if `pages` was ['page', 'fields'] the structure will be:
   *
   * ```
   *     <div id="verdocs-document-page-ker2fr1p9">
   *       <div id="verdocs-document-page-ker2fr1p9-page"></div>
   *       <div id="verdocs-document-page-ker2fr1p9-fields"></div>
   *     </div>
   * ```
   */
  @Prop() layers: IPageLayer[] = [{name: 'page', type: 'canvas'}];

  /**
   * Fired when a page has been rendered. This is also fired when the page is resized.
   */
  @Event() pageRendered: EventEmitter<IDocumentPageInfo>;

  @State() containerId = `verdocs-document-page-${Math.random().toString(36).substring(2, 11)}`;

  @State() renderedWidth: number = this.virtualWidth;
  @State() renderedHeight: number = this.virtualHeight;
  @State() naturalWidth: number = this.virtualWidth;
  @State() naturalHeight: number = this.virtualHeight;
  @State() aspectRatio: number = this.virtualWidth / this.virtualHeight;

  @State() skipFirstNotification = true;

  componentDidLoad(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const renderedWidth = entry.contentRect.width;
        this.renderedWidth = renderedWidth;
        this.renderedHeight = this.virtualHeight * (renderedWidth / this.virtualWidth);
      }

      this.notifyRenderedSize();
    });

    this.resizeObserver.observe(this.container);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
  }

  // Left here for documentation purposes in case we find an edge case where this isn't true. But we apparently don't need this.
  // When we add the resize observer it will always be triggered at least once so notifying here as well is just a dupe.
  // componentDidRender() {
  //   this.notifyRenderedSize();
  // }

  notifyRenderedSize() {
    // We skip one notification because by default we will always get at least two, one when rendering the initial size
    // and a second once we're able to compute the scale size, when the resizeObserver sets renderedWidth/renderedHeight.
    if (this.skipFirstNotification) {
      this.skipFirstNotification = false;
      return;
    }

    console.log('Notyfing new size');
    this.pageRendered.emit({
      container: this.container,
      containerId: this.containerId,
      pageNumber: this.pageNumber,
      virtualWidth: this.virtualWidth,
      virtualHeight: this.virtualHeight,
      renderedWidth: this.renderedWidth,
      renderedHeight: this.renderedHeight,
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
      xScale: this.renderedWidth / this.naturalWidth,
      yScale: this.renderedHeight / this.naturalHeight,
    });
  }

  render() {
    const height = `${this.renderedHeight}px`;

    return (
      <Host id={`${this.containerId}`} style={{height}}>
        {this.layers.map(layer =>
          layer.type === 'div' ? (
            <div class="verdocs-document-page-layer" id={`${this.containerId}-${layer.name}`} style={{height}} />
          ) : (
            <img
              class="verdocs-document-page-layer img"
              id={`${this.containerId}-${layer.name}`}
              src={this.pageImageUri}
              alt={`Page ${this.pageNumber}`}
              aria-hidden={true}
              onLoad={(e: any) => {
                this.naturalWidth = e.target.naturalWidth;
                this.naturalHeight = e.target.naturalHeight;
                this.aspectRatio = this.naturalWidth / this.naturalHeight;
              }}
            />
          ),
        )}
      </Host>
    );
  }
}
