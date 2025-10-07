import {format} from 'date-fns';
import {getRGBA} from '@verdocs/js-sdk';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import type {ITemplateField} from '@verdocs/js-sdk';
import {Component, Element, Event, EventEmitter, h, Host, Method, Prop, Fragment, State} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {FORMAT_DATE} from '../../../utils/Types';
import {Store} from '../../../utils/Datastore';

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
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() containerId = `verdocs-date-picker-${Math.random().toString(36).substring(2, 11)}`;

  @State() showingProperties?: boolean = false;

  @Method()
  async focusField() {
    // Our input field is fake, so we fake the flash too
    this.focused = true;
    this.picker?.show();
    setTimeout(() => {
      this.focused = false;
    }, 500);
  }

  picker: AirDatepicker<HTMLElement> | null = null;

  componentDidLoad() {
    this.picker = new AirDatepicker<HTMLElement>(`#${this.containerId}`, {
      locale: localeEn,
      isMobile: true,
      autoClose: true,
      onShow: () => (this.focused = true),
      onHide: () => (this.focused = false),
      onSelect: ({date, formattedDate}) => {
        const event = new CustomEvent('fieldChange', {detail: {date, formattedDate}});
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

  @State() focused?: boolean = false;

  // NOTE: We don't use a "date" field here because browsers vary widely in their formatting of it.
  render() {
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, focused, xscale = 1, yscale = 1} = this;

    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    const {required = false, placeholder = 'Date...', value = '', label = '', readonly = false} = field || {};
    const backgroundColor = getRGBA(index);

    const formattedValue = value ? format(new Date(value), FORMAT_DATE) : '';

    if (this.done) {
      return <Host class={{done}}>{formattedValue}</Host>;
    }

    return (
      <Host class={{required, disabled, done, focused}} style={{backgroundColor}}>
        {label && <label>{label}</label>}

        <input
          name={fieldname}
          class="input-el"
          type="text"
          value={formattedValue}
          id={this.containerId}
          placeholder={placeholder}
          disabled={readonly || disabled}
          onFocus={() => (this.focused = true)}
          onBlur={() => (this.focused = false)}
        />

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
