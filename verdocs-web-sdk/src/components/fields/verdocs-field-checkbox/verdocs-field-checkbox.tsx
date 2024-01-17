import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, Event, EventEmitter, Fragment, h, Host, Method, Prop, State} from '@stencil/core';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getFieldSettings} from '../../../utils/utils';
import {SettingsIcon} from '../../../utils/Icons';

/**
 * Displays a checkbox.
 */
@Component({
  tag: 'verdocs-field-checkbox',
  styleUrl: 'verdocs-field-checkbox.scss',
  shadow: false,
})
export class VerdocsFieldCheckbox {
  /**
   * The template the field is for/from. Only required in Builder mode, to support the Field Properties dialog.
   */
  @Prop() templateid: string = '';

  /**
   * The name of the field to display.
   */
  @Prop() fieldname: string = '';

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
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  /**
   * If set, the field will be be scaled horizontally by this factor.
   */
  @Prop() xscale?: number = 1;

  /**
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop() yscale?: number = 1;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;

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
    console.log('cwl checkbox', this.templateid, this.fieldStore);
  }

  render() {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    const option = settings.options?.[this.option] ?? {checked: false};
    const disabled = this.disabled ?? settings.disabled ?? false;
    const backgroundColor = field['rgba'] || getRGBA(this.roleindex);

    if (this.done) {
      return <Host class={{done: this.done}}>{option.checked ? '✓' : '☐'}</Host>;
    }

    return (
      <Host class={{required: settings.required, disabled}} style={{backgroundColor}}>
        <label>
          <input name={field.name} type="checkbox" tabIndex={settings.order} checked={option.checked} disabled={disabled} required={settings.required} value={option.id} />
          <span />

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
                    helpText={'Check boxes allow the user to select one or more (non-exclusive) options.'}
                  />
                </verdocs-portal>
              )}
            </Fragment>
          )}
        </label>
      </Host>
    );
  }
}
