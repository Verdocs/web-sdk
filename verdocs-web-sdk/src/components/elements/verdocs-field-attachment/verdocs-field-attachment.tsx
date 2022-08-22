import {IDocumentField} from '@verdocs/js-sdk/Documents/Documents';
import {Component, h, Host, Prop, Event, EventEmitter, Method} from '@stencil/core';
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
   * Sets the field source.
   */
  @Prop() field: IDocumentField;

  /**
   * Sets the tabIndex of the input element.
   */
  @Prop() order: number = 1;

  /**
   * Sets the value of the input element.
   */
  @Prop() value: string = '';

  /**
   * If true, the field will be marked required.
   */
  @Prop() required: boolean = false;

  /**
   * Sets the disabled attribute of the input element.
   */
  @Prop() disabled: boolean = false;

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
    this.dialog.addEventListener('cancel', () => {
      console.log('cancel');
      this.dialog?.remove();
    });
    document.addEventListener('done', e => {
      console.log('done', e);
      this.dialog?.remove();
    });
    document.body.append(this.dialog);
  }

  render() {
    return (
      <Host class={{required: this.required}}>
        <span innerHTML={Paperclip} onClick={() => this.handleShow()} />
      </Host>
    );
  }
}
