// NOTE: This component does not have a story because it's not intended for external use.

import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Host, Prop, Event, EventEmitter, State, Element} from '@stencil/core';
import {getTemplateDocumentPageDisplayUri} from '@verdocs/js-sdk/Templates/TemplateDocuments';
import {IDocumentPageInfo, IPageLayer} from '../../../utils/Types';
import {throttle} from '../../../utils/utils';

/**
 * Represents one document page. This is primarily a layout container used to coordinate positions of
 * page-related layers such as the page itself, signature fields, etc. It is not intended to be used
 * on its own as an individual component.
 */
@Component({
  tag: 'verdocs-template-document-page',
  styleUrl: 'verdocs-template-document-page.scss',
  shadow: false,
})
export class VerdocsTemplateDocumentPage {
  @Element() container: HTMLElement;
  private resizeObserver: ResizeObserver;

  /**
   * The endpoint to load from.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template the document is for.
   */
  @Prop() templateId: string = '';

  /**
   * The ID of the document to display.
   */
  @Prop() documentId: string = '';

  /**
   * The page number being rendered. (Reminder: page numbers are 1-based.)
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
  @Prop({mutable: true}) virtualHeight: number = 792;

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

  @State() pageDisplayUri = '';

  async componentWillLoad() {
    const uri = await getTemplateDocumentPageDisplayUri(this.endpoint, this.templateId, this.documentId, this.pageNumber);
    console.log('pd', uri);
    this.pageDisplayUri = uri;
  }

  componentDidLoad() {
    this.resizeObserver = new ResizeObserver(
      throttle(entries => {
        for (const entry of entries) {
          const renderedWidth = entry.contentRect.width;
          this.renderedWidth = renderedWidth;
          this.renderedHeight = this.virtualHeight * (renderedWidth / this.virtualWidth);
        }

        this.notifyRenderedSize();
      }, 100),
    );

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

    this.pageRendered.emit({
      // container: this.container,
      containerId: this.containerId,
      pageNumber: this.pageNumber,
      virtualWidth: this.virtualWidth,
      virtualHeight: this.virtualHeight,
      renderedWidth: this.renderedWidth,
      renderedHeight: this.renderedHeight,
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight,
      aspectRatio: this.aspectRatio,
      xScale: this.renderedWidth / this.virtualWidth,
      yScale: this.renderedHeight / this.virtualHeight,
    });
  }

  render() {
    const height = `${this.renderedHeight}px`;

    return (
      <Host id={`${this.containerId}`} style={{height}}>
        {this.layers.map(layer =>
          layer.type === 'div' ? (
            <div class="verdocs-template-document-page-layer" id={`${this.containerId}-${layer.name}`} style={{height}} />
          ) : this.pageDisplayUri ? (
            <img
              class="verdocs-template-document-page-layer img"
              id={`${this.containerId}-${layer.name}`}
              src={this.pageDisplayUri}
              alt={`Page ${this.pageNumber}`}
              aria-hidden={true}
              onLoad={(e: any) => {
                // Note that all we really care about is the aspect ratio. We track the natural Width and Height but they aren't really that
                // useful as individual values. The image will already have been scaled down to fit a DIV for display (100%, auto height).
                // Builder places fields offset into the rendered display area, not the original document's dimensions. So its X/Y values
                // for a field are based on the responsive Web view the Template editor was seeing. The IMG was scaled down there in the
                // exact same way, so we just honor it. We capture the natural width and height here more as information. Then we use the
                // aspect ratio to adjust the "virtual" height in case the page is not 8.5"x11".
                // TODO: Store this in the DB with each page.
                this.naturalWidth = e.target.naturalWidth;
                this.naturalHeight = e.target.naturalHeight;
                this.aspectRatio = this.naturalWidth / this.naturalHeight;
                this.virtualHeight = this.virtualWidth / this.aspectRatio;
              }}
            />
          ) : (
            <div></div>
          ),
        )}
      </Host>
    );
  }
}
