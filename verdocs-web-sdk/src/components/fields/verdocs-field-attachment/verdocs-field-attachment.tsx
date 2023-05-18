import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import { Component, h, Host, Prop, Method, Event, EventEmitter } from '@stencil/core';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IEnvelopeField, IEnvelopeFieldSettings} from '@verdocs/js-sdk/Envelopes/Types';

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
   * The template the field is for/from. Only required in Builder mode, to support the Field Properties dialog.
   */
  @Prop() templateid: string = '';

  /**
   * The document or template field to display.
   */
  @Prop() field: IEnvelopeField | ITemplateField | null = null;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleIndex?: number = 0;

  /**
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting}>;

  @Method() async focusField() {
    this.handleShow();
  }

  private dialog?: any;

  handleShow() {
    this.dialog = document.createElement('verdocs-upload-dialog');
    this.dialog.open = true;
    this.dialog.addEventListener('exit', () => this.dialog?.remove());
    document.addEventListener('done', () => this.dialog?.remove());
    document.body.append(this.dialog);
  }

  @Method()
  async showSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.field.name}`) as any;
    if (settingsPanel && settingsPanel.showPanel) {
      settingsPanel.showPanel();
    }
  }

  @Method()
  async hideSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.field.name}`) as any;
    if (settingsPanel && settingsPanel.hidePanel) {
      settingsPanel.hidePanel();
    }
    // TemplateStore.updateCount++;
  }

  render() {
    let settings: IEnvelopeFieldSettings | ITemplateFieldSetting = {x: 0, y: 0};
    if ('settings' in this.field && this.field?.settings) {
      settings = this.field.settings;
    } else if ('setting' in this.field && this.field?.setting) {
      settings = this.field.setting;
    }

    const disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = this.field['rgba'] || getRGBA(this.roleIndex);

    return (
      <Host class={{required: settings.required, disabled}} style={{backgroundColor}}>
        <span innerHTML={PaperclipIcon} onClick={() => !disabled && this.handleShow()} />
      </Host>
    );
  }
}
