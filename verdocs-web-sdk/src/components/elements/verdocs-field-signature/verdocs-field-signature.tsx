import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import {IDocumentFieldSettings} from '@verdocs/js-sdk/Documents/Types';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Event, EventEmitter, Method, State} from '@stencil/core';

/**
 * Displays a signature field. If a signature already exists, it will be displayed and the field will be disabled. Otherwise, a placeholder
 * button will be shown. Clicking the button will show a dialog to adopt a signature.
 */
@Component({
  tag: 'verdocs-field-signature',
  styleUrl: 'verdocs-field-signature.scss',
  shadow: false,
})
export class VerdocsFieldSignature {
  /**
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * If set, the signature creation dialog will be initialized with this text.
   */
  @Prop() name?: string = '';

  /**
   * If set, the signature creation dialog will be initialized from this object.
   */
  @Prop() recipient?: IRecipient;

  /**
   * Event emitted when the field has changed.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  @Method() async focusField() {
    this.handleShow();
    console.log('focused', this);
  }

  @State()
  tempSignature: string = '';

  private dialog?: any;

  hideDialog() {
    this.dialog?.remove();
    this.dialog = null;
  }

  handleAdopt(e: any) {
    console.log('[SIGNATURE] Adopted signature');
    this.tempSignature = e.detail;
    this.hideDialog();
  }

  handleShow() {
    this.dialog = document.createElement('verdocs-signature-dialog');
    this.dialog.open = true;
    this.dialog.fullName = this.recipient?.full_name || this.name;
    this.dialog.addEventListener('cancel', () => this.hideDialog());
    this.dialog.addEventListener('adopt', e => this.handleAdopt(e));
    document.body.append(this.dialog);
  }

  render() {
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    const value = this.tempSignature || settings.base64;
    return (
      <Host class={{required: this.field?.required}}>
        {value ? (
          <img src={this.tempSignature || settings.base64} alt="Signature" />
        ) : (
          <button class={{}} onClick={() => this.handleShow()}>
            Signature
          </button>
        )}
      </Host>
    );
  }
}
