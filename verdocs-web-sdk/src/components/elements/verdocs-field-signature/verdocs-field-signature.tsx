import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import {Component, h, Host, Prop, Event, EventEmitter, Method, State} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';

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
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

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
    this.fieldChange?.emit(this.tempSignature);
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
    const settings = getFieldSettings(this.field);
    const value = this.tempSignature || settings.base64;
    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: this.field?.required, disabled}}>
        {value ? <img src={this.tempSignature || settings.base64} alt="Signature" /> : <button onClick={() => !disabled && this.handleShow()}>Signature</button>}
      </Host>
    );
  }
}
