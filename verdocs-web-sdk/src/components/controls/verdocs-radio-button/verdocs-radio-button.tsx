import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';

/**
 * Displays a radio button. Note that this is different from the `verdocs-field-radio-button` component, which is designed
 * to be used in signing experiences and contains settings that connect to template fields. This is just a simple radio
 * button for UI displays e.g. dialogs and .
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

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) select: EventEmitter<{value: string}>;

  handleChange(e: any) {
    console.log('changed', e.target.checked);
    this.select.emit({value: this.value});
  }

  render() {
    return (
      <Host class={{disabled: this.disabled}}>
        <input
          type="radio"
          value={this.value}
          name={this.name}
          id={`${this.name}=${this.value}`}
          checked={this.checked}
          disabled={this.disabled}
          onChange={e => this.handleChange(e)}
        />
        <label htmlFor={`${this.name}=${this.value}`} />
      </Host>
    );
  }
}
