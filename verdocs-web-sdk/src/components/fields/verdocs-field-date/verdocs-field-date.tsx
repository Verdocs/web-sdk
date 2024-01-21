import {format} from 'date-fns';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, Element, Event, EventEmitter, h, Host, Method, Prop, Fragment, State} from '@stencil/core';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getFieldSettings} from '../../../utils/utils';
import {SettingsIcon} from '../../../utils/Icons';
import {FORMAT_DATE} from '../../../utils/Types';

/**
 * Displays a date field. When tapped or clicked, the input element will display a date picker component.
 */
@Component({
  tag: 'verdocs-field-date',
  styleUrl: 'verdocs-field-date.scss',
  shadow: false,
})
export class VerdocsFieldDate {
  @Element()
  private hostEl: HTMLInputElement;

  private el: HTMLInputElement;

  /**
   * The template the field is for/from. Only required for the field builder, passed down to the properties component.
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
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop() field?: ITemplateField;

  /**
   * Event fired on every character entered into / deleted from the field.
   */
  @Event({composed: true}) settingsPress: EventEmitter;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() containerId = `verdocs-date-picker-${Math.random().toString(36).substring(2, 11)}`;

  @State() showingProperties?: boolean = false;

  @Method() async focusField() {
    this.el.focus();
  }

  fieldStore: TTemplateFieldStore = null;
  roleStore: TTemplateRoleStore = null;

  async componentWillLoad() {
    if (this.field) {
      const ts = getTemplateFieldStore(this.templateid);
      ts.set('fields', [...ts.get('fields'), this.field]);
    }

    this.fieldStore = getTemplateFieldStore(this.templateid);
    this.roleStore = getTemplateRoleStore(this.templateid);
  }

  componentDidLoad() {
    new AirDatepicker(`#${this.containerId}`, {
      locale: localeEn,
      isMobile: true,
      autoClose: true,
      onSelect: ({date, formattedDate}) => {
        console.log('Selected date', formattedDate, date);
        const event = new CustomEvent('input', {
          detail: {date, formattedDate},
        });
        // const event = new window.Event('input', {composed: true, bubbles: true, cancelable: true});
        console.log('Will dispatch', event, this.el);
        this.hostEl.dispatchEvent(event);
      },
    });
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

  // NOTE: We don't use a "date" field here because browsers vary widely in their formatting of it.
  render() {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    const roleIndex = getRoleIndex(this.roleStore, field?.role_name);
    const backgroundColor = field?.['rgba'] || getRGBA(roleIndex);

    const settings = getFieldSettings(field);
    const disabled = this.disabled ?? settings.disabled ?? false;

    if (this.done) {
      const formatted = settings?.result ? format(new Date(settings?.result), FORMAT_DATE) : '';

      return <Host class={{done: this.done}}>{formatted}</Host>;
    }

    return (
      <Host class={{required: field?.required, disabled}} style={{backgroundColor}}>
        <input name={field?.name} class="input-el" type="text" value="" id={this.containerId} disabled={disabled} placeholder={settings.placeholder} ref={el => (this.el = el)} />

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
                  fieldName={field?.name}
                  onClose={() => (this.showingProperties = false)}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: field?.name});
                    return this.hideSettingsPanel();
                  }}
                  onSettingsChanged={e => {
                    this.settingsChanged?.emit(e.detail);
                    return this.hideSettingsPanel();
                  }}
                  helpText={'Date fields allow the user to select a date.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
