import {createPopper, Instance} from '@popperjs/core';
import {Component, h, Host, Prop, State} from '@stencil/core';
// import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';

/**
 * Displays a simple help icon. Upon hover or focus, a tooltip will be displayed with help text.
 */
@Component({
  tag: 'verdocs-toolbar-icon',
  styleUrl: 'verdocs-toolbar-icon.scss',
  shadow: false,
})
export class VerdocsToolbarIcon {
  iconEl: HTMLDivElement;
  tooltip: HTMLDivElement;
  popperInstance: Instance;

  /**
   * Help text to display on hover/focus
   */
  @Prop() text: string = '';

  /**
   * SVG icon to display
   */
  @Prop() icon: string = '';

  /**
   * Triggered when the icon is pressed
   */
  // @Event({composed: true}) press: EventEmitter;

  @State() containerId = `verdocs-toolbar-icon-${Math.random().toString(36).substring(2, 11)}`;

  componentDidLoad() {
    this.popperInstance = createPopper(this.iconEl, this.tooltip, {
      // placement: 'top-end',
      // modifiers: [{name: 'offset', options: {offset: [0, 10]}}],
    });
  }

  disconnectedCallback() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  show() {
    this.tooltip?.setAttribute('data-show', '');
    this.popperInstance?.update().catch(() => {});
  }

  hide() {
    this.tooltip?.removeAttribute('data-show');
  }

  // handlePress() {
  //   this.press?.emit();
  // }

  render() {
    return (
      <Host class={{}}>
        <div
          aria-describedby={this.containerId}
          class="icon"
          innerHTML={this.icon}
          onMouseEnter={() => this.show()}
          onFocus={() => this.show()}
          onMouseLeave={() => this.hide()}
          onBlur={() => this.hide()}
          ref={el => (this.iconEl = el as HTMLDivElement)}
        />
        <div id={this.containerId} role="tooltip" class="tooltip" data-popper-placement="bottom" ref={el => (this.tooltip = el as HTMLDivElement)}>
          {this.text}
          <div data-popper-arrow="true" class="arrow" />
        </div>
      </Host>
    );
  }
}
