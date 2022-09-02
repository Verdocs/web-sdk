import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';
import {IDocumentField, IDocumentFieldSettings} from '@verdocs/js-sdk/Documents/Types';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';

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
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

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
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    return (
      <Host class={{required: settings.required, storybook: !!window?.['STORYBOOK_ENV']}}>
        <input
          type="radio"
          tabIndex={settings.order}
          value={settings.value}
          name={settings.name}
          id={`${settings.name}=${settings.value}`}
          checked={settings.checked}
          disabled={settings.disabled}
          required={settings.required}
          onChange={e => this.handleChange(e)}
        />
        <label htmlFor={`${settings.name}=${settings.value}`} />
      </Host>
    );
  }
}
