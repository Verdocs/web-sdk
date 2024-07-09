import {Component, h, Host, Prop} from '@stencil/core';

/**
 * Displays a radio button. Note that this is different from the `verdocs-field-radio-button` component, which is
 * designed to be used in signing experiences and contains settings that connect to template fields. This is just a
 * simple radio button for UI displays e.g. dialog boxes.
 *
 * This control encapsulates a standard HTML radio button. To subscribe to change events, connect an `onChange`
 * handler. Sample usage:
 *
 * ```ts
 * <verdocs-radio-button
 *    value="val1"
 *    name="someProperty"
 *    checked={this.someProperty === 'val1'}
 *    onInput={(e: any) => { this.someProperty = 'val1' }}
 *    disabled={false}
 * />
 * ```
 */
@Component({
  tag: 'verdocs-radio-button',
  styleUrl: 'verdocs-radio-button.scss',
  shadow: false,
})
export class VerdocsRadioButton {
  /**
   * Whether the radio button is currently selected.
   */
  @Prop() checked: boolean = false;

  /**
   * HTML form field name for the input.
   */
  @Prop() name: string = '';

  /**
   * Value to track with the input.
   */
  @Prop() value: string = '';

  /**
   * If set, the button will still be displayed but not selectable.
   */
  @Prop() disabled?: boolean = false;

  render() {
    return (
      <Host class={{disabled: this.disabled}}>
        <input
          type="radio"
          value={this.value}
          name={this.name}
          id={`verdocs-radio-button-${this.name}-${this.value}`}
          checked={this.checked}
          disabled={this.disabled}
          // onChange={e => this.handleChange(e)}
        />
        <label htmlFor={`verdocs-radio-button-${this.name}-${this.value}`} />
      </Host>
    );
  }
}
