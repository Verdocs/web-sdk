// @ts-ignore
import {Datepicker} from 'vanillajs-datepicker';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IDocumentFieldSettings, IRecipient} from '@verdocs/js-sdk/Documents/Types';
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
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * The recipient completing the form, if known.
   */
  @Prop() recipient?: IRecipient;

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
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    return (
      <Host class={{focused: this.focused, required: settings.required, storybook: !!window?.['STORYBOOK_ENV']}}>
        <input
          type="text"
          value=""
          placeholder={settings.placeholder}
          required={settings.required}
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
