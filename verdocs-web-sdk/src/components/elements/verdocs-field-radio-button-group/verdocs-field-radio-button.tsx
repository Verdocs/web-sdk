import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {Component, h, Host, Prop} from '@stencil/core';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
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
    const disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = this.field['rgba'] || getRGBA(this.roleindex);
    const option = settings.options[this.option];

    const id = `${this.field.name}-${option.id}`;
    return (
      <Host class={{required: settings.required, disabled}} style={{backgroundColor}}>
        <input
          id={id}
          type="radio"
          value={option.id}
          tabIndex={settings.order}
          name={this.field.name}
          checked={!!option.selected}
          disabled={disabled}
          required={settings.required}
        />
        <label htmlFor={id} />
      </Host>
    );
  }
}
