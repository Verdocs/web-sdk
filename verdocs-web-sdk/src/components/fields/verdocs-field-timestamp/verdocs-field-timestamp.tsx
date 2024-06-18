import {format} from 'date-fns';
import {ITemplateField, ITemplateFieldSetting, getRGBA} from '@verdocs/js-sdk';
import {Component, h, Host, Prop, Method, Event, EventEmitter, Fragment, State} from '@stencil/core';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getFieldSettings} from '../../../utils/utils';
import {FORMAT_TIMESTAMP} from '../../../utils/Types';
import {SettingsIcon} from '../../../utils/Icons';

/**
 * Display a timestamp field.
 */
@Component({
  tag: 'verdocs-field-timestamp',
  styleUrl: 'verdocs-field-timestamp.scss',
  shadow: false,
})
export class VerdocsFieldTimestamp {
  private el: HTMLInputElement;

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
   * If set, the field will be be scaled horizontally by this factor.
   */
  @Prop() xscale?: number = 1;

  /**
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop() yscale?: number = 1;

  /**
   * The page the field is on
   */
  @Prop() pagenumber?: number = 1;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;

  @Method() async focusField() {
    this.el.focus();
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
  roleStore: TTemplateRoleStore = null;

  async componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
    this.roleStore = getTemplateRoleStore(this.templateid);
  }

  render() {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    const roleIndex = getRoleIndex(this.roleStore, field.role_name);
    const backgroundColor = field['rgba'] || getRGBA(roleIndex);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    // TODO:
    // const disabled = this.disabled ?? settings.disabled ?? false;
    const disabled = this.disabled ?? false;
    const value = settings.value || new Date().toISOString();

    const dt = new Date(value);
    const formatted = format(dt, FORMAT_TIMESTAMP);

    if (this.done) {
      return <Host class={{done: this.done}}>{formatted}</Host>;
    }

    return (
      <Host class={{required: field?.required, disabled}} style={{backgroundColor}}>
        <input
          type="text"
          placeholder={field.placeholder ?? ''}
          // TODO: It would really make more sense to show the date and time but the default width of 64px for this field
          // is encoded in a ton of existing entries in the database and is hard to change.
          value={formatted}
          disabled={true}
          ref={el => (this.el = el)}
        />

        {this.editable && (
          <Fragment>
            <div
              id={`verdocs-settings-panel-trigger-${field.name}`}
              style={{transform: `scale(${Math.floor((1 / this.xscale) * 1000) / 1000}, ${Math.floor((1 / this.yscale) * 1000) / 1000})`}}
              class="settings-icon"
              innerHTML={SettingsIcon}
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
                  helpText={'Time stamps are automatically set when the recipient signs the document.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
