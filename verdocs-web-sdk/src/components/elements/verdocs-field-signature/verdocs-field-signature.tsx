import {IFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Documents';
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
   * Sets the field source.
   */
  @Prop() field: IDocumentField;

  /**
   * Sets the recipient (signer).
   */
  @Prop() recipient: IRecipient;

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
  private settings: IFieldSetting = {x: 0, y: 0};
  private fullName: string = '';

  componentWillLoad() {
    if (this.field?.settings) {
      this.settings = this.field.settings;
    }

    if (this.recipient?.full_name) {
      this.fullName = this.recipient.full_name;
    }

    console.log({settings: this.settings, fullName: this.fullName});
  }

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
    this.dialog.fullName = this.fullName;
    this.dialog.addEventListener('cancel', () => this.hideDialog());
    this.dialog.addEventListener('adopt', e => this.handleAdopt(e));
    document.body.append(this.dialog);
  }

  render() {
    const {required, base64 = ''} = this.settings;

    return (
      <Host class={{required}}>
        {this.tempSignature !== '' || base64 !== '' ? (
          <img src={this.tempSignature || base64} alt="Signature" />
        ) : (
          <button class={{}} onClick={() => this.handleShow()}>
            Signature
          </button>
        )}
      </Host>
    );
  }
}
