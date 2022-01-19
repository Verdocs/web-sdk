import {Component, h, Host, Prop, Event, EventEmitter, Method} from '@stencil/core';

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
   * Whether the field is required.
   */
  @Prop() required: boolean = false;

  /**
   * The user's full name.
   */
  @Prop() fullName: string = '';

  /**
   * The base64 signature value.
   */
  @Prop() value: string = '';

  /**
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image.
   */
  @Event({composed: true}) adopt: EventEmitter<string>;

  /**
   * Event emitted when the user cancels the process.
   */
  @Event({composed: true}) cancel: EventEmitter;

  @Method() async focusField() {
    this.handleShow();
  }

  private dialog?: any;

  handleShow() {
    this.dialog = document.createElement('verdocs-signature-dialog');
    this.dialog.open = true;
    this.dialog.fullName = this.fullName;
    this.dialog.addEventListener('cancel', () => {
      console.log('cancel');
      this.dialog?.remove();
    });
    document.addEventListener('adopt', e => {
      console.log('adopt', e);
      this.dialog?.remove();
    });
    document.body.append(this.dialog);
  }

  render() {
    return (
      <Host class={{required: this.required}}>
        {this.value !== '' ? (
          <img src={this.value} alt="Signature" />
        ) : (
          <button class={{}} onClick={() => this.handleShow()}>
            Signature
          </button>
        )}
      </Host>
    );
  }
}
