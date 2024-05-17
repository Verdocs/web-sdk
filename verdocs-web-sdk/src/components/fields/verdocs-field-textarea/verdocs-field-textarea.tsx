import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {updateField} from '@verdocs/js-sdk/Templates/Fields';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Method, Event, EventEmitter, Element, Fragment, State} from '@stencil/core';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getFieldSettings} from '../../../utils/utils';
import {SettingsIcon} from '../../../utils/Icons';

/**
 * Display a multi-line text input field.
 */
@Component({
  tag: 'verdocs-field-textarea',
  styleUrl: 'verdocs-field-textarea.scss',
  shadow: false,
})
export class VerdocsFieldTextarea {
  @Element() el: HTMLElement;
  private inputEl: HTMLTextAreaElement;

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

  @Method()
  async focusField() {
    this.inputEl.focus();
  }

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

  @State() focused?: boolean = false;

  fieldStore: TTemplateFieldStore = null;
  roleStore: TTemplateRoleStore = null;

  async componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
    this.roleStore = getTemplateRoleStore(this.templateid);
  }

  componentDidRender() {
    interact.dynamicDrop(true);

    if (this.editable) {
      interact(this.el).resizable({
        edges: {top: true, bottom: true, left: true, right: true},
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
    let {x = 0, y = 0, h = 0} = e.target.dataset;
    let {width, height} = e.rect;

    x = (parseFloat(x) || 0) + e.deltaRect.left;
    y = (parseFloat(y) || 0) + e.deltaRect.top;
    h = (parseFloat(h) || 0) + e.deltaRect.height;

    Object.assign(e.target.style, {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${x}px, ${y + h}px)`,
    });

    Object.assign(e.target.dataset, {x, y, h});
  }

  handleResizeEnd(e) {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    if (!field) {
      return <Fragment />;
    }

    const newSettings = {...getFieldSettings(field)};
    const [translateX, translateY] = e.target.style.transform.split('(')[1].split(')')[0].split(',').map(parseFloat);

    newSettings.width = Math.round(parseFloat(e.target.style.width) / this.xscale);
    newSettings.height = Math.round(parseFloat(e.target.style.height) / this.yscale);
    newSettings.x = Math.round(newSettings.x + translateX / this.xscale);
    newSettings.y = Math.round(newSettings.y - translateY / this.yscale);

    updateField(this.endpoint, this.templateid, this.fieldname, {setting: newSettings})
      .then(field => {
        this.settingsChanged?.emit({fieldName: this.fieldname, settings: newSettings, field});
        Object.assign(e.target.dataset, {x: 0, y: 0, h: 0});
      })
      .catch(e => console.log('Field update failed', e));
  }

  render() {
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    const roleIndex = getRoleIndex(this.roleStore, field.role_name);
    const backgroundColor = field['rgba'] || getRGBA(roleIndex);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    const value = settings?.result || '';

    if (this.done) {
      return <Host class={{done: this.done}}>{settings.value}</Host>;
    }

    return (
      <Host class={{required: field?.required, disabled, done: this.done, focused: this.focused}} style={{backgroundColor}}>
        <textarea
          placeholder={settings.placeholder || ''}
          tabIndex={settings.order}
          disabled={disabled}
          name={field.name}
          required={field?.required}
          ref={el => (this.inputEl = el)}
          onFocus={() => (this.focused = true)}
          onBlur={() => (this.focused = false)}
        >
          {value}
        </textarea>

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
              <verdocs-portal anchor={`verdocs-settings-panel-trigger-${this.fieldname}`} onClickAway={() => (this.showingProperties = false)}>
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
                  helpText={'Text areas may be used to create multi-line text fields.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
