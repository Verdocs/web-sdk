/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';



import type { IAuthStatus as IVerdocsAuthIAuthStatus } from '@verdocs/web-sdk';
export declare interface VerdocsAuth extends Components.VerdocsAuth {
  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status. 
   */
  authenticated: EventEmitter<CustomEvent<IVerdocsAuthIAuthStatus>>;

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
    proxyOutputs(this, this.el, ['authenticated']);
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
  inputs: ['disabled', 'field', 'order', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'field', 'order', 'required', 'value']
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
  fieldChange: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'order', 'required', 'value']
})
@Component({
  selector: 'verdocs-field-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'order', 'required', 'value']
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

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'order', 'placeholder', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'order', 'placeholder', 'required', 'value']
})
export class VerdocsFieldDate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput']);
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
  inputs: ['disabled', 'options', 'order', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'options', 'order', 'required', 'value']
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

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['fullName', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-initial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['fullName', 'required', 'value']
})
export class VerdocsFieldInitial {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'cancel']);
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
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'field', 'fieldId', 'fields', 'focused', 'pageNum', 'pdfPages', 'recipients', 'roleName', 'selectedRoleName', 'signed']
})
@Component({
  selector: 'verdocs-field-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'field', 'fieldId', 'fields', 'focused', 'pageNum', 'pdfPages', 'recipients', 'roleName', 'selectedRoleName', 'signed']
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
  fieldChange: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['checked', 'disabled', 'name', 'order', 'required', 'value']
})
@Component({
  selector: 'verdocs-field-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['checked', 'disabled', 'name', 'order', 'required', 'value']
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

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['field', 'recipient'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-signature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['field', 'recipient']
})
export class VerdocsFieldSignature {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange']);
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
  inputs: ['disabled', 'order', 'placeholder', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'order', 'placeholder', 'required', 'value']
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

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['field'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-textbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['field']
})
export class VerdocsFieldTextbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput']);
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

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['field'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-field-timestamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['field']
})
export class VerdocsFieldTimestamp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldFocus', 'fieldBlur', 'fieldChange', 'fieldInput']);
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
  inputs: ['fullname', 'open']
})
@Component({
  selector: 'verdocs-initial-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['fullname', 'open']
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
  inputs: ['endpoint', 'placeholder', 'query', 'type']
})
@Component({
  selector: 'verdocs-search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['endpoint', 'placeholder', 'query', 'type']
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


export declare interface VerdocsSign extends Components.VerdocsSign {}

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
  inputs: ['fullName', 'open']
})
@Component({
  selector: 'verdocs-signature-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['fullName', 'open']
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


export declare interface VerdocsTextInput extends Components.VerdocsTextInput {
  /**
   * Event fired when the input value changes. 
   */
  fieldInput: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the field receives focus. 
   */
  fieldFocus: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field loses focus. 
   */
  fieldBlur: EventEmitter<CustomEvent<any>>;

}

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
    proxyOutputs(this, this.el, ['fieldInput', 'fieldFocus', 'fieldBlur']);
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
    proxyOutputs(this, this.el, ['pageRendered', 'pageLoaded', 'pageChange', 'pageInit', 'scaleChange']);
  }
}
