import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {ITemplateField, ITemplateFieldSetting} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Host, Prop, Event, EventEmitter, State, Method, Fragment} from '@stencil/core';
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
   * May be used to force the field to re-render.
   */
  @Prop() rerender?: number = 0;

  @Event({composed: true}) signatureComplete: EventEmitter<string>;

  @Event({composed: true}) initialComplete: EventEmitter<string>;

  @Event({composed: true}) settingsChanged: EventEmitter<{fieldName: string; settings: ITemplateFieldSetting; field: ITemplateField}>;

  @State() preparedMessage: string;
  @State() signatureUrl: string = '';

  /**
   * If set, the field will be colored using this index value to select the background color.
   */
  @Prop() roleindex?: number = 0;

  _fields: any[] = [];
  // envelopeFieldsFormGroup: FormGroup;
  signatureFile: any = null;
  initialFile: any = null;
  today: string;
  focusOrderNumber = -1;
  focusFieldName: string = '';
  timer: any;
  activeElement = null;
  showError = {
    pageNum: -1,
    fieldIndex: -1,
    type: null,
  };
  dialogOpened = false;
  closeAllErrors = false;
  fieldsMap: any = {};
  mode: string;

  fieldsForCurrentSigner: any[] = [];

  validators;
  fontSize = 11;
  averageFontWidth = 5;
  requiredFields: any[] = [];

  @State() showingProperties?: boolean = false;

  /**
   * Event fired when the field is deleted.
   */
  @Event({composed: true}) deleted: EventEmitter<{fieldName: string}>;

  fieldStore: TTemplateFieldStore = null;

  componentWillLoad() {
    this.fieldStore = getTemplateFieldStore(this.templateid);
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

  // [tabIndex]="field.role !== roleName ? -1 : 1"
  // [ngStyle]="field.element_style"
  // [value]="field.value"
  // (click)="initiateSign(field)"
  // (blur)="validateChanges(field)"
  // [disabled]="field.role!==roleName"
  // [id]="field.key"

  // <button _ngcontent-app-root-c342="" class="envelope__field" tabindex="1" ng-reflect-ng-style="[object Object]"
  // ng-reflect-ng-class="[object Object]" value="" id="signatureP5-1"
  // style="height: 100%; width: 100%; background: none; font-size: 11px; border: 1px solid rgb(204, 0, 0);"> Signature </button>

  //     bottom: 229.333
  // px
  // ;
  //     left: 169.333
  // px
  // ;
  //     height: 41
  // px
  // ;
  //     width: 82
  // px
  // ;
  //     background-color: rgba(156, 39, 176, 0.4);
  //     transform: scale(1.33333, 1.33333);
  // }
  // <style>
  // .envelope__item[_ngcontent-app-root-c342] {
  //     position: absolute;
  //     transform-origin: bottom left;
  //     opacity: 1;

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
    // TemplateStore.updateCount++;
  }

  render() {
    const field = this.fieldStore.get(this.fieldname);
    if (!field) {
      return <Fragment />;
    }

    const settings = getFieldSettings(field);
    const disabled = this.disabled ?? settings.disabled ?? false;
    console.log('Payment field', settings);
    const backgroundColor = field['rgba'] || getRGBA(this.roleindex);

    return (
      <Host class={{focused: this.focused, disabled}} style={{backgroundColor}}>
        <button class={{hide: this.signed}}>$</button>
        {this.signed ? <div class="frame" /> : <div style={{display: 'none'}} />}
        <img width="100%" height="100%" src={this.signatureUrl} alt="Payment Icon" />
      </Host>
    );
  }
}
