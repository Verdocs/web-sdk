import interact from 'interactjs';
import {ITemplateField, IEnvelopeField} from '@verdocs/js-sdk';
import {Component, h, Host, Prop, Method, Event, EventEmitter, State, Fragment, Element, Listen, Watch} from '@stencil/core';
import {SettingsIcon} from '../../../utils/Icons';
import {Store} from '../../../utils/Datastore';

export interface ISelectedFile {
  lastModified: number;
  size: number;
  type: string;
  name: string;
  data: string;
}

const PaperclipIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--verdocs-field-text-color, currentColor)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>`;

const AttachedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--verdocs-attachment-icon-color, #339933)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-check"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>`;

/**
 * Displays an attachment field.
 */
@Component({
  tag: 'verdocs-field-attachment',
  styleUrl: 'verdocs-field-attachment.scss',
  shadow: false,
})
export class VerdocsFieldAttachment {
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
   * If set to true, it will force interact to unset the el, resulting in no dragging the field.
   */
  @Prop({reflect: true}) isPreview?: boolean;

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
   * Event fired when the field's settings are changed.
   */
  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; field: ITemplateField}>;

  /**
   * Event fired when a file is attached by the signer.
   */
  @Event({composed: true}) attached: EventEmitter<ISelectedFile>;

  /**
   * Event fired when the field is deleted. Note that this is for the FIELD (e.g. in
   * Build) not for any attachments (during signing).
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;
  @State() dialogOpen?: boolean = false;
  @State() selectedFile?: ISelectedFile | null = null;
  @State() focused = false;

  @Listen('blur')
  handleBlur() {
    this.focused = false;
  }

  @Method()
  async focusField() {
    this.el.focus();
    this.focused = true;
    this.dialogOpen = true;
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

  @Watch('editable')
  onEditableChanged(newVal: boolean, oldVal: boolean) {
    // When transitioning out of editable mode (e.g., builder -> preview tab), clear interact bindings
    if (oldVal && !newVal) {
      interact(this.el).unset();
    }
  }

  disconnectedCallback() {
    // Clear any interact.js drag/resize bindings so they don't leak if the DOM element is reused elsewhere
    interact(this.el).unset();
  }

  handleShow() {
    this.dialogOpen = true;
  }

  handleUploadNext = (e: any) => {
    console.log('Upload next', e);
    this.dialogOpen = false;
    this.selectedFile = e.detail[0];
    this.attached?.emit(e.detail[0]);
  };

  handleUploadRemove = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.dialogOpen = false;
    this.selectedFile = null;
    this.deleted?.emit({fieldName: this.fieldname});
  };

  render() {
    const {source, sourceid, fieldname, editable = false, done = false, disabled = false, focused, xscale = 1, yscale = 1} = this;

    const {index, field} = Store.getField(source, sourceid, fieldname, this.field);
    const {required = false, value = '', label = '', readonly = false, settings = {}} = field || {};
    const signerClass = `signer-${(index % 10) + 1}`;

    const hasFile = value || !!this.selectedFile;

    if (done) {
      return (
        <Host class={{'verdocs-field': true,done}}>
          <div class="attach" innerHTML={hasFile ? AttachedIcon : PaperclipIcon} />
        </Host>
      );
    }

    return (
      <Host class={{'verdocs-field': true,required, disabled, done, focused, [signerClass]: true}}>
        {label && <label>{label}</label>}

        <div class="attach" innerHTML={hasFile ? AttachedIcon : PaperclipIcon} onClick={() => !disabled && !readonly && this.handleShow()} />

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
                  helpText={'Attachments allow the user to attach their own documents (e.g. resumes or disclosures) to a signing flow.'}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}

        {this.dialogOpen && (
          <verdocs-portal>
            <verdocs-upload-dialog
              existingFile={settings}
              onNext={e => this.handleUploadNext(e)}
              onRemove={e => this.handleUploadRemove(e)}
              onExit={() => (this.dialogOpen = false)}
            />
          </verdocs-portal>
        )}
      </Host>
    );
  }
}
