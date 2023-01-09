import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {Component, h, Host, Prop} from '@stencil/core';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
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
   * The index of the settings option this particular checkbox is for
   */
  @Prop() option: number = 0;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  render() {
    const settings = getFieldSettings(this.field);
    const option = settings.options?.[this.option] ?? {checked: false};
    const disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = this.field['rgba'] || getRGBA(this.roleindex);

    return (
      <Host class={{required: settings.required, disabled}} style={{backgroundColor}}>
        <label>
          <input type="checkbox" tabIndex={settings.order} checked={option.checked} disabled={disabled} required={settings.required} value={option.id} />
          <span />
        </label>
      </Host>
    );
  }
}
