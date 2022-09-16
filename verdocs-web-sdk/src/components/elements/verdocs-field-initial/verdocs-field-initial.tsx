import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField, IRecipient} from '@verdocs/js-sdk/Documents/Types';
import {Component, Event, EventEmitter, h, Host, Method, Prop, State} from '@stencil/core';
import {fullNameToInitials, getFieldSettings} from '../../../utils/utils';

/**
 * Displays an initial field. If an initial already exists, it will be displayed and the field will be disabled. Otherwise, a placeholder
 * button will be shown. Clicking the button will show a dialog to adopt an initial.
 */
@Component({
  tag: 'verdocs-field-initial',
  styleUrl: 'verdocs-field-initial.scss',
  shadow: false,
})
export class VerdocsFieldInitial {
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
   * The document or template field to display.
   */
  @Prop() initials: string = '';

  /**
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image.
   */
  @Event({composed: true}) adopt: EventEmitter<string>;

  /**
   * Event emitted when the user cancels the process.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  @Method() async focusField() {
    this.handleShow();
  }

  @State()
  tempInitials: string = '';

  private dialog?: any;

  hideDialog() {
    this.dialog?.remove();
    this.dialog = null;
  }

  handleAdopt(e: any) {
    console.log('[INITIAL] Adopted initials');
    this.tempInitials = e.detail;
    this.fieldChange?.emit(this.tempInitials);
    this.hideDialog();
  }

  handleShow() {
    this.dialog = document.createElement('verdocs-initial-dialog');
    this.dialog.open = true;
    this.dialog.initials = this.recipient ? fullNameToInitials(this.recipient.full_name) : this.initials;
    this.dialog.addEventListener('cancel', () => this.hideDialog());
    this.dialog.addEventListener('adopt', e => this.handleAdopt(e));
    document.body.append(this.dialog);
  }

  render() {
    const settings = getFieldSettings(this.field);
    const value = this.tempInitials || settings.base64;
    const disabled = this.disabled ?? settings.disabled ?? false;
    return (
      <Host class={{required: settings.required, disabled}}>
        {value ? (
          <img src={this.tempInitials || settings.base64} alt="Initials" />
        ) : (
          <button class={{}} onClick={() => !disabled && this.handleShow()}>
            Initials
          </button>
        )}
      </Host>
    );
  }
}
