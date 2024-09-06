import {ITemplateField, getRGBA} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Method, Prop, Fragment, State} from '@stencil/core';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {SettingsIcon} from '../../../utils/Icons';

/**
 * Displays an initial field. If an initial already exists, it will be displayed and the field
 * will be disabled. Otherwise, a placeholder button will be shown. Clicking the button will
 * show a dialog to adopt an initial.
 *
 * NOTE: When initial fields are completed they will be filled with an initial "stamp".
 * This requires operation against a live, valid envelope. If you are testing this component
 * in Storybook, it will not be visible here.
 */
@Component({
  tag: 'verdocs-field-initial',
  styleUrl: 'verdocs-field-initial.scss',
  shadow: false,
})
export class VerdocsFieldInitial {
  /**
   * The template the field is for/from. Only required in Builder mode, to support the Field Properties dialog.
   */
  @Prop({reflect: true}) templateid: string = '';

  /**
   * The name of the field to display.
   */
  @Prop({reflect: true}) fieldname: string = '';

  /**
   * If set, overrides the field's settings object. Primarily used to support "preview" modes where all fields are disabled.
   */
  @Prop({reflect: true}) disabled?: boolean = false;

  /**
   * The document or template field to display.
   */
  @Prop({reflect: true}) initials: string = '';

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
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image.
   */
  @Event({composed: true}) adopt: EventEmitter<string>;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

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
   * Event fired on every character entered into / deleted from the field.
   */
  @Event({composed: true}) settingsPress: EventEmitter;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  @State() showingProperties?: boolean = false;
  @State() focused?: boolean = false;

  @Method() async focusField() {
    this.handleShow();
  }

  @State()
  tempInitials: string = '';

  fieldStore: TTemplateFieldStore = null;
  roleStore: TTemplateRoleStore = null;

  async componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
    this.roleStore = getTemplateRoleStore(this.templateid);
  }

  private dialog?: any;

  hideDialog() {
    this.dialog?.remove();
    this.dialog = null;
    this.focused = false;
  }

  handleAdopt(e: any) {
    console.log('[INITIAL] Adopted initials');
    this.tempInitials = e.detail;
    this.fieldChange?.emit(this.tempInitials);
    this.hideDialog();
  }

  handleShow() {
    this.dialog = document.createElement('verdocs-initial-dialog');
    this.dialog.setAttribute('initials', this.initials);
    // this.dialog.setAttribute('roleindex', this.roleindex);
    this.dialog.addEventListener('exit', () => this.hideDialog());
    this.dialog.addEventListener('next', (e: any) => this.handleAdopt(e));
    document.body.append(this.dialog);
    this.focused = true;
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
    const {templateid, fieldname = '', editable = false, focused, done = false, disabled = false, xscale = 1, yscale = 1} = this;

    const field = this.fieldStore.get('fields').find(field => field.name === fieldname);
    const {required = false, role_name = '', value = '', label = ''} = field || {};
    const {base64} = field.settings || {};

    const backgroundColor = getRGBA(getRoleIndex(this.roleStore, role_name));

    if (done) {
      return <Host class={{done}}>{value && <img src={value} alt="Initial" />}</Host>;
    }

    return (
      <Host class={{required, disabled, done, focused}} style={{backgroundColor}}>
        {label && <label>{label}</label>}

        {base64 ? <img src={base64} alt="Initial" /> : <button onClick={() => !disabled && this.handleShow()}>Initial</button>}

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
                  templateId={templateid}
                  fieldName={fieldname}
                  onClose={() => (this.showingProperties = false)}
                  onDelete={() => {
                    this.deleted?.emit({fieldName: field.name});
                    return this.hideSettingsPanel();
                  }}
                  onSettingsChanged={e => {
                    this.settingsChanged?.emit(e.detail);
                    return this.hideSettingsPanel();
                  }}
                  helpText={"initial fields capture the recipient's initials on a clause or page."}
                />
              </verdocs-portal>
            )}
          </Fragment>
        )}
      </Host>
    );
  }
}
