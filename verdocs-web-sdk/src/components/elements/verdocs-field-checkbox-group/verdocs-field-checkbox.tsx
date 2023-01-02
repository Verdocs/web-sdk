import {Component, h, Host, Prop} from '@stencil/core';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';
import {getFieldSettings} from '../../../utils/utils';

/**
 * Displays a checkbox.
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

  render() {
    const settings = getFieldSettings(this.field);
    const option = settings.options?.[this.option] ?? {checked: false};

    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: settings.required, disabled}}>
        <label>
          <input type="checkbox" tabIndex={settings.order} checked={option.checked} disabled={disabled} required={settings.required} />
          <span />
        </label>
      </Host>
    );
  }
}
