import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IDocumentFieldSettings} from '@verdocs/js-sdk/Documents/Types';
import {Component, Event, EventEmitter, h, Host, Method, Prop, State} from '@stencil/core';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-dropdown',
  styleUrl: 'verdocs-field-dropdown.scss',
  shadow: false,
})
export class VerdocsFieldDropdown {
  private el: HTMLSelectElement;

  /**
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

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

  render() {
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    return (
      <Host class={{focused: this.focused, required: settings.required}}>
        <select
          tabIndex={settings.order}
          disabled={settings.disabled}
          ref={el => (this.el = el)}
          onChange={e => this.handleChange(e)}
          onBlur={() => this.handleBlur()}
          onFocus={() => this.handleFocus()}
        >
          <option value="">Select...</option>
          {(settings.options || []).map(option => (
            <option value={option.id} selected={option.value === settings.value}>
              {option.value}
            </option>
          ))}
        </select>
      </Host>
    );
  }
}
