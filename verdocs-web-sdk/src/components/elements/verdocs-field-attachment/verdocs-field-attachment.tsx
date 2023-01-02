import {Component, h, Host, Prop, Method} from '@stencil/core';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IDocumentFieldSettings, IRecipient} from '@verdocs/js-sdk/Envelopes/Types';

const PaperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>`;

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
        <span innerHTML={PaperclipIcon} onClick={() => !disabled && this.handleShow()} />
      </Host>
    );
  }
}
