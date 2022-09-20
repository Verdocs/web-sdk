import {Component, Prop, h, State, Event, EventEmitter, Host} from '@stencil/core';

/**
 * Displays a single button that can be toggled on or off by clicking it.
 */
@Component({
  tag: 'verdocs-toggle-button',
  styleUrl: 'verdocs-toggle-button.scss',
})
export class VerdocsToggleButton {
  @Prop() active = false;

  /**
   * If set, should be an SVG object. This will be rendered as the button's visible element. If icon is supplied, label is ignored.
   */
  @Prop() icon?: string | null = null;

  /**
   * If set, should be an SVG object. This will be rendered as the button's visible element. If icon is supplied, label is ignored.
   */
  @Prop() label?: string | null = null;

  /**
   * How large the button should be. Small buttons are intended for dialog boxes and other smaller scale UI regions.
   */
  @Prop() size?: 'small' | 'normal' = 'normal';

  /**
   * Event fired when the button is pressed.
   */
  @Event({composed: true}) toggle!: EventEmitter<{active: boolean}>;

  @State() _active = false;

  componentWillLoad() {
    this._active = this.active;
  }

  handleToggle() {
    const newState = !this._active;
    this._active = newState;
    this.toggle?.emit({active: newState});
  }

  render() {
    return (
      <Host class={`size-${this.size}`}>
        {this.icon ? (
          <button innerHTML={this.icon} class={{active: this._active}} onClick={() => this.handleToggle()} />
        ) : (
          <button class={{active: this._active}} onClick={() => this.handleToggle()}>
            {this.label}
          </button>
        )}
      </Host>
    );
  }
}
