import {createPopper, Instance} from '@popperjs/core';
import {Component, h, Host, Prop, State} from '@stencil/core';

const helpIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M11.925 18q.55 0 .938-.387.387-.388.387-.938 0-.55-.387-.925-.388-.375-.938-.375-.55 0-.925.375t-.375.925q0 .55.375.938.375.387.925.387Zm-.95-3.85h1.95q0-.8.2-1.287.2-.488 1.025-1.288.65-.625 1.025-1.213.375-.587.375-1.437 0-1.425-1.025-2.175Q13.5 6 12.1 6q-1.425 0-2.35.775t-1.275 1.85l1.775.7q.125-.45.55-.975.425-.525 1.275-.525.725 0 1.1.412.375.413.375.888 0 .475-.287.9-.288.425-.713.775-1.075.95-1.325 1.475-.25.525-.25 1.875ZM12 22.2q-2.125 0-3.988-.8-1.862-.8-3.237-2.175Q3.4 17.85 2.6 15.988 1.8 14.125 1.8 12t.8-3.988q.8-1.862 2.175-3.237Q6.15 3.4 8.012 2.6 9.875 1.8 12 1.8t3.988.8q1.862.8 3.237 2.175Q20.6 6.15 21.4 8.012q.8 1.863.8 3.988t-.8 3.988q-.8 1.862-2.175 3.237Q17.85 20.6 15.988 21.4q-1.863.8-3.988.8Zm0-2.275q3.325 0 5.625-2.3t2.3-5.625q0-3.325-2.3-5.625T12 4.075q-3.325 0-5.625 2.3T4.075 12q0 3.325 2.3 5.625t5.625 2.3ZM12 12Z"/></svg>';

/**
 * Displays a simple help icon. Upon hover or focus, a tooltip will be displayed with help text.
 */
@Component({
  tag: 'verdocs-help-icon',
  styleUrl: 'verdocs-help-icon.scss',
  shadow: false,
})
export class VerdocsHelpIcon {
  icon: HTMLDivElement;
  tooltip: HTMLDivElement;
  popperInstance: Instance;

  /**
   * Help text to display on hover/focus
   */
  @Prop() text: string = '';

  @State() containerId = `verdocs-help-icon-${Math.random().toString(36).substring(2, 11)}`;

  componentDidLoad() {
    console.log('icon', this.icon);
    console.log('tooltip', this.tooltip);
    this.popperInstance = createPopper(this.icon, this.tooltip, {
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

  render() {
    return (
      <Host class={{}}>
        <div
          aria-describedby={this.containerId}
          class="icon"
          innerHTML={helpIcon}
          onMouseEnter={() => this.show()}
          onFocus={() => this.show()}
          onMouseLeave={() => this.hide()}
          onBlur={() => this.hide()}
          ref={el => (this.icon = el as HTMLDivElement)}
        />
        <div
          id={this.containerId}
          role="tooltip"
          class="tooltip"
          // style="display: none; visibility: visible; margin: 0px; position: absolute; inset: 0px auto auto 0px; transform: translate(951px, 5510px);"
          data-popper-placement="bottom"
          ref={el => (this.tooltip = el as HTMLDivElement)}
        >
          {this.text}
          <div data-popper-arrow="true" class="arrow" />
        </div>
      </Host>
    );
  }
}
