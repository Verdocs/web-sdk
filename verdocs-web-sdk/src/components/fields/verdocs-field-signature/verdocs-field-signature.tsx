import interact from 'interactjs';
import {ResizeEvent} from '@interactjs/actions/resize/plugin';
import {ITemplateField, IEnvelopeField, VerdocsEndpoint, updateField, ITemplate} from '@verdocs/js-sdk';
import {Component, h, Host, Prop, Event, EventEmitter, Method, Fragment, State, Element, Listen} from '@stencil/core';
import {SettingsIcon, PencilIcon, EraserIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

/**
 * Displays a signature field. If a signature already exists, it will be displayed and the field
 * will be disabled. Otherwise, a placeholder button will be shown. Clicking the button will
 * show a dialog to adopt a signature.
 *
 * NOTE: When signature fields are completed they will be filled with a signature "stamp".
 * This requires operation against a live, valid envelope. If you are testing this component
 * in Storybook, it will not be visible here.
 */
@Component({
  tag: 'verdocs-field-signature',
  styleUrl: 'verdocs-field-signature.scss',
  shadow: false,
})
export class VerdocsFieldSignature {
  @Element() el: HTMLElement;

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
   * If set, the signature creation dialog will be initialized with this text.
   */
  @Prop({reflect: true}) name?: string = '';

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
   * If set, provides the ID of an already-adopted signature. If present, clicking the field (when empty)
   * will immediately use this signature instead of showing the adoption dialog.
   */
  @Prop({reflect: true}) signatureid?: string;

  /**
   * Event emitted when the field has changed.
   */
  @Event({composed: true}) fieldChange: EventEmitter<string>;

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

  @State() showingProperties?: boolean = false;
  @State() focused?: boolean = false;

  @Event({composed: true}) adopt: EventEmitter;

  @Method() async focusField() {
    this.el.focus();
    this.focused = true;
  }

  @State()
  tempSignature: string = '';

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
            min: {width: 71, height: 36},
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

  @Listen('blur')
  onBlur() {
    this.focused = false;
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

    const newBottom = parseFloat(e.target.style.bottom);
    const originalBottom = parseFloat(e.target.dataset.originalBottom);
    const template = await Store.getTemplate(VerdocsEndpoint.getDefault(), this.sourceid);
    const oldField = template.fields.find(f => f.name === fieldname);
    const y = newBottom !== originalBottom ? newBottom / this.yscale : oldField?.y;

    updateField(VerdocsEndpoint.getDefault(), sourceid, fieldname, {width, height, y})
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
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, focused, xscale = 1, yscale = 1} = this;

    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    const {required = false, value = '', label = '', settings = {}} = field || {};
    const {base64} = settings;
    const signerClass = `signer-${(index % 10) + 1}`;

    if (done) {
      return <Host class={{done}}>{value && <img src={base64} alt="" />}</Host>;
    }

    console.log('sid', this.signatureid);
    return (
      <Host class={{required, disabled, done, focused, filled: !!base64, [signerClass]: true}}>
        {editable && <div class="edge-right" />}
        {editable && <div class="edge-left" />}
        {editable && <div class="edge-top" />}
        {editable && <div class="edge-bottom" />}

        {label && <label>{label}</label>}

        {base64 ? (
          <div class="signature-container">
            <img src={base64} alt="Signature" />
            <div class="overlay">
              <button
                class="icon-button"
                innerHTML={PencilIcon}
                onClick={e => {
                  e.stopPropagation();
                  if (disabled) return;
                  // EDIT action: always open dialog
                  console.log('[SIGNATURE] Editing signature');
                  this.adopt.emit();
                }}
              />
              <button
                class="icon-button"
                innerHTML={EraserIcon}
                onClick={e => {
                  e.stopPropagation();
                  if (disabled) return;
                  // CLEAR action
                  console.log('[SIGNATURE] Clearing signature');
                  this.fieldChange?.emit(null);
                }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              if (disabled) return;
              // If we already have a signature ID, use it immediately
              if (this.signatureid) {
                console.log('[SIGNATURE] Reusing existing signature', this.signatureid);
                this.fieldChange?.emit(this.signatureid);
              } else {
                this.adopt.emit();
              }
            }}
          >
            Signature
          </button>
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
                  helpText={"Signature fields capture a recipient's signature on a document."}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
