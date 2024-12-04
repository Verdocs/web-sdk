import {Component, EventEmitter, h, Host, Listen, Prop, Event} from '@stencil/core';

/**
 * Display a menu panel in a left or right sidebar. The panel will animate (slide)
 * as it appears, and an background will be shown over the rest of the page. If
 * the background overlay is present, it can be clicked to dismiss the panel.
 *
 * ```ts
 * <verdocs-menu-panel>
 *   <div style="padding: 20px;">Menu Panel</div>
 * </verdocs-menu-panel>
 * ```
 */
@Component({
  tag: 'verdocs-menu-panel',
  styleUrl: 'verdocs-menu-panel.scss',
  shadow: false,
})
export class VerdocsMenuPanel {
  private portal: HTMLElement;
  private element: HTMLElement;
  private moved: boolean = false;
  private overlayId = `verdocs-menu-panel-overlay`;
  private panelId = `verdocs-menu-panel`;

  /**
   * Which side of the screen to place the panel.
   */
  @Prop() side: 'left' | 'right' = 'right';

  /**
   * Whether to show an overlay over the rest of the page.
   */
  @Prop() overlay = true;

  /**
   * The width of the panel.
   */
  @Prop() width = 300;

  @Event() close: EventEmitter<void>;

  @Listen('click', {target: 'document'})
  handleClick(e: any) {
    if (!this.element.contains(e.target)) {
      this.hide();
      this.close?.emit();
    }
  }

  componentWillLoad() {
    this.hide();

    if (this.overlay) {
      this.portal = document.createElement('div');
      this.portal.setAttribute('id', this.overlayId);
      document.body.append(this.portal);
    }

    this.portal = document.createElement('div');
    this.portal.setAttribute('id', this.panelId);
    this.portal.style.top = `0px`;
    this.portal.style.bottom = `0px`;
    this.portal.style.width = `${this.width}px`;

    if (this.side === 'left') {
      this.portal.style.left = `0px`;
    } else {
      this.portal.style.right = `0px`;
    }

    document.body.append(this.portal);
  }

  componentDidLoad() {
    this.portal.appendChild(this.element);
  }

  disconnectedCallback() {
    this.moved ? this.portal.remove() : (this.moved = true);
  }

  hide() {
    document.getElementById(this.overlayId)?.remove();
    document.getElementById(this.panelId)?.remove();
  }

  render() {
    return (
      <Host ref={el => (this.element = el)}>
        <slot />
      </Host>
    );
  }
}
