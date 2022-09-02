import {Component, Event, EventEmitter, h, Host, Method, Prop} from '@stencil/core';
import {IDocumentField, IDocumentFieldSettings} from '@verdocs/js-sdk/Documents/Types';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';

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

  @Method() async focusField() {
    this.handleShow();
  }

  private dialog?: any;

  handleShow() {
    this.dialog = document.createElement('verdocs-initial-dialog');
    this.dialog.open = true;
    this.dialog.initials = this.initials;
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
    let settings: IDocumentFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    return (
      <Host class={{required: settings.required}}>
        {settings.value !== '' ? (
          <img src={settings.value} alt="Initials" />
        ) : (
          <button class={{}} onClick={() => this.handleShow()}>
            Initial
          </button>
        )}
      </Host>
    );
  }
}
