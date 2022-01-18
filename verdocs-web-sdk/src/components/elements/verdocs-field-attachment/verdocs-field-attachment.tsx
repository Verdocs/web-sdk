import {Component, h, Host, Prop, Event, EventEmitter, State} from '@stencil/core';
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

  @State() showDialog = false;

  handleShow() {
    this.showDialog = true;
  }

  handleCancel() {
    this.showDialog = false;
  }

  handleDone(e) {
    console.log('done', e.detail);
  }

  render() {
    return (
      <Host class={{required: this.required, storybook: !!window?.['STORYBOOK_ENV']}}>
        <span innerHTML={Paperclip} onClick={() => this.handleShow()} />
        <verdocs-upload-dialog open={this.showDialog} onCancel={() => this.handleCancel()} onDone={e => this.handleDone(e)} />
      </Host>
    );
  }
}
