import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';

/**
 * Displays a radio button.
 */
@Component({
  tag: 'verdocs-field-radio-button',
  styleUrl: 'verdocs-field-radio-button.scss',
  shadow: false,
})
export class VerdocsFieldRadioButton {
  /**
   * Sets the tabIndex of the input element.
   */
  @Prop() order: number = 1;

  /**
   * Sets the value of the input element.
   */
  @Prop() checked: boolean = false;

  /**
   * Sets the value of the input element.
   */
  @Prop() value: string = '';

  /**
   * Sets the name of the input element.
   */
  @Prop() name: string = '';

  /**
   * If true, the field will be marked required.
   */
  @Prop() required: boolean = false;

  /**
   * Sets the disabled attribute of the input element.
   */
  @Prop() disabled: boolean = false;

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  handleChange(e: any) {
    console.log('changed', e);
    this.fieldChange.emit(e.target.checked);
  }

  render() {
    return (
      <Host class={{required: this.required, storybook: !!window?.['STORYBOOK_ENV']}}>
        <input
          type="radio"
          tabIndex={this.order}
          value={this.value}
          name={this.name}
          id={`${this.name}=${this.value}`}
          checked={this.checked}
          disabled={this.disabled}
          required={this.required}
          onChange={e => this.handleChange(e)}
        />
        <label htmlFor={`${this.name}=${this.value}`} />
      </Host>
    );
  }
}
