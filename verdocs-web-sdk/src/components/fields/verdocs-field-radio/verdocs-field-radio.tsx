import {ITemplateField, getRGBA, IEnvelopeField} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Method, Prop, Fragment, State} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

const RadioIconUnselected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

const RadioIconSelected = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>`;

/**
 * Displays a radio button.
 */
@Component({
  tag: 'verdocs-field-radio',
  styleUrl: 'verdocs-field-radio.scss',
  shadow: false,
})
export class VerdocsFieldRadio {
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
   * Override the field's settings. This is intended to be used during signing when fields are being
   * mutated.
   */
  @Prop() field: IEnvelopeField | null | undefined = null;

  /**
   * If set, overrides the field's settings object. Primarily used in Storybook mode.
   */
  @Prop({reflect: true}) disabled?: boolean = false;

  /**
   * If set, overrides the field's required object. Primarily used in Storybook mode.
   */
  @Prop({reflect: true}) required?: boolean = false;

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

  @State() showingProperties?: boolean = false;
  @State() focused = false;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @Method()
  async focusField() {
    // Our input field is fake, so we fake the flash too
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

    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    const {name, required = false, label = '', group = '', value = false} = field || {};
    const backgroundColor = getRGBA(index);

    const selected = value === 'true';

    if (done) {
      return (
        <Host class={{done}} style={{maxWidth: '10px'}}>
          <span innerHTML={selected ? RadioIconSelected : RadioIconUnselected} />
        </Host>
      );
    }

    return (
      <Host class={{required: this.required || required, disabled, done, focused}} style={{backgroundColor}}>
        {label && <div class="label">{label}</div>}
        {editable && group && <div class="group">{group}</div>}

        <input id={fieldname} type="radio" name={group || fieldname} value={name} checked={!!selected} disabled={disabled} required={required} />
        <label htmlFor={fieldname} />

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
              <verdocs-portal anchor={`verdocs-settings-panel-trigger-${fieldname}`} onClickAway={() => (this.showingProperties = false)}>
                <verdocs-template-field-properties
                  templateId={sourceid}
                  fieldName={fieldname}
                  onClose={() => (this.showingProperties = false)}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: fieldname});
                    return this.hideSettingsPanel();
                  }}
                  onSettingsChanged={e => {
                    this.settingsChanged?.emit(e.detail);
                    return this.hideSettingsPanel();
                  }}
                  helpText={"Radio buttons capture the recipient's selection of just one of several related (exclusive) options."}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
