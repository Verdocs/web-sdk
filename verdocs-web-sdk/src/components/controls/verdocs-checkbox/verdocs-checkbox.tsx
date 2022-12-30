import {Component, h, Host, Prop} from '@stencil/core';

/**
 * Displays a check box. Note that this is different from the `verdocs-field-checkbox` component, which is designed
 * to be used in signing experiences and contains settings that connect to template fields. This is just a simple check
 * box for UI displays e.g. dialog boxes.
 *
 * This control encapsulates a standard HTML checkbox. To subscribe to change events, connect an `onChange`
 * handler. Sample usage:
 *
 * ```html
 * <verdocs-checkbox
 *    value="on"
 *    name="thingEnabled"
 *    checked={this.thingEnabled}
 *    onInput={(e: any) => (this.thingEnabled = e.target.checked)}
 * />
 * ```
 */
@Component({
  tag: 'verdocs-checkbox',
  styleUrl: 'verdocs-checkbox.scss',
  shadow: false,
})
export class VerdocsCheckbox {
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
        <input type="checkbox" value={this.value} name={this.name} checked={this.checked} disabled={this.disabled} id={`verdocs-checkbox-${this.name}-${this.value}`} />
      </Host>
    );
  }
}
