import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IDocumentFieldSettings, IRecipient} from '@verdocs/js-sdk/Documents/Types';

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
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * The recipient completing the form, if known.
   */
  @Prop() recipient?: IRecipient;

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
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    return (
      <Host class={{required: settings.required}}>
        <label>
          <input
            type="checkbox"
            tabIndex={settings.order}
            checked={settings.value}
            disabled={settings.disabled}
            required={settings.required}
            onChange={e => this.handleChange(e)}
          />
          <span />
        </label>
      </Host>
    );
  }
}
