import {createPopper, Instance} from '@popperjs/core';
import {Component, h, Host, Method, Prop} from '@stencil/core';

/**
 * Displays a clickable icon suitable for display in a toolbar. When clicked, a customizable drop-down panel will be
 * displayed.
 *
 * *
 * ```html
 * <verdocs-button-panel icon="<svg.../>">
 *   <form>...</form>
 * </verdocs-button-panel>
 * ```
 */
@Component({
  tag: 'verdocs-button-panel',
  styleUrl: 'verdocs-button-panel.scss',
  shadow: false,
})
export class VerdocsButtonPanel {
  iconEl: HTMLDivElement;
  panelEl: HTMLDivElement;
  hiderEl?: HTMLDivElement;
  popperInstance: Instance;

  /**
   * SVG icon to display
   */
  @Prop() icon: string = '';

  componentDidRender() {
    document.body.appendChild(this.panelEl);
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }

    this.popperInstance = createPopper(this.iconEl, this.panelEl, {
      // placement: 'top-end',
      // modifiers: [{name: 'offset', options: {offset: [0, 10]}}],
    });
  }

  disconnectedCallback() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    if (this.panelEl) {
      this.panelEl.remove();
    }
  }

  // Not marked as @State because it's not the thing that controls our rendering
  showing = false;

  @Method()
  async showPanel() {
    if (!this.showing) {
      await this.toggle();
    }
  }

  @Method()
  async hidePanel() {
    if (this.showing) {
      await this.toggle();
    }
  }

  @Method()
  async toggle() {
    if (this.showing) {
      this.panelEl?.removeAttribute('data-show');
      this.hiderEl?.remove();
      this.showing = false;
    } else {
      this.panelEl?.setAttribute('data-show', '');
      this.popperInstance?.update().catch(() => {});
      this.showing = true;

      this.hiderEl = document.createElement('div');
      this.hiderEl.style.zIndex = '100';
      this.hiderEl.style.position = 'absolute';
      this.hiderEl.style.top = '0px';
      this.hiderEl.style.left = '0px';
      this.hiderEl.style.right = '0px';
      this.hiderEl.style.bottom = '0px';
      this.hiderEl.onclick = (e: any) => {
        e.stopPropagation();
        this.toggle();
      };
      document.body.appendChild(this.hiderEl);
    }
  }

  render() {
    return (
      <Host>
        <div
          class="icon"
          innerHTML={this.icon}
          onClick={(e: any) => {
            e.stopPropagation();
            return this.toggle();
          }}
          ref={el => (this.iconEl = el)}
        />
        <div role="tooltip" class="verdocs-button-panel-content" data-popper-placement="bottom" ref={el => (this.panelEl = el as HTMLDivElement)}>
          <div data-popper-arrow="true" class="arrow" />
          <slot />
        </div>
      </Host>
    );
  }
}
