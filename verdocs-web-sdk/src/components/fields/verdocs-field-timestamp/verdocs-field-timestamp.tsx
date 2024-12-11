import {format} from 'date-fns/format';
import {ITemplateField, getRGBA, IEnvelopeField} from '@verdocs/js-sdk';
import {Component, h, Host, Prop, Method, Event, EventEmitter, Fragment, State} from '@stencil/core';
import {FORMAT_TIMESTAMP} from '../../../utils/Types';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

/**
 * Display a timestamp. Timestamps are not editable by signers. Instead, they are automatically
 * filled when the signer submits the document.
 */
@Component({
  tag: 'verdocs-field-timestamp',
  styleUrl: 'verdocs-field-timestamp.scss',
  shadow: false,
})
export class VerdocsFieldTimestamp {
  private el: HTMLInputElement;

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
  @Prop() pagenumber?: number = 1;

  /**
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

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
    this.showingProperties = false;
  }

  render() {
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, xscale = 1, yscale = 1} = this;

    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    const {required = false, placeholder = '', value = '', label = ''} = field || {};
    const backgroundColor = getRGBA(index);

    const formatted = format(new Date(value || new Date().toISOString()), FORMAT_TIMESTAMP);

    if (done) {
      return <Host class={{done}}>{formatted}</Host>;
    }

    return (
      <Host class={{required, disabled, done}} style={{backgroundColor}}>
        {label && <label>{label}</label>}
        <input type="text" placeholder={placeholder} value={formatted} disabled={true} ref={el => (this.el = el)} />

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
                  onClose={() => this.hideSettingsPanel()}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: fieldname});
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
