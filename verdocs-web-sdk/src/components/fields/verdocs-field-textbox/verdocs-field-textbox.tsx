import interact from 'interactjs';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {IEnvelopeField} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, h, Host, Element, Prop, Method, Event, EventEmitter} from '@stencil/core';
import {getFieldSettings} from '../../../utils/utils';
import {updateField} from '@verdocs/js-sdk/Templates/Fields';
import {VerdocsEndpoint} from '@verdocs/js-sdk';

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m7.5 18.5-.312-2.667q-.188-.125-.396-.25-.209-.125-.396-.229l-2.479 1.063-2.521-4.334 2.125-1.625q.021-.104.021-.229v-.458q0-.125-.021-.229L1.396 7.917l2.521-4.313 2.5 1.042q.166-.104.375-.229.208-.125.396-.229L7.5 1.5h5l.312 2.688q.188.104.396.229.209.125.396.229l2.479-1.042 2.521 4.313-2.125 1.625v.916l2.125 1.625-2.521 4.334-2.5-1.063q-.166.104-.375.229-.208.125-.396.25L12.5 18.5Zm2.479-5.521q1.229 0 2.104-.875T12.958 10q0-1.229-.875-2.104t-2.104-.875q-1.208 0-2.094.875Q7 8.771 7 10t.885 2.104q.886.875 2.094.875Zm0-1.75q-.5 0-.864-.364Q8.75 10.5 8.75 10t.365-.865q.364-.364.864-.364t.865.364q.364.365.364.865t-.364.865q-.365.364-.865.364ZM10.021 10Zm-.792 6.521h1.542l.25-2.146q.625-.167 1.198-.51.573-.344 1.031-.823l2.021.854.771-1.271-1.771-1.354q.104-.292.156-.615.052-.323.052-.656 0-.292-.052-.604-.052-.313-.135-.646l1.77-1.375-.77-1.271-2.021.875q-.479-.5-1.042-.833-.562-.334-1.187-.5l-.271-2.167H9.208l-.25 2.167q-.625.166-1.187.5-.563.333-1.042.812l-2-.854-.771 1.271 1.73 1.354q-.084.333-.136.656Q5.5 9.708 5.5 10t.052.604q.052.313.136.667l-1.73 1.354.771 1.271 2-.834q.479.459 1.042.792.562.334 1.187.5Z"/></svg>';

/**
 * Display a text input field.
 */
@Component({
  tag: 'verdocs-field-textbox',
  styleUrl: 'verdocs-field-textbox.scss',
  shadow: false,
})
export class VerdocsFieldTextbox {
  @Element() el: HTMLElement;
  private inputEl: HTMLInputElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   * This component self-manages its resize (width) behavior when in edit-template mode, and uses
   * this endpoint to save changes.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

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
   * If set, a settings icon will be displayed on hover. The settings shown allow the field's recipient and other settings to be
   * changed, so it should typically only be enabled in the Builder.
   */
  @Prop() editable?: boolean = false;

  /**
   * If set, the field may be dragged to a new location. This should only be enabled in the Builder, or for self-placed fields.
   */
  @Prop() moveable?: boolean = false;

  /**
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop() done?: boolean = false;

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  /**
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @Method()
  async focusField() {
    this.inputEl.focus();
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

  componentDidRender() {
    interact.dynamicDrop(true);

    if (this.editable) {
      interact(this.el).resizable({
        edges: {top: false, bottom: false, left: true, right: true},
        listeners: {
          start: this.handleResizeStart.bind(this),
          move: this.handleResize.bind(this),
          end: this.handleResizeEnd.bind(this),
        },
      });
    }
  }

  handleResizeStart(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleResize(e) {
    console.log('resize', e);
    const oldX = +(e.target.getAttribute('resizeX') || 0);
    const oldY = +(e.target.getAttribute('resizeY') || 0);
    const newX = e.dx + oldX;
    const newY = e.dy + oldY;
    this.el.style.width = `${parseFloat(this.el.style.width || '0') + e.dx}px`;
    // Single line text fields are not resizeable in height
    // this.el.style.height = `${parseFloat(this.el.style.height || '0') + event.dy}px`;
    e.target.setAttribute('resizeX', newX);
    e.target.setAttribute('resizeY', newY);
  }

  handleResizeEnd(e) {
    console.log('resizeEnd', e);
    const resizeWidth = +(e.target.getAttribute('resizeX') || 0);

    const settings = getFieldSettings(this.field);
    const newWidth = (settings.width || 150) + resizeWidth;

    const newSettings = {...getFieldSettings(this.field), width: Math.round(newWidth)};
    delete newSettings['result'];

    updateField(this.endpoint, this.templateid, this.field.name, {setting: newSettings})
      .then(() => this.settingsChanged?.emit({fieldName: this.field.name, settings: newSettings}))
      .catch(e => console.log('Field update failed', e));
  }

  render() {
    const settings = getFieldSettings(this.field);
    let disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = this.field['rgba'] || getRGBA(this.roleindex);
    const value = settings?.result || '';
    const width = settings.width || 150;
    // TODO: This is an antiquated technique from the old system. We should compute it.
    const maxlength = width / 5;

    if (this.done) {
      return <Host class={{done: this.done}}>{value}</Host>;
    }

    return (
      <Host class={{required: this.field?.required, disabled, done: this.done}} style={{backgroundColor}}>
        <input
          type="text"
          name={this.field.name}
          placeholder={settings?.placeholder}
          tabIndex={settings?.order}
          value={value}
          disabled={disabled}
          required={this.field?.required}
          ref={el => (this.inputEl = el)}
          maxlength={maxlength}
        />
        {this.editable && (
          <verdocs-button-panel icon={settingsIcon} id={`verdocs-settings-panel-${this.field.name}`}>
            <verdocs-template-field-properties
              templateId={this.templateid}
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
              helpText={
                'Text boxes may be used to capture simple text input. Participant-entered values will be stored for later retrieval via the "name" field.<br /><br />If marked required, the participant must complete the field before proceeding.'
              }
            />
          </verdocs-button-panel>
        )}
      </Host>
    );
  }
}
