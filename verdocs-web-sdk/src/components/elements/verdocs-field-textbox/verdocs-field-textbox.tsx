import {Component, h, Host, Prop, Event, EventEmitter, State, Method} from '@stencil/core';

/**
 * Display a text input field.
 */
@Component({
  tag: 'verdocs-field-textbox',
  styleUrl: 'verdocs-field-textbox.scss',
  shadow: false,
})
export class VerdocsFieldTextbox {
  private el: HTMLInputElement;

  /**
   * A placeholder to assist the user in completing the field.
   */
  @Prop() placeholder: string = '';

  /**
   * Sets the tabIndex of the input element.
   */
  @Prop() order: number = 1;

  /**
   * Sets the value of the input element.
   */
  @Prop() value: string = '';

  /**
   * If true, the field will be marked required.
   */
  @Prop() required: boolean = false;

  /**
   * Sets the disabled attribute of the input element.
   */
  @Prop() disabled: boolean = false;

  /**
   * Event fired when the input field loses focus.
   */
  @Event({composed: true}) fieldFocus: EventEmitter<boolean>;

  /**
   * Event fired when the input field gains focus.
   */
  @Event({composed: true}) fieldBlur: EventEmitter<boolean>;

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  /**
   * Event fired on every character entered into / deleted from the field.
   */
  @Event({composed: true}) fieldInput: EventEmitter<string>;

  @State() focused = false;

  @Method() async focusField() {
    this.focused = true;
    this.el.focus();
    this.fieldFocus.emit(true);
  }

  handleBlur() {
    this.focused = false;
    this.fieldBlur.emit(true);
  }

  handleFocus() {
    this.focused = true;
    this.fieldFocus.emit(true);
  }

  handleChange(e: any) {
    this.fieldChange.emit(e.target.value);
  }

  handleInput(e: any) {
    this.fieldInput.emit(e.target.value);
  }

  render() {
    return (
      <Host class={{focused: this.focused, required: this.required}}>
        <input
          type="text"
          placeholder={this.placeholder || ''}
          tabIndex={this.order}
          value={this.value}
          disabled={this.disabled}
          required={this.required}
          ref={el => (this.el = el)}
          onBlur={() => this.handleBlur()}
          onFocus={() => this.handleFocus()}
          onChange={e => this.handleChange(e)}
          onInput={e => this.handleInput(e)}
        />
      </Host>
    );
  }
}
