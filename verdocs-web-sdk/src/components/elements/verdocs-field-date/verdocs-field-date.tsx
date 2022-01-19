// @ts-ignore
import {Datepicker} from 'vanillajs-datepicker';
import {Component, Event, EventEmitter, h, Host, Method, Prop, State} from '@stencil/core';

/**
 * Displays a date field. When tapped or clicked, the input element will display a date picker component.
 */
@Component({
  tag: 'verdocs-field-date',
  styleUrl: 'verdocs-field-date.scss',
  shadow: false,
})
export class VerdocsFieldDate {
  private el: HTMLInputElement;

  /**
   * A placeholder to assist the user in completing the field.
   */
  @Prop() placeholder: string = 'Select Date';

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

  componentDidLoad() {
    new Datepicker(this.el, {
      autohide: true,
      todayHighlight: true,
    });

    this.el.addEventListener('changeDate', (e: any) => {
      console.log('changeDate', e.detail.date.toISOString());
    });
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

  // NOTE: We don't use a "date" field here because browsers vary widely in their formatting of it.
  render() {
    return (
      <Host class={{focused: this.focused, required: this.required, storybook: !!window?.['STORYBOOK_ENV']}}>
        <input
          type="text"
          value=""
          placeholder={this.placeholder}
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
