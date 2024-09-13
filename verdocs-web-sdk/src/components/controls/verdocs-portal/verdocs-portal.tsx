import {Component, EventEmitter, h, Host, Listen, Prop, Event} from '@stencil/core';

const Z_INDEX = '10001';

/**
 * Display a child component in a "portal", popping it out of the main DOM tree
 * to allow it to escape the bounds set by its parent.
 * @credit https://github.com/tomas-teston/stencil-portal for the basic
 * technique. This has been altered in a few ways to make it more friendly
 * to cases where there may be multiple portals on the page and provide more
 * alignment options for the child to be displayed.
 *
 * ```ts
 * <div style="padding: 40px">
 *     <div id="sample-tooltip" style="border: 1px solid green; padding: 3px 10px;">
 *       Tooltip Anchor
 *       <verdocs-portal anchor="sample-tooltip" .align=${align} .voffset=${voffset}>
 *         <div style="border: 1px solid red; padding: 3px 10px;">Tooltip</div>
 *       </verdocs-portal>
 *     </div>
 *   </div>
 * ```
 */
@Component({
  tag: 'verdocs-portal',
  styleUrl: 'verdocs-portal.scss',
  shadow: false,
})
export class VerdocsPortal {
  private portal: HTMLElement;
  private element: HTMLElement;
  private moved: boolean = false;

  /**
   * Unique ID of the parent element to anchor to.
   */
  @Prop() anchor: string;

  /**
   * Vertical offset from the parent.
   */
  @Prop() voffset: number = 0;

  @Event() clickAway: EventEmitter<void>;

  @Listen('scroll', {target: 'window', capture: true})
  handleScroll() {
    this.calculatePosition();
  }

  @Listen('resize', {target: 'window'})
  handleResize() {
    this.calculatePosition();
  }

  @Listen('click', {target: 'document'})
  handleClick(e) {
    if (!this.element.contains(e.target)) {
      this.clickAway?.emit();
    }
  }

  private calculateLeft() {
    const anchorEl = document.getElementById(this.anchor);
    if (!anchorEl) return 0;

    const anchorRect = anchorEl.getBoundingClientRect();

    const rightOfViewportWithScroll = document.documentElement.clientWidth + document.documentElement.scrollLeft;
    const leftOfPopup = Math.max(anchorRect.left, 0);
    // Old centering logic, disabled temporarily
    //    Math.max(anchorRect.left - this.portal.offsetWidth / 2 + anchorRect.width / 2, 0);
    // Old right-align logic, disabled temporarily
    //    Math.max(anchorRect.left + anchorRect.width - this.portal.offsetWidth, 0);
    const popupWidth = this.element?.offsetWidth || 400;
    const offRightEdge = leftOfPopup + popupWidth > rightOfViewportWithScroll;

    return offRightEdge ? leftOfPopup + anchorRect.width - popupWidth : leftOfPopup;
  }

  private calculateTop() {
    const anchorEl = document.getElementById(this.anchor);
    if (!anchorEl) return 0;

    const anchorRect = anchorEl.getBoundingClientRect();

    const bottomOfViewportWithScroll = document.documentElement.clientHeight + document.documentElement.scrollTop;
    const topOfPopup = anchorRect.bottom + this.voffset + document.documentElement.scrollTop;
    const popupHeight = this.element?.offsetHeight || 300;
    const offBottomEdge = topOfPopup + popupHeight > bottomOfViewportWithScroll;

    return offBottomEdge ? topOfPopup - popupHeight - anchorRect.height : topOfPopup;
  }

  private calculatePosition() {
    this.portal.style.top = `${this.calculateTop()}px`;
    this.portal.style.left = `${this.calculateLeft()}px`;
  }

  componentWillLoad() {
    const id = `${this.anchor}-portal`;
    document.getElementById(id)?.remove();

    this.portal = document.createElement('div');
    this.portal.setAttribute('id', id);
    this.portal.style.zIndex = Z_INDEX;
    this.portal.style.position = 'absolute';
    document.body.append(this.portal);
  }

  componentDidLoad() {
    this.portal.appendChild(this.element);
    this.calculatePosition();
  }

  disconnectedCallback() {
    this.moved ? this.portal.remove() : (this.moved = true);
  }

  render() {
    return (
      <Host ref={el => (this.element = el)}>
        <slot />
      </Host>
    );
  }
}
