import {ITemplateField, getRGBA, IEnvelopeField} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Method, Prop, Fragment, State} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

/**
 * Displays a dropdown field that allows the user to choose one of a list of options.
 */
@Component({
  tag: 'verdocs-field-dropdown',
  styleUrl: 'verdocs-field-dropdown.scss',
  shadow: false,
})
export class VerdocsFieldDropdown {
  selectEl: HTMLSelectElement;

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
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop({reflect: true}) disabled?: boolean = false;

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
   * If set, the field is considered "done" and is drawn in a display-final-value state.
   */
  @Prop({reflect: true}) done?: boolean = false;

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
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
   * It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
   * keypress.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;
  @State() focused = false;

  @Method()
  async focusField() {
    // Our input field is fake, so we fake the flash too
    this.focused = true;
    setTimeout(() => {
      this.focused = false;
    }, 500);

    this.selectEl?.showPicker();
  }

  handleChange(e: any) {
    this.fieldChange.emit(e.target.value);
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
    let {required = false, value = '', label = '', options, readonly = false} = field || {};
    const backgroundColor = getRGBA(index);

    // TODO: Consolidate value/defaultValue handling between template and envelope fields.
    if ((field as any)?.value) {
      value = (field as any)?.value;
    }

    if (done) {
      return <Host class={{done}}>{value}</Host>;
    }

    // TODO: Look for other places this mistaken assumption was made.
    // Defaults only apply in destructuring if undefined. null doesn't trigger it.
    options ||= [];

    return (
      <Host class={{required, disabled, done, focused}} style={{backgroundColor}}>
        {label && <label>{label}</label>}

        <select disabled={readonly || disabled} onChange={e => this.handleChange(e)} ref={el => (this.selectEl = el as HTMLSelectElement)}>
          <option value="">Select...</option>
          {options.map(option => (
            <option value={option.id} selected={option.id === value}>
              {option.label}
            </option>
          ))}
          {!options.length && (
            <option value="NA" selected={'NA' === value}>
              N/A
            </option>
          )}
        </select>

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
                  helpText={"Dropdowns are used to capture a recipient's selection of one of several options."}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
