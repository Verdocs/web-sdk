import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-checkbox',
  styleUrl: 'verdocs-field-checkbox.scss',
  shadow: false,
})
export class VerdocsFieldCheckbox {
  /**
   * Sets the tabIndex of the input element.
   */
  @Prop() order: number = 1;

  /**
   * Sets the value of the input element.
   */
  @Prop() value: boolean = false;

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
    this.fieldChange.emit(e.target.checked);
  }

  render() {
    return (
      <Host class={{required: this.required}}>
        <label>
          <input type="checkbox" tabIndex={this.order} checked={this.value} disabled={this.disabled} required={this.required} onChange={e => this.handleChange(e)} />
          <span />
        </label>
      </Host>
    );
  }
}
