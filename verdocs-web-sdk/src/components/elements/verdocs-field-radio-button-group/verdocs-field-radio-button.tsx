import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';

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
   * The recipient completing the form, if known.
   */
  @Prop() recipient?: IRecipient;

  /**
   * The index of the settings option this particular checkbox is for
   */
  @Prop() option: number = 0;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<{option: number; value: boolean}>;

  handleChange(e: any) {
    console.log('changed', e);
    this.fieldChange.emit({option: this.option, value: e.target.checked});
  }

  render() {
    const settings = getFieldSettings(this.field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: settings.required, disabled}}>
        <input
          type="radio"
          tabIndex={settings.order}
          value={settings.value}
          name={settings.name}
          id={`${settings.name}=${settings.value}`}
          checked={settings.checked}
          disabled={disabled}
          required={settings.required}
          onChange={e => this.handleChange(e)}
        />
        <label htmlFor={`${settings.name}=${settings.value}`} />
      </Host>
    );
  }
}
