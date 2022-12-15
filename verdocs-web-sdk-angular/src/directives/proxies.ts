/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';



import type { IAuthStatus as IVerdocsAuthIAuthStatus } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsAuthSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsAuth extends Components.VerdocsAuth {
  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status. 
   */
  authenticated: EventEmitter<CustomEvent<IVerdocsAuthIAuthStatus>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsAuthSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['debug', 'endpoint', 'logo', 'visible']
})
@Component({
  selector: 'verdocs-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'endpoint', 'logo', 'visible']
})
export class VerdocsAuth {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['authenticated', 'sdkError']);
  }
}

import type { SDKError as IVerdocsBuildSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsBuild extends Components.VerdocsBuild {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsBuildSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-build',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'templateId']
})
export class VerdocsBuild {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError']);
  }
}


export declare interface VerdocsButton extends Components.VerdocsButton {
  /**
   * Event fired when the button is pressed. 
   */
  press: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'endIcon', 'label', 'size', 'startIcon', 'type', 'variant']
})
@Component({
  selector: 'verdocs-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'endIcon', 'label', 'size', 'startIcon', 'type', 'variant']
})
export class VerdocsButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['press']);
  }
}


export declare interface VerdocsButtonPanel extends Components.VerdocsButtonPanel {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['icon']
})
@Component({
  selector: 'verdocs-button-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['icon']
})
export class VerdocsButtonPanel {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsCheckbox extends Components.VerdocsCheckbox {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  selected: EventEmitter<CustomEvent<{value: string}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'disabled', 'name', 'value']
})
@Component({
  selector: 'verdocs-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'disabled', 'name', 'value']
})
export class VerdocsCheckbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selected']);
  }
}

import type { IContactSearchEvent as IVerdocsContactPickerIContactSearchEvent } from '@verdocs/web-sdk';
import type { IContactSelectEvent as IVerdocsContactPickerIContactSelectEvent } from '@verdocs/web-sdk';
export declare interface VerdocsContactPicker extends Components.VerdocsContactPicker {
  /**
   * Event fired when the user enters text in the search field. The calling application may use this to update
the `contactSuggestions` property. 
   */
  searchContacts: EventEmitter<CustomEvent<IVerdocsContactPickerIContactSearchEvent>>;
  /**
   * Event fired when the user cancels the dialog. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user changes the type. 
   */
  contactSelected: EventEmitter<CustomEvent<IVerdocsContactPickerIContactSelectEvent>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['contactSuggestions', 'endpoint', 'templateRole']
})
@Component({
  selector: 'verdocs-contact-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contactSuggestions', 'endpoint', 'templateRole']
})
export class VerdocsContactPicker {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchContacts', 'cancel', 'contactSelected']);
  }
}

import type { IDocumentPageInfo as IVerdocsDocumentPageIDocumentPageInfo } from '@verdocs/web-sdk';
export declare interface VerdocsDocumentPage extends Components.VerdocsDocumentPage {
  /**
   * Fired when a page has been rendered. This is also fired when the page is resized. 
   */
  pageRendered: EventEmitter<CustomEvent<IVerdocsDocumentPageIDocumentPageInfo>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['layers', 'pageNumber', 'virtualHeight', 'virtualWidth']
})
@Component({
  selector: 'verdocs-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['layers', 'pageNumber', 'virtualHeight', 'virtualWidth']
})
export class VerdocsDocumentPage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered']);
  }
}

import type { IMenuOption as IVerdocsDropdownIMenuOption } from '@verdocs/web-sdk';
export declare interface VerdocsDropdown extends Components.VerdocsDropdown {
  /**
   * Event fired when a menu option is clicked.
Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks. 
   */
  optionSelected: EventEmitter<CustomEvent<IVerdocsDropdownIMenuOption>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['open', 'options']
})
@Component({
  selector: 'verdocs-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['open', 'options']
})
export class VerdocsDropdown {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


export declare interface VerdocsFieldAttachment extends Components.VerdocsFieldAttachment {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'field', 'recipient'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'field', 'recipient']
})
export class VerdocsFieldAttachment {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange']);
  }
}


export declare interface VerdocsFieldCheckbox extends Components.VerdocsFieldCheckbox {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<{option: number; value: boolean}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'field', 'option', 'recipient']
})
@Component({
  selector: 'verdocs-field-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'field', 'option', 'recipient']
})
export class VerdocsFieldCheckbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange']);
  }
}


export declare interface VerdocsFieldDate extends Components.VerdocsFieldDate {
  /**
   * Event fired when the input field loses focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field gains focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  fieldInput: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  settingsPress: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex']
})
export class VerdocsFieldDate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput', 'settingsPress']);
  }
}


export declare interface VerdocsFieldDropdown extends Components.VerdocsFieldDropdown {
  /**
   * Event fired when the input field loses focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field gains focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'field', 'recipient'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'field', 'recipient']
})
export class VerdocsFieldDropdown {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange']);
  }
}


export declare interface VerdocsFieldInitial extends Components.VerdocsFieldInitial {
  /**
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image. 
   */
  adopt: EventEmitter<CustomEvent<string>>;
  /**
   * Event emitted when the user cancels the process. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  settingsPress: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'initials', 'moveable', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-initial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'initials', 'moveable', 'recipient', 'roleindex']
})
export class VerdocsFieldInitial {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'cancel', 'fieldChange', 'settingsPress']);
  }
}


export declare interface VerdocsFieldPayment extends Components.VerdocsFieldPayment {
  /**
   *  
   */
  signatureComplete: EventEmitter<CustomEvent<string>>;
  /**
   *  
   */
  initialComplete: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'field', 'fieldId', 'fields', 'focused', 'pageNum', 'pdfPages', 'recipient', 'recipients', 'roleName', 'selectedRoleName', 'signed']
})
@Component({
  selector: 'verdocs-field-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'field', 'fieldId', 'fields', 'focused', 'pageNum', 'pdfPages', 'recipient', 'recipients', 'roleName', 'selectedRoleName', 'signed']
})
export class VerdocsFieldPayment {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['signatureComplete', 'initialComplete']);
  }
}


export declare interface VerdocsFieldRadioButton extends Components.VerdocsFieldRadioButton {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<{option: number; value: boolean}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'field', 'option', 'recipient']
})
@Component({
  selector: 'verdocs-field-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'field', 'option', 'recipient']
})
export class VerdocsFieldRadioButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange']);
  }
}


export declare interface VerdocsFieldSignature extends Components.VerdocsFieldSignature {
  /**
   * Event emitted when the field has changed. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  settingsPress: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'moveable', 'name', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-signature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'moveable', 'name', 'recipient', 'roleindex']
})
export class VerdocsFieldSignature {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange', 'settingsPress']);
  }
}


export declare interface VerdocsFieldTextarea extends Components.VerdocsFieldTextarea {
  /**
   * Event fired when the input field loses focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field gains focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  fieldInput: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex']
})
export class VerdocsFieldTextarea {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput']);
  }
}


export declare interface VerdocsFieldTextbox extends Components.VerdocsFieldTextbox {
  /**
   * Event fired when the input field loses focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field gains focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  fieldInput: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired if the field is configurable when the recipient has changed. 
   */
  recipientChanged: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-textbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex']
})
export class VerdocsFieldTextbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput', 'recipientChanged']);
  }
}


export declare interface VerdocsFieldTimestamp extends Components.VerdocsFieldTimestamp {
  /**
   * Event fired when the input field loses focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field gains focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<boolean>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  fieldInput: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field. 
   */
  settingsPress: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-timestamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'editable', 'field', 'moveable', 'recipient', 'roleindex']
})
export class VerdocsFieldTimestamp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput', 'settingsPress']);
  }
}


export declare interface VerdocsHelpIcon extends Components.VerdocsHelpIcon {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['text']
})
@Component({
  selector: 'verdocs-help-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['text']
})
export class VerdocsHelpIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsInitialDialog extends Components.VerdocsInitialDialog {
  /**
   * Event fired when the initials are adopted. 
   */
  adopt: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the step is cancelled. 
   */
  cancel: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['initials', 'open']
})
@Component({
  selector: 'verdocs-initial-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['initials', 'open']
})
export class VerdocsInitialDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'cancel']);
  }
}


export declare interface VerdocsKbaDialog extends Components.VerdocsKbaDialog {
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  done: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'open', 'placeholder', 'step', 'steps']
})
@Component({
  selector: 'verdocs-kba-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'open', 'placeholder', 'step', 'steps']
})
export class VerdocsKbaDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'done']);
  }
}


export declare interface VerdocsLoader extends Components.VerdocsLoader {}

@ProxyCmp({
  defineCustomElementFn: undefined
})
@Component({
  selector: 'verdocs-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VerdocsLoader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsOkDialog extends Components.VerdocsOkDialog {
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  closed: EventEmitter<CustomEvent<'cancel' | 'ok'>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['cancel', 'heading', 'message', 'open']
})
@Component({
  selector: 'verdocs-ok-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['cancel', 'heading', 'message', 'open']
})
export class VerdocsOkDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['closed']);
  }
}


export declare interface VerdocsOrganizationCard extends Components.VerdocsOrganizationCard {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['organization']
})
@Component({
  selector: 'verdocs-organization-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['organization']
})
export class VerdocsOrganizationCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { SDKError as IVerdocsPreviewSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsPreview extends Components.VerdocsPreview {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsPreviewSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'templateId']
})
export class VerdocsPreview {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError']);
  }
}


export declare interface VerdocsQuickFunctions extends Components.VerdocsQuickFunctions {
  /**
   * Event fired when an entry is clicked. 
   */
  createTemplate: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when an entry is clicked. 
   */
  createDocument: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-quick-functions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint']
})
export class VerdocsQuickFunctions {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['createTemplate', 'createDocument']);
  }
}


export declare interface VerdocsRadioButton extends Components.VerdocsRadioButton {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress. 
   */
  selected: EventEmitter<CustomEvent<{value: string}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'disabled', 'name', 'value']
})
@Component({
  selector: 'verdocs-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'disabled', 'name', 'value']
})
export class VerdocsRadioButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selected']);
  }
}


export declare interface VerdocsSearch extends Components.VerdocsSearch {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint']
})
export class VerdocsSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { IRecentSearch as IVerdocsSearchActivityIRecentSearch } from '@verdocs/web-sdk';
export declare interface VerdocsSearchActivity extends Components.VerdocsSearchActivity {
  /**
   * Event fired when an entry is clicked. 
   */
  entrySelected: EventEmitter<CustomEvent<IVerdocsSearchActivityIRecentSearch>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'options', 'type']
})
@Component({
  selector: 'verdocs-search-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'options', 'type']
})
export class VerdocsSearchActivity {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import type { ISearchEvent as IVerdocsSearchBoxISearchEvent } from '@verdocs/web-sdk';
import type { TContentType as IVerdocsSearchBoxTContentType } from '@verdocs/web-sdk';
export declare interface VerdocsSearchBox extends Components.VerdocsSearchBox {
  /**
   * Event fired when the user changes the type. 
   */
  searchClicked: EventEmitter<CustomEvent<IVerdocsSearchBoxISearchEvent>>;
  /**
   * Event fired when the user changes the type. 
   */
  typeChanged: EventEmitter<CustomEvent<IVerdocsSearchBoxTContentType>>;
  /**
   * Event fired when the user changes the query string. 
   */
  queryChanged: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'grabsFocus', 'placeholder', 'query', 'type'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'grabsFocus', 'placeholder', 'query', 'type']
})
export class VerdocsSearchBox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchClicked', 'typeChanged', 'queryChanged']);
  }
}


export declare interface VerdocsSearchTabs extends Components.VerdocsSearchTabs {}

@ProxyCmp({
  defineCustomElementFn: undefined
})
@Component({
  selector: 'verdocs-search-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VerdocsSearchTabs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSelectInput extends Components.VerdocsSelectInput {
  /**
   * Event fired when the selection has changed 
   */
  fieldChange: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'label', 'options', 'value']
})
@Component({
  selector: 'verdocs-select-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'label', 'options', 'value']
})
export class VerdocsSelectInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange']);
  }
}

import type { IRole as IVerdocsSendIRole } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsSendSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsSend extends Components.VerdocsSend {
  /**
   * The user completed the form and clicked send. 
   */
  send: EventEmitter<CustomEvent<{recipientsAssigned: IVerdocsSendIRole[]}>>;
  /**
   * The user canceled the process. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSendSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-send',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'templateId']
})
export class VerdocsSend {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['send', 'cancel', 'sdkError']);
  }
}

import type { SDKError as IVerdocsSignSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsSign extends Components.VerdocsSign {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSignSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['documentId', 'endpoint', 'inviteCode', 'roleId']
})
@Component({
  selector: 'verdocs-sign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['documentId', 'endpoint', 'inviteCode', 'roleId']
})
export class VerdocsSign {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError']);
  }
}


export declare interface VerdocsSignatureDialog extends Components.VerdocsSignatureDialog {
  /**
   * Event fired when a signature is adopted. 
   */
  adopt: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the step is cancelled. 
   */
  cancel: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['name', 'open']
})
@Component({
  selector: 'verdocs-signature-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['name', 'open']
})
export class VerdocsSignatureDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'cancel']);
  }
}


export declare interface VerdocsStatusIndicator extends Components.VerdocsStatusIndicator {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['document', 'size', 'status', 'theme']
})
@Component({
  selector: 'verdocs-status-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['document', 'size', 'status', 'theme']
})
export class VerdocsStatusIndicator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTemplateCard extends Components.VerdocsTemplateCard {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['template']
})
@Component({
  selector: 'verdocs-template-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['template']
})
export class VerdocsTemplateCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ITemplate as IVerdocsTemplateCreateITemplate } from '@verdocs/web-sdk';
import type { ITemplateDocument as IVerdocsTemplateCreateITemplateDocument } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsTemplateCreateSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsTemplateCreate extends Components.VerdocsTemplateCreate {
  /**
   * Event fired when the user cancels the dialog. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user changes the type. 
   */
  templateCreated: EventEmitter<CustomEvent<{template: IVerdocsTemplateCreateITemplate; template_document: IVerdocsTemplateCreateITemplateDocument}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateCreateSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-template-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint']
})
export class VerdocsTemplateCreate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'templateCreated', 'sdkError']);
  }
}

import type { SDKError as IVerdocsTemplateFieldsSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsTemplateFields extends Components.VerdocsTemplateFields {
  /**
   * Event fired when the user completes the step. 
   */
  settingsUpdated: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user cancels the dialog. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateFieldsSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'templateId']
})
export class VerdocsTemplateFields {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsUpdated', 'cancel', 'sdkError']);
  }
}

import type { SDKError as IVerdocsTemplatePropertiesSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsTemplateProperties extends Components.VerdocsTemplateProperties {
  /**
   * Event fired when the user cancels the dialog. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user completes the step. 
   */
  settingsUpdated: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplatePropertiesSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'templateId']
})
export class VerdocsTemplateProperties {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'settingsUpdated', 'sdkError']);
  }
}

import type { IContactSearchEvent as IVerdocsTemplateRecipientsIContactSearchEvent } from '@verdocs/web-sdk';
import type { IContactSelectEvent as IVerdocsTemplateRecipientsIContactSelectEvent } from '@verdocs/web-sdk';
export declare interface VerdocsTemplateRecipients extends Components.VerdocsTemplateRecipients {
  /**
   * Event fired when the user enters text in the search field. The calling application may use this to update
the `contactSuggestions` property. 
   */
  searchContacts: EventEmitter<CustomEvent<IVerdocsTemplateRecipientsIContactSearchEvent>>;
  /**
   * Event fired when the user cancels the dialog. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user completes the step. 
   */
  settingsUpdated: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user changes the type. 
   */
  contactSelected: EventEmitter<CustomEvent<IVerdocsTemplateRecipientsIContactSelectEvent>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['contactSuggestions', 'endpoint', 'templateRole']
})
@Component({
  selector: 'verdocs-template-recipients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['contactSuggestions', 'endpoint', 'templateRole']
})
export class VerdocsTemplateRecipients {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchContacts', 'cancel', 'settingsUpdated', 'contactSelected']);
  }
}

import type { TemplateSenderTypes as IVerdocsTemplateSenderDialogTemplateSenderTypes } from '@verdocs/web-sdk';
export declare interface VerdocsTemplateSenderDialog extends Components.VerdocsTemplateSenderDialog {
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  done: EventEmitter<CustomEvent<{sender: IVerdocsTemplateSenderDialogTemplateSenderTypes}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['open', 'value']
})
@Component({
  selector: 'verdocs-template-sender-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['open', 'value']
})
export class VerdocsTemplateSenderDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'done']);
  }
}


export declare interface VerdocsTemplateTags extends Components.VerdocsTemplateTags {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['tags']
})
@Component({
  selector: 'verdocs-template-tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['tags']
})
export class VerdocsTemplateTags {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTextInput extends Components.VerdocsTextInput {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['autocomplete', 'disabled', 'label', 'placeholder', 'type', 'value']
})
@Component({
  selector: 'verdocs-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autocomplete', 'disabled', 'label', 'placeholder', 'type', 'value']
})
export class VerdocsTextInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsToggle extends Components.VerdocsToggle {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['options', 'theme']
})
@Component({
  selector: 'verdocs-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['options', 'theme']
})
export class VerdocsToggle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsToggleButton extends Components.VerdocsToggleButton {
  /**
   * Event fired when the button is pressed. 
   */
  toggle: EventEmitter<CustomEvent<{active: boolean}>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['active', 'icon', 'label', 'size']
})
@Component({
  selector: 'verdocs-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'icon', 'label', 'size']
})
export class VerdocsToggleButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['toggle']);
  }
}


export declare interface VerdocsToolbarIcon extends Components.VerdocsToolbarIcon {
  /**
   * Triggered when the icon is pressed 
   */
  press: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['icon', 'text']
})
@Component({
  selector: 'verdocs-toolbar-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['icon', 'text']
})
export class VerdocsToolbarIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['press']);
  }
}

import type { FileWithData as IVerdocsUploadDialogFileWithData } from '@verdocs/web-sdk';
export declare interface VerdocsUploadDialog extends Components.VerdocsUploadDialog {
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  done: EventEmitter<CustomEvent<FileWithData[]>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['open']
})
@Component({
  selector: 'verdocs-upload-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['open']
})
export class VerdocsUploadDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'done']);
  }
}

import type { IPageRenderEvent as IVerdocsViewIPageRenderEvent } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsViewSDKError } from '@verdocs/web-sdk';
export declare interface VerdocsView extends Components.VerdocsView {
  /**
   * Fired when a page has been rendered 
   */
  pageRendered: EventEmitter<CustomEvent<IVerdocsViewIPageRenderEvent>>;
  /**
   * Fired when a page has been changed 
   */
  pageLoaded: EventEmitter<CustomEvent<number>>;
  /**
   * Fired when a page has been changed 
   */
  pageChange: EventEmitter<CustomEvent<number>>;
  /**
   * Fired when a page has been initialized 
   */
  pageInit: EventEmitter<CustomEvent<number>>;
  /**
   * Fired when a page has been scaled 
   */
  scaleChange: EventEmitter<CustomEvent<number>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component. 
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsViewSDKError>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['endpoint', 'pageLayers', 'rotation', 'source']
})
@Component({
  selector: 'verdocs-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'pageLayers', 'rotation', 'source']
})
export class VerdocsView {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered', 'pageLoaded', 'pageChange', 'pageInit', 'scaleChange', 'sdkError']);
  }
}
