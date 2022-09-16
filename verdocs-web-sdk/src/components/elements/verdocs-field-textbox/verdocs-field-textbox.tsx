import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import {Component, h, Host, Prop, Event, EventEmitter, State, Method} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';

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
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * The recipient completing the form, if known.
   */
  @Prop() recipient?: IRecipient;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

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
    const settings = getFieldSettings(this.field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{focused: this.focused, required: this.field?.required, disabled}}>
        <input
          type="text"
          placeholder={settings?.placeholder}
          tabIndex={settings?.order}
          value={settings?.result}
          disabled={disabled}
          required={this.field?.required}
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
