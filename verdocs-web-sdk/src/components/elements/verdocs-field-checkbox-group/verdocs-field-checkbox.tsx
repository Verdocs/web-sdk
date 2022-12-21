import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, h, Host, Prop, Event, EventEmitter} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';

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
    this.fieldChange.emit({option: this.option, value: e.target.checked});
  }

  render() {
    const settings = getFieldSettings(this.field);
    const option = settings.options?.[this.option] ?? {checked: false};

    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: settings.required, disabled}}>
        <label>
          <input type="checkbox" tabIndex={settings.order} checked={option.checked} disabled={disabled} required={settings.required} onChange={e => this.handleChange(e)} />
          <span />
        </label>
      </Host>
    );
  }
}
