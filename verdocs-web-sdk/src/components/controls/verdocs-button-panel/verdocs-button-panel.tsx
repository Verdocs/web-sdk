import {createPopper, Instance} from '@popperjs/core';
import {Component, h, Host, Method, Prop} from '@stencil/core';

/**
 * Display an icon button that triggers a drop-down panel that can display
 * arbitrary child content, such as metadata, forms, or other controls.
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
    this.panelEl?.setAttribute('data-show', '');
    this.popperInstance?.update().catch(() => {});
    this.showing = true;

    this.hiderEl = document.createElement('div');
    this.hiderEl.id = 'verdocs-button-panel-hider';
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

  @Method()
  async hidePanel() {
    Array.from(document.getElementsByClassName('verdocs-button-panel-content')).forEach(el => {
      el.removeAttribute('data-show');
    });
    document.getElementById('verdocs-button-panel-hider')?.remove();
    this.showing = false;
  }

  @Method()
  async toggle() {
    if (this.showing) {
      await this.hidePanel();
    } else {
      await this.showPanel();
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
