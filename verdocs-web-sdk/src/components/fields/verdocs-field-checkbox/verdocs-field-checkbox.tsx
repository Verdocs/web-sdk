import {ITemplateField, getRGBA} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, Fragment, h, Host, Method, Prop, State} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

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
   * Fields may be attached to templates or envelopes, but only template fields may be edited.
   */
  @Prop({reflect: true}) source: 'template' | 'envelope' = 'template';

  /**
   * The source template or envelope ID the field is found in.
   */
  @Prop({reflect: true}) sourceid: string = '';

  /**
   * The name of the field to display.
   */
  @Prop({reflect: true}) fieldname: string = '';

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop({reflect: true}) disabled?: boolean = false;

  /**
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop({reflect: true}) done?: boolean = false;

  /**
   * If set, a settings icon will be displayed on hover. The settings shown allow the field's recipient and other settings to be
   * changed, so it should typically only be enabled in the Builder.
   */
  @Prop({reflect: true}) editable?: boolean = false;

  /**
   * If set, the field may be dragged to a new location. This should only be enabled in the Builder, or for self-placed fields.
   */
  @Prop({reflect: true}) moveable?: boolean = false;

  /**
   * If set, the field will be be scaled horizontally by this factor.
   */
  @Prop({reflect: true}) xscale?: number = 1;

  /**
   * If set, the field will be be scaled vertically by this factor.
   */
  @Prop({reflect: true}) yscale?: number = 1;

  /**
   * The page the field is on
   */
  @Prop({reflect: true}) pagenumber?: number = 1;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;
  @State() focused?: boolean = false;

  @Method()
  async focusField() {
    // We don't have a visible input that we can actually focus on, so we fake it
    this.focused = true;
    setTimeout(() => {
      this.focused = false;
    }, 500);
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

  render() {
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, focused, xscale = 1, yscale = 1} = this;

    const {index, field} = Store.getField(source, sourceid, fieldname);
    const {required = false, label = '', value = false} = field || {};
    const backgroundColor = getRGBA(index);

    const checked = value === 'true';

    if (done) {
      return <Host class={{done}}>{checked ? '✓' : '☐'}</Host>;
    }

    return (
      <Host class={{required, disabled, done, focused}} style={{backgroundColor}}>
        {label && <div class="label">{label}</div>}

        <label htmlFor={fieldname}>
          <input id={fieldname} name={fieldname} type="checkbox" checked={checked} disabled={disabled} required={required} />
          <span />

          {editable && (
            <Fragment>
              <div
                id={`verdocs-settings-panel-trigger-${fieldname}`}
                style={{transform: `scale(${Math.floor((1 / xscale) * 1000) / 1000}, ${Math.floor((1 / yscale) * 1000) / 1000})`}}
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
                    templateId={sourceid}
                    fieldName={field.name}
                    onClose={() => (this.showingProperties = false)}
                    onDelete={() => {
                      this.deleted?.emit({fieldName: fieldname});
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
