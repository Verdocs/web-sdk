import {Component, h, Host, Prop, Event, EventEmitter, Method} from '@stencil/core';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IDocumentFieldSettings, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import Paperclip from './paperclip.svg';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-attachment',
  styleUrl: 'verdocs-field-attachment.scss',
  shadow: false,
})
export class VerdocsFieldAttachment {
  /**
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * The recipient completing the form, if known.
   */
  @Prop() recipient?: IRecipient;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  @Method() async focusField() {
    this.handleShow();
  }

  private dialog?: any;

  handleShow() {
    this.dialog = document.createElement('verdocs-upload-dialog');
    this.dialog.open = true;
    this.dialog.addEventListener('cancel', () => this.dialog?.remove());
    document.addEventListener('done', () => this.dialog?.remove());
    document.body.append(this.dialog);
  }

  render() {
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: settings.required, disabled}}>
        <span innerHTML={Paperclip} onClick={() => !disabled && this.handleShow()} />
      </Host>
    );
  }
}
