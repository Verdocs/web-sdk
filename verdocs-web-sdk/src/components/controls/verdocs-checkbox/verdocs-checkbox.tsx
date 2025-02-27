import {Component, h, Host, Prop} from '@stencil/core';

/**
 * Displays a check box. Note that this is different from the `verdocs-field-checkbox` component, which is designed
 * to be used in signing experiences and contains settings that connect to template fields. This is just a simple check
 * box for UI displays e.g. dialog boxes.
 *
 * This control encapsulates a standard HTML checkbox. To subscribe to change events, connect an `onChange`
 * handler. Sample usage:
 *
 * ```ts
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
   * Label to display. Leave blank for no label. The label will be displayed to the right of the checkbox, but may be
   * repositioned with CSS.
   */
  @Prop() label: string = '';

  /**
   * Value to track with the input. Value is not used internally by this component but is sometimes useful to set
   * because it can be retrieved in event handlers via e.target.value. This can be used to identify which
   * checkbox was clicked in a checkbox group.
   */
  @Prop() value: string = '';

  /**
   * Style of checkbox to render. Use 'dark' when rendering on a dark background.
   */
  @Prop() theme: 'light' | 'dark' = 'light';

  /**
   * Size of checkbox to render.
   */
  @Prop() size: 'normal' | 'small' = 'normal';

  /**
   * If set, the button will still be displayed but not selectable.
   */
  @Prop() disabled?: boolean = false;

  render() {
    return (
      <Host class={{disabled: this.disabled, [this.theme]: true, [this.size]: true}}>
        <label>
          <input type="checkbox" value={this.value} name={this.name} checked={this.checked} disabled={this.disabled} />
          <span>{this.label}</span>
        </label>
      </Host>
    );
  }
}
