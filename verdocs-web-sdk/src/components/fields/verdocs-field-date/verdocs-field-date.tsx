import {Component, h, Host, Prop, Event, EventEmitter, State} from '@stencil/core';
import {IDocumentField} from '@verdocs/js-sdk/Documents/Documents';

/**
 * Displays a signature field. Various field types are supported, including traditional Signature and Initials types as well as
 * input types like text and checkbox.
 */
@Component({
  tag: 'verdocs-field-date',
  styleUrl: 'verdocs-field-date.scss',
  shadow: false,
})
export class VerdocsFieldDate {
  /**
   * The field to display.
   */
  @Prop() field: IDocumentField;

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

  @Event({composed: true}) signatureComplete: EventEmitter<string>;

  @Event({composed: true}) initialComplete: EventEmitter<string>;

  @State() preparedMessage: string;
  @State() signatureUrl: string = '';

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

  componentWillLoad() {
    console.log('Date field', this.field);
  }

  render() {
    return (
      <Host class={{focused: this.focused, storybook: !!window?.['STORYBOOK_ENV']}}>
        <input type="date" name="date" id="date" value="" placeholder="Select Date" />
      </Host>
    );
  }
}
