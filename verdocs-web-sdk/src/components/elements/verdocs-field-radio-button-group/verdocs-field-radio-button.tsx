import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {Component, h, Host, Prop} from '@stencil/core';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
import {getFieldSettings} from '../../../utils/utils';

const RadioIconUnselected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

const RadioIconSelected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

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
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop() done?: boolean = false;

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

    if (this.done) {
      return (
        <Host class={{done: this.done}} style={{maxWidth: '10px'}}>
          <span innerHTML={!!option.selected ? RadioIconSelected : RadioIconUnselected} />
        </Host>
      );
    }

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
