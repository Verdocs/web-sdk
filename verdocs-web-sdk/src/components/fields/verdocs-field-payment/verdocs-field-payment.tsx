import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Event, EventEmitter, State, Method, Fragment} from '@stencil/core';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore} from '../../../utils/TemplateRoleStore';
import {getTemplateFieldStore, TTemplateFieldStore} from '../../../utils/TemplateFieldStore';
import {getFieldSettings} from '../../../utils/utils';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-payment',
  styleUrl: 'verdocs-field-payment.scss',
  shadow: false,
})
export class VerdocsFieldPayment {
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

  @Prop() fields: any[];
  @Prop() pageNum: number;
  @Prop() roleName: string;
  @Prop() fieldId: string;
  @Prop() recipients: any;
  @Prop() selectedRoleName: string;
  @Prop() pdfPages: any[];
  @Prop() currentSignature: string;
  @Prop() currentSignatureId: string;
  @Prop() currentInitial: string;
  @Prop() currentInitialId: string;
  @Prop() focused: boolean = false;
  @Prop() signed: boolean = false;

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

  @Event({composed: true}) signatureComplete: EventEmitter<string>;

  @Event({composed: true}) initialComplete: EventEmitter<string>;

  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  @State() preparedMessage: string;
  @State() signatureUrl: string = '';

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  mode: string;

  @State() showingProperties?: boolean = false;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  fieldStore: TTemplateFieldStore = null;
  roleStore: TTemplateRoleStore = null;

  componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
    this.roleStore = getTemplateRoleStore(this.templateid);

    // Load validators
    // Load fields
    // Get role names
    if (this.recipients && this.recipients.length > 0) {
      const preparer = this.recipients.find(r => r.type === 'preparer');
      console.log('Found preparer', preparer);
      if (preparer) {
        this.preparedMessage = `Prepared by ${preparer['full_name']}`;
      }
    }
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
    const field = this.fieldStore.get('fields').find(field => field.name === this.fieldname);
    const roleIndex = getRoleIndex(this.roleStore, field.role_name);
    const backgroundColor = field['rgba'] || getRGBA(roleIndex);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    const disabled = this.disabled ?? settings.disabled ?? false;

    return (
      <Host class={{focused: this.focused, disabled}} style={{backgroundColor}}>
        <button class={{hide: this.signed}}>$</button>
        {this.signed ? <div class="frame" /> : <div style={{display: 'none'}} />}
        <img width="100%" height="100%" src={this.signatureUrl} alt="Payment Icon" />
      </Host>
    );
  }
}
