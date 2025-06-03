import interact from 'interactjs';
import {getRGBA, IEnvelopeField, ITemplate, ITemplateField, updateField, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Host, Element, Prop, Method, Event, EventEmitter, Fragment, State} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';
import {ResizeEvent} from '@interactjs/actions/resize/plugin';

/**
 * Display a simple 1-line text input field.
 */
@Component({
  tag: 'verdocs-field-textbox',
  styleUrl: 'verdocs-field-textbox.scss',
  shadow: false,
})
export class VerdocsFieldTextbox {
  @Element() el: HTMLElement;
  private inputEl: HTMLInputElement | HTMLTextAreaElement;

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
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop({reflect: true}) multiline?: boolean = false;

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
    this.inputEl.focus();
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

  componentDidRender() {
    interact.dynamicDrop(true);

    if (this.editable) {
      interact(this.el).resizable({
        edges: {
          top: '.edge-top',
          left: '.edge-left',
          bottom: '.edge-bottom',
          right: '.edge-right',
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: {width: 30, height: 15},
          }),
        ],
        listeners: {
          start: this.handleResizeStart.bind(this),
          move: this.handleResize.bind(this),
          end: this.handleResizeEnd.bind(this),
        },
      });
    }
  }

  handleResizeStart(e: ResizeEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.target.dataset.originalBottom = e.target.style.bottom;
  }

  handleResize(e: any) {
    let {width, height} = e.rect;

    const dX = e.deltaRect.left;
    const dY = e.deltaRect.bottom;
    const currentLeft = parseFloat(e.target.style.left);
    const currentBottom = parseFloat(e.target.style.bottom);

    width /= this.xscale;
    height /= this.yscale;

    Object.assign(e.target.style, {
      width: `${width}px`,
      height: `${height}px`,
      left: `${currentLeft + dX}px`,
      bottom: `${currentBottom - dY}px`,
    });
  }

  async handleResizeEnd(e: any) {
    const {sourceid, fieldname} = this;

    const width = Math.round(parseFloat(e.target.style.width));
    let height = Math.round(parseFloat(e.target.style.height));
    if (height < 20) {
      height = 15;
    }
    const multiline = height > 15;

    const newBottom = parseFloat(e.target.style.bottom);
    const originalBottom = parseFloat(e.target.dataset.originalBottom);
    const template = await Store.getTemplate(VerdocsEndpoint.getDefault(), this.sourceid);
    const oldField = template.fields.find(f => f.name === fieldname);
    const y = newBottom !== originalBottom ? newBottom / this.yscale : oldField?.y;

    updateField(VerdocsEndpoint.getDefault(), sourceid, fieldname, {width, height, y, multiline})
      .then(async updatedField => {
        const template = await Store.getTemplate(VerdocsEndpoint.getDefault(), this.sourceid);
        const newTemplate = JSON.parse(JSON.stringify(template)) as ITemplate;
        const fieldIndex = newTemplate.fields.findIndex(field => field.name === fieldname);
        if (fieldIndex > -1) {
          newTemplate.fields[fieldIndex] = updatedField;
        }
        Store.updateTemplate(this.sourceid, newTemplate);

        this.settingsChanged?.emit({fieldName: fieldname, field: updatedField});
        Object.assign(e.target.dataset, {x: 0, y: 0, h: 0});
      })
      .catch(e => console.log('Field update failed', e));
  }

  render() {
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, focused, xscale = 1, yscale = 1} = this;
    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    let {required = false, placeholder = '', label = '', width = 150, default: value = '', multiline = false} = field || {};
    const backgroundColor = getRGBA(index);

    // TODO: Consolidate value/defaultValue handling between template and envelope fields.
    if ((field as any)?.value) {
      value = (field as any)?.value;
    }

    // TODO: This is an outdated technique from the old system. We should compute it.
    const maxlength = width / 5;

    if (done) {
      return <Host class={{done}}>{value}</Host>;
    }

    return (
      <Host class={{required, disabled, done, focused}} style={{backgroundColor}}>
        {editable && <div class="edge-top" />}
        {editable && <div class="edge-right" />}
        {editable && <div class="edge-left" />}
        {editable && <div class="edge-bottom" />}

        {label && <label>{label}</label>}

        {multiline ? (
          <textarea
            name={fieldname}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            ref={el => (this.inputEl = el)}
            onFocus={() => (this.focused = true)}
            onBlur={() => (this.focused = false)}
          >
            {value}
          </textarea>
        ) : (
          <input
            type="text"
            name={fieldname}
            value={value}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            maxlength={maxlength}
            ref={el => (this.inputEl = el)}
            onFocus={() => (this.focused = true)}
            onBlur={() => (this.focused = false)}
          />
        )}

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
                  helpText={
                    'Text boxes may be used to capture simple text input. Participant-entered values will be stored for later retrieval via the "name" field.<br /><br />If marked required, the participant must complete the field before proceeding.'
                  }
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
