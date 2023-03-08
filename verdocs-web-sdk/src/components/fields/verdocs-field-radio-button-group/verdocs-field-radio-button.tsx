import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {Component, Event, EventEmitter, h, Host, Method, Prop} from '@stencil/core';
import {ITemplateField} from '@verdocs/js-sdk/Templates/Types';
import {IDocumentField} from '@verdocs/js-sdk/Envelopes/Types';
import {getFieldSettings} from '../../../utils/utils';
import TemplateStore from '../../../utils/templateStore';

const RadioIconUnselected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

const RadioIconSelected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m7.5 18.5-.312-2.667q-.188-.125-.396-.25-.209-.125-.396-.229l-2.479 1.063-2.521-4.334 2.125-1.625q.021-.104.021-.229v-.458q0-.125-.021-.229L1.396 7.917l2.521-4.313 2.5 1.042q.166-.104.375-.229.208-.125.396-.229L7.5 1.5h5l.312 2.688q.188.104.396.229.209.125.396.229l2.479-1.042 2.521 4.313-2.125 1.625v.916l2.125 1.625-2.521 4.334-2.5-1.063q-.166.104-.375.229-.208.125-.396.25L12.5 18.5Zm2.479-5.521q1.229 0 2.104-.875T12.958 10q0-1.229-.875-2.104t-2.104-.875q-1.208 0-2.094.875Q7 8.771 7 10t.885 2.104q.886.875 2.094.875Zm0-1.75q-.5 0-.864-.364Q8.75 10.5 8.75 10t.365-.865q.364-.364.864-.364t.865.364q.364.365.364.865t-.364.865q-.365.364-.865.364ZM10.021 10Zm-.792 6.521h1.542l.25-2.146q.625-.167 1.198-.51.573-.344 1.031-.823l2.021.854.771-1.271-1.771-1.354q.104-.292.156-.615.052-.323.052-.656 0-.292-.052-.604-.052-.313-.135-.646l1.77-1.375-.77-1.271-2.021.875q-.479-.5-1.042-.833-.562-.334-1.187-.5l-.271-2.167H9.208l-.25 2.167q-.625.166-1.187.5-.563.333-1.042.812l-2-.854-.771 1.271 1.73 1.354q-.084.333-.136.656Q5.5 9.708 5.5 10t.052.604q.052.313.136.667l-1.73 1.354.771 1.271 2-.834q.479.459 1.042.792.562.334 1.187.5Z"/></svg>';

/**
 * Displays a radio button.
 */
@Component({
  tag: 'verdocs-field-radio-button',
  styleUrl: 'verdocs-field-radio-button.scss',
  shadow: false,
})
export class VerdocsFieldRadioButton {
  /**
   * The document or template field to display.
   */
  @Prop() field: IDocumentField | ITemplateField | null = null;

  /**
   * The index of the settings option this particular checkbox is for
   */
  @Prop() option: number = 0;

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop() disabled?: boolean = false;

  /**
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop() done?: boolean = false;

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  /**
   * If set, a settings icon will be displayed on hover. The settings shown allow the field's recipient and other settings to be
   * changed, so it should typically only be enabled in the Builder.
   */
  @Prop() editable?: boolean = false;

  /**
   * If set, the field may be dragged to a new location. This should only be enabled in the Builder, or for self-placed fields.
   */
  @Prop() moveable?: boolean = false;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

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
    TemplateStore.updateCount++;
  }

  render() {
    const settings = getFieldSettings(this.field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = this.field['rgba'] || getRGBA(this.roleindex);
    const required = this.field.required;
    const option = settings.options[this.option];
    const id = `${this.field.name}-${option.id}`;

    if (this.done) {
      return (
        <Host class={{done: this.done}} style={{maxWidth: '10px'}}>
          <span innerHTML={!!option.selected ? RadioIconSelected : RadioIconUnselected} />
        </Host>
      );
    }

    return (
      <Host class={{required, disabled}} style={{backgroundColor}}>
        <input
          id={id}
          type="radio"
          value={option.id}
          tabIndex={settings.order}
          name={this.field.name}
          checked={!!option.selected}
          disabled={disabled}
          required={settings.required}
        />
        <label htmlFor={id} />
        {this.editable && (
          <verdocs-button-panel icon={settingsIcon} id={`verdocs-settings-panel-${this.field.name}`}>
            <verdocs-template-field-properties
              templateId={TemplateStore.templateId}
              fieldName={this.field.name}
              onClose={() => this.hideSettingsPanel()}
              onDelete={() => {
                this.deleted?.emit({fieldName: this.field.name});
                return this.hideSettingsPanel();
              }}
              onSettingsChanged={e => {
                this.settingsChanged?.emit(e.detail);
                return this.hideSettingsPanel();
              }}
            />
          </verdocs-button-panel>
        )}
      </Host>
    );
  }
}
