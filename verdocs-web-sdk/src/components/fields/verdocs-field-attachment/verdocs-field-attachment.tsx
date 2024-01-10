import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Method, Event, EventEmitter, State, Fragment} from '@stencil/core';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getFieldSettings} from '../../../utils/utils';

const PaperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>`;

const AttachedIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104.69 122.88"><g><path d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M66.57,108.66c-1.36-1.08-1.59-3.06-0.5-4.42 c1.08-1.36,3.06-1.59,4.42-0.5l9.57,7.59l18.21-22.27c1.1-1.35,3.09-1.54,4.43-0.44c1.35,1.1,1.54,3.09,0.44,4.43l-20.17,24.67l0,0 c-1.09,1.33-3.04,1.54-4.39,0.47L66.57,108.66L66.57,108.66z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15 H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M31.54,64.59c-1.74,0-3.15-1.41-3.15-3.15 c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,64.59z"/></g></svg>`;

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m7.5 18.5-.312-2.667q-.188-.125-.396-.25-.209-.125-.396-.229l-2.479 1.063-2.521-4.334 2.125-1.625q.021-.104.021-.229v-.458q0-.125-.021-.229L1.396 7.917l2.521-4.313 2.5 1.042q.166-.104.375-.229.208-.125.396-.229L7.5 1.5h5l.312 2.688q.188.104.396.229.209.125.396.229l2.479-1.042 2.521 4.313-2.125 1.625v.916l2.125 1.625-2.521 4.334-2.5-1.063q-.166.104-.375.229-.208.125-.396.25L12.5 18.5Zm2.479-5.521q1.229 0 2.104-.875T12.958 10q0-1.229-.875-2.104t-2.104-.875q-1.208 0-2.094.875Q7 8.771 7 10t.885 2.104q.886.875 2.094.875Zm0-1.75q-.5 0-.864-.364Q8.75 10.5 8.75 10t.365-.865q.364-.364.864-.364t.865.364q.364.365.364.865t-.364.865q-.365.364-.865.364ZM10.021 10Zm-.792 6.521h1.542l.25-2.146q.625-.167 1.198-.51.573-.344 1.031-.823l2.021.854.771-1.271-1.771-1.354q.104-.292.156-.615.052-.323.052-.656 0-.292-.052-.604-.052-.313-.135-.646l1.77-1.375-.77-1.271-2.021.875q-.479-.5-1.042-.833-.562-.334-1.187-.5l-.271-2.167H9.208l-.25 2.167q-.625.166-1.187.5-.563.333-1.042.812l-2-.854-.771 1.271 1.73 1.354q-.084.333-.136.656Q5.5 9.708 5.5 10t.052.604q.052.313.136.667l-1.73 1.354.771 1.271 2-.834q.479.459 1.042.792.562.334 1.187.5Z"/></svg>';

/**
 * Displays an attachment field.
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
   * The name of the field to display.
   */
  @Prop() fieldname: string = '';

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
   * If set, the field will be be scaled horizontally by this factor.
   */
  @Prop() xscale?: number = 1;

  /**
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop() yscale?: number = 1;

  /**
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) attached: EventEmitter<{data: string; lastModified: number; name: string; size: number; type: string}>;

  @State() showingProperties?: boolean = false;

  @Method() async focusField() {
    this.handleShow();
  }

  private dialog?: any;

  handleShow() {
    this.dialog = document.createElement('verdocs-upload-dialog');
    this.dialog.open = true;
    this.dialog.addEventListener('exit', () => this.dialog?.remove());
    document.addEventListener('next', (e: any) => {
      console.log('Attachment next', e);
      this.attached?.emit(e.detail[0]);
      this.dialog?.remove();
    });
    document.body.append(this.dialog);
  }

  @Method()
  async showSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.fieldname}`) as any;
    if (settingsPanel && settingsPanel.showPanel) {
      settingsPanel.showPanel();
    }
  }

  @Method()
  async hideSettingsPanel() {
    const settingsPanel = document.getElementById(`verdocs-settings-panel-${this.fieldname}`) as any;
    if (settingsPanel && settingsPanel.hidePanel) {
      settingsPanel.hidePanel();
    }
  }

  fieldStore: TTemplateFieldStore = null;

  async componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
  }

  render() {
    const field = this.fieldStore.get(this.fieldname);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    let disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = field['rgba'] || getRGBA(this.roleindex);
    const {url} = settings;

    console.log('Attachment settings', url, settings);

    return (
      <Host class={{required: settings.required, disabled}} style={{backgroundColor}}>
        <span innerHTML={url ? AttachedIcon : PaperclipIcon} onClick={() => !disabled && this.handleShow()} />

        {this.editable && (
          <Fragment>
            <div
              id={`verdocs-settings-panel-trigger-${field.name}`}
              style={{transform: `scale(${Math.floor((1 / this.xscale) * 1000) / 1000}, ${Math.floor((1 / this.yscale) * 1000) / 1000})`}}
              class="settings-icon"
              innerHTML={settingsIcon}
              onClick={(e: any) => {
                e.stopPropagation();
                this.showingProperties = !this.showingProperties;
              }}
            />

            {this.showingProperties && (
              <verdocs-portal anchor={`verdocs-settings-panel-trigger-${field.name}`} onClickAway={() => (this.showingProperties = false)}>
                <verdocs-template-field-properties
                  templateId={this.templateid}
                  fieldName={field.name}
                  onClose={() => (this.showingProperties = false)}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: field.name});
                    return this.hideSettingsPanel();
                  }}
                  onSettingsChanged={e => {
                    this.settingsChanged?.emit(e.detail);
                    return this.hideSettingsPanel();
                  }}
                  helpText={'Attachments allow the user to attach their own documents (e.g. resumes or disclosures) to a signing flow.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
