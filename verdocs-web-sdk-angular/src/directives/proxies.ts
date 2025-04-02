/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';


@ProxyCmp({
  inputs: ['displayMode', 'endpoint', 'logo', 'visible']
})
@Component({
  selector: 'verdocs-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['displayMode', 'endpoint', 'logo', 'visible'],
})
export class VerdocsAuth {
  protected el: HTMLVerdocsAuthElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['authenticated', 'sdkError']);
  }
}


import type { IAuthStatus as IVerdocsAuthIAuthStatus } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsAuthSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsAuth extends Components.VerdocsAuth {
  /**
   * Event fired when session authentication process has completed. Check the event
contents for completion status. This event will always be called at least once,
when the component is first rendered.
   */
  authenticated: EventEmitter<CustomEvent<IVerdocsAuthIAuthStatus>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsAuthSDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'step', 'templateId']
})
@Component({
  selector: 'verdocs-build',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'step', 'templateId'],
})
export class VerdocsBuild {
  protected el: HTMLVerdocsBuildElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['cancel', 'sdkError', 'stepChanged', 'send', 'templateUpdated', 'templateCreated', 'rolesUpdated']);
  }
}


import type { SDKError as IVerdocsBuildSDKError } from '@verdocs/web-sdk';
import type { TVerdocsBuildStep as IVerdocsBuildTVerdocsBuildStep } from '@verdocs/web-sdk';
import type { ICreateEnvelopeRecipient as IVerdocsBuildICreateEnvelopeRecipient } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsBuildVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsBuildITemplate } from '@verdocs/web-sdk';
import type { IRole as IVerdocsBuildIRole } from '@verdocs/web-sdk';

export declare interface VerdocsBuild extends Components.VerdocsBuild {
  /**
   * Event fired if the user clicks Cancel.
   */
  cancel: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsBuildSDKError>>;
  /**
   * Event fired when the user selects a different step.
   */
  stepChanged: EventEmitter<CustomEvent<IVerdocsBuildTVerdocsBuildStep>>;
  /**
   * The user completed the Send form and clicked send.
   */
  send: EventEmitter<CustomEvent<{recipients: IVerdocsBuildICreateEnvelopeRecipient[]; name: string; template_id: string}>>;
  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  templateUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsBuildVerdocsEndpoint; template: IVerdocsBuildITemplate; event: string}>>;
  /**
   * Event fired when the template is created by the upload step.
   */
  templateCreated: EventEmitter<CustomEvent<{endpoint: IVerdocsBuildVerdocsEndpoint; template: IVerdocsBuildITemplate; event: string}>>;
  /**
   * Event fired when roles are updated in the roles step.
   */
  rolesUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsBuildVerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: IVerdocsBuildIRole[]}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'endIcon', 'label', 'size', 'startIcon', 'type', 'variant']
})
@Component({
  selector: 'verdocs-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'endIcon', 'label', 'size', 'startIcon', 'type', 'variant'],
})
export class VerdocsButton {
  protected el: HTMLVerdocsButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsButton extends Components.VerdocsButton {}


@ProxyCmp({
  inputs: ['icon'],
  methods: ['showPanel', 'hidePanel', 'toggle']
})
@Component({
  selector: 'verdocs-button-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['icon'],
})
export class VerdocsButtonPanel {
  protected el: HTMLVerdocsButtonPanelElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsButtonPanel extends Components.VerdocsButtonPanel {}


@ProxyCmp({
  inputs: ['checked', 'disabled', 'label', 'name', 'size', 'theme', 'value']
})
@Component({
  selector: 'verdocs-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'label', 'name', 'size', 'theme', 'value'],
})
export class VerdocsCheckbox {
  protected el: HTMLVerdocsCheckboxElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsCheckbox extends Components.VerdocsCheckbox {}


@ProxyCmp({
  inputs: ['message']
})
@Component({
  selector: 'verdocs-component-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['message'],
})
export class VerdocsComponentError {
  protected el: HTMLVerdocsComponentErrorElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsComponentError extends Components.VerdocsComponentError {}


@ProxyCmp({
  inputs: ['contactSuggestions', 'endpoint', 'templateRole']
})
@Component({
  selector: 'verdocs-contact-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['contactSuggestions', 'endpoint', 'templateRole'],
})
export class VerdocsContactPicker {
  protected el: HTMLVerdocsContactPickerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchContacts', 'exit', 'next']);
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
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user changes the type.
   */
  next: EventEmitter<CustomEvent<IVerdocsContactPickerIContactSelectEvent>>;
}


@ProxyCmp({
  inputs: ['disabled', 'helpText', 'label', 'placeholder', 'required', 'value'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-date-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'helpText', 'label', 'placeholder', 'required', 'value'],
})
export class VerdocsDateInput {
  protected el: HTMLVerdocsDateInputElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsDateInput extends Components.VerdocsDateInput {}


@ProxyCmp({
})
@Component({
  selector: 'verdocs-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class VerdocsDialog {
  protected el: HTMLVerdocsDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit']);
  }
}


export declare interface VerdocsDialog extends Components.VerdocsDialog {
  /**
   * Event fired when the dialog is dismissed by clicking the background overlay.
   */
  exit: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['options']
})
@Component({
  selector: 'verdocs-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['options'],
})
export class VerdocsDropdown {
  protected el: HTMLVerdocsDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
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
  inputs: ['documentId', 'endpoint', 'envelopeId', 'layers', 'pageNumber', 'type', 'virtualHeight', 'virtualWidth']
})
@Component({
  selector: 'verdocs-envelope-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['documentId', 'endpoint', 'envelopeId', 'layers', 'pageNumber', 'type', 'virtualHeight', 'virtualWidth'],
})
export class VerdocsEnvelopeDocumentPage {
  protected el: HTMLVerdocsEnvelopeDocumentPageElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered']);
  }
}


import type { IDocumentPageInfo as IVerdocsEnvelopeDocumentPageIDocumentPageInfo } from '@verdocs/web-sdk';

export declare interface VerdocsEnvelopeDocumentPage extends Components.VerdocsEnvelopeDocumentPage {
  /**
   * Fired when a page has been rendered. This is also fired when the page is resized.
   */
  pageRendered: EventEmitter<CustomEvent<IVerdocsEnvelopeDocumentPageIDocumentPageInfo>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'envelopeId', 'roleName']
})
@Component({
  selector: 'verdocs-envelope-recipient-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'envelopeId', 'roleName'],
})
export class VerdocsEnvelopeRecipientLink {
  protected el: HTMLVerdocsEnvelopeRecipientLinkElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'sdkError']);
  }
}


import type { IEnvelope as IVerdocsEnvelopeRecipientLinkIEnvelope } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsEnvelopeRecipientLinkSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsEnvelopeRecipientLink extends Components.VerdocsEnvelopeRecipientLink {
  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  next: EventEmitter<CustomEvent<{envelope: IVerdocsEnvelopeRecipientLinkIEnvelope}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientLinkSDKError>>;
}


@ProxyCmp({
  inputs: ['canDone', 'canSendAnother', 'canView', 'endpoint', 'envelopeId']
})
@Component({
  selector: 'verdocs-envelope-recipient-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['canDone', 'canSendAnother', 'canView', 'endpoint', 'envelopeId'],
})
export class VerdocsEnvelopeRecipientSummary {
  protected el: HTMLVerdocsEnvelopeRecipientSummaryElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['another', 'view', 'next', 'sdkError']);
  }
}


import type { IEnvelope as IVerdocsEnvelopeRecipientSummaryIEnvelope } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsEnvelopeRecipientSummarySDKError } from '@verdocs/web-sdk';

export declare interface VerdocsEnvelopeRecipientSummary extends Components.VerdocsEnvelopeRecipientSummary {
  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  another: EventEmitter<CustomEvent<{envelope: IVerdocsEnvelopeRecipientSummaryIEnvelope}>>;
  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  view: EventEmitter<CustomEvent<{envelope: IVerdocsEnvelopeRecipientSummaryIEnvelope}>>;
  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  next: EventEmitter<CustomEvent<{envelope: IVerdocsEnvelopeRecipientSummaryIEnvelope}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientSummarySDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'envelopeId']
})
@Component({
  selector: 'verdocs-envelope-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'envelopeId'],
})
export class VerdocsEnvelopeSidebar {
  protected el: HTMLVerdocsEnvelopeSidebarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'envelopeUpdated', 'toggle', 'another']);
  }
}


import type { SDKError as IVerdocsEnvelopeSidebarSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsEnvelopeSidebarVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsEnvelopeSidebarIEnvelope } from '@verdocs/web-sdk';

export declare interface VerdocsEnvelopeSidebar extends Components.VerdocsEnvelopeSidebar {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsEnvelopeSidebarSDKError>>;
  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  envelopeUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsEnvelopeSidebarVerdocsEndpoint; envelope: IVerdocsEnvelopeSidebarIEnvelope; event: string}>>;
  /**
   * Event fired when the sidebar is opened or closed.
   */
  toggle: EventEmitter<CustomEvent<{open: boolean}>>;
  /**
   * Event fired when the user clicks Send Another in the Manage Recipients dialog. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  another: EventEmitter<CustomEvent<{envelope: IVerdocsEnvelopeSidebarIEnvelope}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'match', 'rowsPerPage', 'selectedPage', 'showPagination', 'sort', 'status', 'view']
})
@Component({
  selector: 'verdocs-envelopes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'match', 'rowsPerPage', 'selectedPage', 'showPagination', 'sort', 'status', 'view'],
})
export class VerdocsEnvelopesList {
  protected el: HTMLVerdocsEnvelopesListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['changeView', 'changeStatus', 'changeSort', 'changeMatch', 'sdkError', 'viewEnvelope', 'finishEnvelope']);
  }
}


import type { TEnvelopeStatus as IVerdocsEnvelopesListTEnvelopeStatus } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsEnvelopesListSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsEnvelopesListVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsEnvelopesListIEnvelope } from '@verdocs/web-sdk';

export declare interface VerdocsEnvelopesList extends Components.VerdocsEnvelopesList {
  /**
   * Event fired when the user changes their view. Host applications can use this to save the user's preferences.
   */
  changeView: EventEmitter<CustomEvent<'all' | 'inbox' | 'sent' | 'completed' | 'action' | 'waiting'>>;
  /**
   * Event fired when the user changes their status filter. Host applications can use this to save the user's preferences.
   */
  changeStatus: EventEmitter<CustomEvent<IVerdocsEnvelopesListTEnvelopeStatus | 'all'>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeSort: EventEmitter<CustomEvent<'name' | 'created_at' | 'updated_at' | 'canceled_at' | 'status'>>;
  /**
   * Event fired when the user changes the match filter. This is fired for every inputChange event (every character
typed). This event is provided for balance with the other events, but host applications should generally not
save this value. Users might appreciate applications remembering their sorting or filtering preferences, but
probably not their search terms.
   */
  changeMatch: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsEnvelopesListSDKError>>;
  /**
   * Event fired when the user clicks an activity entry. Typically the host application will use this to navigate
to the envelope detail view.
   */
  viewEnvelope: EventEmitter<CustomEvent<{endpoint: IVerdocsEnvelopesListVerdocsEndpoint; envelope: IVerdocsEnvelopesListIEnvelope}>>;
  /**
   * Event fired when the user clicks to finish the envelope.
   */
  finishEnvelope: EventEmitter<CustomEvent<{endpoint: IVerdocsEnvelopesListVerdocsEndpoint; envelope: IVerdocsEnvelopesListIEnvelope}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldAttachment {
  protected el: HTMLVerdocsFieldAttachmentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'attached', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldAttachmentITemplateField } from '@verdocs/web-sdk';
import type { ISelectedFile as IVerdocsFieldAttachmentISelectedFile } from '@verdocs/web-sdk';

export declare interface VerdocsFieldAttachment extends Components.VerdocsFieldAttachment {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldAttachmentITemplateField}>>;
  /**
   * Event fired when a file is attached by the signer.
   */
  attached: EventEmitter<CustomEvent<IVerdocsFieldAttachmentISelectedFile>>;
  /**
   * Event fired when the field is deleted. Note that this is for the FIELD (e.g. in
Build) not for any attachments (during signing).
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldCheckbox {
  protected el: HTMLVerdocsFieldCheckboxElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldCheckboxITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldCheckbox extends Components.VerdocsFieldCheckbox {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldCheckboxITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldDate {
  protected el: HTMLVerdocsFieldDateElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsPress', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldDateITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldDate extends Components.VerdocsFieldDate {
  /**
   * Event fired on every character entered into / deleted from the field.
   */
  settingsPress: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldDateITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldDropdown {
  protected el: HTMLVerdocsFieldDropdownElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldDropdownITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldDropdown extends Components.VerdocsFieldDropdown {
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress.
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldDropdownITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'initials', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-initial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'initials', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldInitial {
  protected el: HTMLVerdocsFieldInitialElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'exit', 'fieldChange', 'settingsChanged', 'settingsPress', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldInitialITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldInitial extends Components.VerdocsFieldInitial {
  /**
   * Event emitted when an initial block is adopted by the user. The event detail will contain the base64 string of the initial image.
   */
  adopt: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the input field value changes. Note that this will only be fired on blur, tab-out, ENTER key press, etc.
It is generally the best event to subscribe to than `input` for most cases EXCEPT autocomplete fields that need to see every
keypress.
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldInitialITemplateField}>>;
  /**
   * Event fired on every character entered into / deleted from the field.
   */
  settingsPress: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'done', 'editable', 'field', 'fieldId', 'fieldname', 'fields', 'moveable', 'pageNum', 'pagenumber', 'pdfPages', 'recipients', 'roleName', 'roleindex', 'selectedRoleName', 'signed', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'done', 'editable', 'field', 'fieldId', 'fieldname', 'fields', 'moveable', 'pageNum', 'pagenumber', 'pdfPages', 'recipients', 'roleName', 'roleindex', 'selectedRoleName', 'signed', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldPayment {
  protected el: HTMLVerdocsFieldPaymentElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldPaymentITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldPayment extends Components.VerdocsFieldPayment {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldPaymentITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'required', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'required', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldRadio {
  protected el: HTMLVerdocsFieldRadioElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldRadioITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldRadio extends Components.VerdocsFieldRadio {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldRadioITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'name', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-signature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'name', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldSignature {
  protected el: HTMLVerdocsFieldSignatureElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange', 'settingsPress', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldSignatureITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldSignature extends Components.VerdocsFieldSignature {
  /**
   * Event emitted when the field has changed.
   */
  fieldChange: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired on every character entered into / deleted from the field.
   */
  settingsPress: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldSignatureITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldTextarea {
  protected el: HTMLVerdocsFieldTextareaElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldTextareaITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTextarea extends Components.VerdocsFieldTextarea {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldTextareaITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'multiline', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-textbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'multiline', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldTextbox {
  protected el: HTMLVerdocsFieldTextboxElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldTextboxITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTextbox extends Components.VerdocsFieldTextbox {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldTextboxITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-timestamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'source', 'sourceid', 'xscale', 'yscale'],
})
export class VerdocsFieldTimestamp {
  protected el: HTMLVerdocsFieldTimestampElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateField as IVerdocsFieldTimestampITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTimestamp extends Components.VerdocsFieldTimestamp {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsFieldTimestampITemplateField}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-file-chooser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsFileChooser {
  protected el: HTMLVerdocsFileChooserElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fileSelected']);
  }
}


export declare interface VerdocsFileChooser extends Components.VerdocsFileChooser {
  /**
   * Event fired when a file has been selected. Note that the file may be null if the user is choosing a different file.
Host applications should use this event to enable/disable buttons to upload or otherwise process the selected file.
   */
  fileSelected: EventEmitter<CustomEvent<{file: File | null}>>;
}


@ProxyCmp({
  inputs: ['icon', 'text']
})
@Component({
  selector: 'verdocs-help-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['icon', 'text'],
})
export class VerdocsHelpIcon {
  protected el: HTMLVerdocsHelpIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsHelpIcon extends Components.VerdocsHelpIcon {}


@ProxyCmp({
  inputs: ['initials']
})
@Component({
  selector: 'verdocs-initial-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['initials'],
})
export class VerdocsInitialDialog {
  protected el: HTMLVerdocsInitialDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'exit']);
  }
}


export declare interface VerdocsInitialDialog extends Components.VerdocsInitialDialog {
  /**
   * Event fired when the initials are adopted.
   */
  next: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'placeholder', 'recipient', 'step', 'steps']
})
@Component({
  selector: 'verdocs-kba-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'placeholder', 'recipient', 'step', 'steps'],
})
export class VerdocsKbaDialog {
  protected el: HTMLVerdocsKbaDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'pinEntered', 'next']);
  }
}


import type { IRecipient as IVerdocsKbaDialogIRecipient } from '@verdocs/web-sdk';

export declare interface VerdocsKbaDialog extends Components.VerdocsKbaDialog {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the value selected,
or the new recipient details if the mode is 'identity'.
   */
  pinEntered: EventEmitter<CustomEvent<IVerdocsKbaDialogstring | IRecipient>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the value selected,
or the new recipient details if the mode is 'identity'.
   */
  next: EventEmitter<CustomEvent<IVerdocsKbaDialogstring | IVerdocsKbaDialogIRecipient | string[]>>;
}


@ProxyCmp({
})
@Component({
  selector: 'verdocs-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class VerdocsLoader {
  protected el: HTMLVerdocsLoaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsLoader extends Components.VerdocsLoader {}


@ProxyCmp({
  inputs: ['overlay', 'side', 'width']
})
@Component({
  selector: 'verdocs-menu-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['overlay', 'side', 'width'],
})
export class VerdocsMenuPanel {
  protected el: HTMLVerdocsMenuPanelElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close']);
  }
}


export declare interface VerdocsMenuPanel extends Components.VerdocsMenuPanel {

  close: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  inputs: ['label', 'options', 'placeholder', 'selectedOptions']
})
@Component({
  selector: 'verdocs-multiselect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'options', 'placeholder', 'selectedOptions'],
})
export class VerdocsMultiselect {
  protected el: HTMLVerdocsMultiselectElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectionChanged']);
  }
}


export declare interface VerdocsMultiselect extends Components.VerdocsMultiselect {

  selectionChanged: EventEmitter<CustomEvent<{selectedOptions: string[]}>>;
}


@ProxyCmp({
  inputs: ['buttonLabel', 'heading', 'message', 'showCancel']
})
@Component({
  selector: 'verdocs-ok-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['buttonLabel', 'heading', 'message', 'showCancel'],
})
export class VerdocsOkDialog {
  protected el: HTMLVerdocsOkDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'exit']);
  }
}


export declare interface VerdocsOkDialog extends Components.VerdocsOkDialog {
  /**
   * Event fired when the user clicks the OK button.
   */
  next: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['organization']
})
@Component({
  selector: 'verdocs-organization-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['organization'],
})
export class VerdocsOrganizationCard {
  protected el: HTMLVerdocsOrganizationCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsOrganizationCard extends Components.VerdocsOrganizationCard {}


@ProxyCmp({
  inputs: ['endpoint', 'method', 'recipient']
})
@Component({
  selector: 'verdocs-otp-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'method', 'recipient'],
})
export class VerdocsOtpDialog {
  protected el: HTMLVerdocsOtpDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next']);
  }
}


import type { ISignerTokenResponse as IVerdocsOtpDialogISignerTokenResponse } from '@verdocs/web-sdk';

export declare interface VerdocsOtpDialog extends Components.VerdocsOtpDialog {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the process has completed successfully.
   */
  next: EventEmitter<CustomEvent<{response: IVerdocsOtpDialogISignerTokenResponse}>>;
}


@ProxyCmp({
  inputs: ['itemCount', 'perPage', 'selectedPage']
})
@Component({
  selector: 'verdocs-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['itemCount', 'perPage', 'selectedPage'],
})
export class VerdocsPagination {
  protected el: HTMLVerdocsPaginationElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectPage']);
  }
}


export declare interface VerdocsPagination extends Components.VerdocsPagination {
  /**
   * Event fired when the selected page changes. The new page number is included in the event.
   */
  selectPage: EventEmitter<CustomEvent<{selectedPage: number}>>;
}


@ProxyCmp({
  inputs: ['anchor', 'voffset']
})
@Component({
  selector: 'verdocs-portal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['anchor', 'voffset'],
})
export class VerdocsPortal {
  protected el: HTMLVerdocsPortalElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['clickAway']);
  }
}


export declare interface VerdocsPortal extends Components.VerdocsPortal {

  clickAway: EventEmitter<CustomEvent<void>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsPreview {
  protected el: HTMLVerdocsPreviewElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError']);
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
  inputs: ['label', 'percent', 'showPercent']
})
@Component({
  selector: 'verdocs-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'percent', 'showPercent'],
})
export class VerdocsProgressBar {
  protected el: HTMLVerdocsProgressBarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsProgressBar extends Components.VerdocsProgressBar {}


@ProxyCmp({
  inputs: ['label', 'options', 'placeholder', 'value']
})
@Component({
  selector: 'verdocs-quick-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', 'options', 'placeholder', 'value'],
})
export class VerdocsQuickFilter {
  protected el: HTMLVerdocsQuickFilterElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


import type { IFilterOption as IVerdocsQuickFilterIFilterOption } from '@verdocs/web-sdk';

export declare interface VerdocsQuickFilter extends Components.VerdocsQuickFilter {
  /**
   * Event fired when a menu option is clicked.
Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  optionSelected: EventEmitter<CustomEvent<IVerdocsQuickFilterIFilterOption>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-quick-functions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsQuickFunctions {
  protected el: HTMLVerdocsQuickFunctionsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['createTemplate', 'createDocument']);
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
  inputs: ['checked', 'disabled', 'name', 'value']
})
@Component({
  selector: 'verdocs-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'name', 'value'],
})
export class VerdocsRadioButton {
  protected el: HTMLVerdocsRadioButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsRadioButton extends Components.VerdocsRadioButton {}


@ProxyCmp({
  inputs: ['endpoint', 'grabsFocus', 'placeholder', 'query', 'type'],
  methods: ['focusField']
})
@Component({
  selector: 'verdocs-search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'grabsFocus', 'placeholder', 'query', 'type'],
})
export class VerdocsSearchBox {
  protected el: HTMLVerdocsSearchBoxElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchClicked', 'typeChanged', 'queryChanged']);
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
})
@Component({
  selector: 'verdocs-search-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class VerdocsSearchTabs {
  protected el: HTMLVerdocsSearchTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSearchTabs extends Components.VerdocsSearchTabs {}


@ProxyCmp({
  inputs: ['disabled', 'label', 'options', 'value']
})
@Component({
  selector: 'verdocs-select-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'label', 'options', 'value'],
})
export class VerdocsSelectInput {
  protected el: HTMLVerdocsSelectInputElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSelectInput extends Components.VerdocsSelectInput {}


@ProxyCmp({
  inputs: ['endpoint', 'environment', 'templateId'],
  methods: ['reset']
})
@Component({
  selector: 'verdocs-send',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'environment', 'templateId'],
})
export class VerdocsSend {
  protected el: HTMLVerdocsSendElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['beforeSend', 'send', 'exit', 'sdkError', 'searchContacts']);
  }
}


import type { ICreateEnvelopeRecipient as IVerdocsSendICreateEnvelopeRecipient } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsSendITemplate } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsSendIEnvelope } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsSendSDKError } from '@verdocs/web-sdk';
import type { IContactSearchEvent as IVerdocsSendIContactSearchEvent } from '@verdocs/web-sdk';

export declare interface VerdocsSend extends Components.VerdocsSend {
  /**
   * The user is sending an envelope the form and clicked send.
   */
  beforeSend: EventEmitter<CustomEvent<{recipients: IVerdocsSendICreateEnvelopeRecipient[]; name: string; template_id: string; template: IVerdocsSendITemplate}>>;
  /**
   * The user completed the form and clicked send.
   */
  send: EventEmitter<CustomEvent<{recipients: IVerdocsSendICreateEnvelopeRecipient[]; name: string; template_id: string; envelope_id: string; envelope: IVerdocsSendIEnvelope}>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSendSDKError>>;
  /**
   * Event fired when the user enters text in a search field. The parent application may use this to update
the `contactSuggestions` property.
   */
  searchContacts: EventEmitter<CustomEvent<IVerdocsSendIContactSearchEvent>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'envelopeId', 'headerTargetId', 'inviteCode', 'roleId']
})
@Component({
  selector: 'verdocs-sign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'envelopeId', 'headerTargetId', 'inviteCode', 'roleId'],
})
export class VerdocsSign {
  protected el: HTMLVerdocsSignElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'envelopeLoaded', 'envelopeUpdated']);
  }
}


import type { SDKError as IVerdocsSignSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsSignVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsSignIEnvelope } from '@verdocs/web-sdk';

export declare interface VerdocsSign extends Components.VerdocsSign {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSignSDKError>>;
  /**
   * Event fired when the envelope is updated in any way.
   */
  envelopeLoaded: EventEmitter<CustomEvent<{endpoint: IVerdocsSignVerdocsEndpoint; envelope: IVerdocsSignIEnvelope}>>;
  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  envelopeUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsSignVerdocsEndpoint; envelope: IVerdocsSignIEnvelope; event: string}>>;
}


@ProxyCmp({
  inputs: ['name']
})
@Component({
  selector: 'verdocs-signature-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['name'],
})
export class VerdocsSignatureDialog {
  protected el: HTMLVerdocsSignatureDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'exit']);
  }
}


export declare interface VerdocsSignatureDialog extends Components.VerdocsSignatureDialog {
  /**
   * Fired when the user completes the dialog and clicks Adopt. The event detail will contain a base64-encoded string
representation of the signature adopted.
   */
  next: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['mode', 'size']
})
@Component({
  selector: 'verdocs-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['mode', 'size'],
})
export class VerdocsSpinner {
  protected el: HTMLVerdocsSpinnerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSpinner extends Components.VerdocsSpinner {}


@ProxyCmp({
  inputs: ['envelope', 'size', 'status', 'theme']
})
@Component({
  selector: 'verdocs-status-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['envelope', 'size', 'status', 'theme'],
})
export class VerdocsStatusIndicator {
  protected el: HTMLVerdocsStatusIndicatorElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsStatusIndicator extends Components.VerdocsStatusIndicator {}


@ProxyCmp({
  inputs: ['checked', 'disabled', 'theme']
})
@Component({
  selector: 'verdocs-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'theme'],
})
export class VerdocsSwitch {
  protected el: HTMLVerdocsSwitchElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['checkedChange']);
  }
}


export declare interface VerdocsSwitch extends Components.VerdocsSwitch {

  checkedChange: EventEmitter<CustomEvent<boolean>>;
}


@ProxyCmp({
  inputs: ['columns', 'data']
})
@Component({
  selector: 'verdocs-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns', 'data'],
})
export class VerdocsTable {
  protected el: HTMLVerdocsTableElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['colHeaderClick', 'rowClick']);
  }
}


import type { IColumn as IVerdocsTableIColumn } from '@verdocs/web-sdk';

export declare interface VerdocsTable extends Components.VerdocsTable {
  /**
   * Event fired when the user clicks a column header. This may be used to manage sorting options.
   */
  colHeaderClick: EventEmitter<CustomEvent<{col: [object Object]}>>;
  /**
   * Event fired when the user clicks a row.
   */
  rowClick: EventEmitter<CustomEvent<{row: any}>>;
}


@ProxyCmp({
  inputs: ['selectedTab', 'tabs']
})
@Component({
  selector: 'verdocs-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['selectedTab', 'tabs'],
})
export class VerdocsTabs {
  protected el: HTMLVerdocsTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['selectTab']);
  }
}


import type { ITab as IVerdocsTabsITab } from '@verdocs/web-sdk';

export declare interface VerdocsTabs extends Components.VerdocsTabs {
  /**
   * Event fired when the user clicks a template to view it. Typically the host application will use this to navigate
to the template preview. This is also fired when the user selects "Preview/Send" fropm the dropdown menu.
   */
  selectTab: EventEmitter<CustomEvent<{tab: [object Object]; index: number}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-attachments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateAttachments {
  protected el: HTMLVerdocsTemplateAttachmentsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next', 'templateUpdated', 'sdkError']);
  }
}


import type { ITemplate as IVerdocsTemplateAttachmentsITemplate } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateAttachmentsVerdocsEndpoint } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsTemplateAttachmentsSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateAttachments extends Components.VerdocsTemplateAttachments {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user clicks the next button.
   */
  next: EventEmitter<CustomEvent<{template: IVerdocsTemplateAttachmentsITemplate}>>;
  /**
   * Event fired when the user updates the template.
   */
  templateUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateAttachmentsVerdocsEndpoint; template: IVerdocsTemplateAttachmentsITemplate; event: string}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateAttachmentsSDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'step', 'templateId']
})
@Component({
  selector: 'verdocs-template-build-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'step', 'templateId'],
})
export class VerdocsTemplateBuildTabs {
  protected el: HTMLVerdocsTemplateBuildTabsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'stepChanged']);
  }
}


import type { SDKError as IVerdocsTemplateBuildTabsSDKError } from '@verdocs/web-sdk';
import type { TVerdocsBuildStep as IVerdocsTemplateBuildTabsTVerdocsBuildStep } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateBuildTabs extends Components.VerdocsTemplateBuildTabs {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateBuildTabsSDKError>>;
  /**
   * Event fired when the user selects a different step.
   */
  stepChanged: EventEmitter<CustomEvent<IVerdocsTemplateBuildTabsTVerdocsBuildStep>>;
}


@ProxyCmp({
  inputs: ['template']
})
@Component({
  selector: 'verdocs-template-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['template'],
})
export class VerdocsTemplateCard {
  protected el: HTMLVerdocsTemplateCardElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTemplateCard extends Components.VerdocsTemplateCard {}


@ProxyCmp({
  inputs: ['endpoint', 'maxSize']
})
@Component({
  selector: 'verdocs-template-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'maxSize'],
})
export class VerdocsTemplateCreate {
  protected el: HTMLVerdocsTemplateCreateElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next', 'sdkError', 'templateCreated']);
  }
}


import type { ITemplate as IVerdocsTemplateCreateITemplate } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsTemplateCreateSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateCreateVerdocsEndpoint } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateCreate extends Components.VerdocsTemplateCreate {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user changes the type.
   */
  next: EventEmitter<CustomEvent<IVerdocsTemplateCreateITemplate>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateCreateSDKError>>;
  /**
   * Event fired when the user updates the template.
   */
  templateCreated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateCreateVerdocsEndpoint; template: IVerdocsTemplateCreateITemplate; templateId: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'documentId', 'done', 'editable', 'endpoint', 'layers', 'pageNumber', 'templateId', 'virtualHeight', 'virtualWidth']
})
@Component({
  selector: 'verdocs-template-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'documentId', 'done', 'editable', 'endpoint', 'layers', 'pageNumber', 'templateId', 'virtualHeight', 'virtualWidth'],
})
export class VerdocsTemplateDocumentPage {
  protected el: HTMLVerdocsTemplateDocumentPageElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered']);
  }
}


import type { IDocumentPageInfo as IVerdocsTemplateDocumentPageIDocumentPageInfo } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateDocumentPage extends Components.VerdocsTemplateDocumentPage {
  /**
   * Fired when a page has been rendered. This is also fired when the page is resized.
   */
  pageRendered: EventEmitter<CustomEvent<IVerdocsTemplateDocumentPageIDocumentPageInfo>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'fieldName', 'helpText', 'templateId']
})
@Component({
  selector: 'verdocs-template-field-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'fieldName', 'helpText', 'templateId'],
})
export class VerdocsTemplateFieldProperties {
  protected el: HTMLVerdocsTemplateFieldPropertiesElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'delete', 'settingsChanged', 'sdkError']);
  }
}


import type { ITemplateField as IVerdocsTemplateFieldPropertiesITemplateField } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsTemplateFieldPropertiesSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateFieldProperties extends Components.VerdocsTemplateFieldProperties {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user deletes the role. The parent should update its UI to reflect the removal. When this event is emitted,
the role will have already been deleted server-side.
   */
  delete: EventEmitter<CustomEvent<{templateId: string; roleName: string}>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<{fieldName: string; field: IVerdocsTemplateFieldPropertiesITemplateField}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateFieldPropertiesSDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId', 'toolbarTargetId']
})
@Component({
  selector: 'verdocs-template-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId', 'toolbarTargetId'],
})
export class VerdocsTemplateFields {
  protected el: HTMLVerdocsTemplateFieldsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'templateUpdated', 'fieldsUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateFieldsSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateFieldsVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplateFieldsITemplate } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsTemplateFieldsITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateFields extends Components.VerdocsTemplateFields {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateFieldsSDKError>>;
  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  templateUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateFieldsVerdocsEndpoint; template: IVerdocsTemplateFieldsITemplate; event: string}>>;

  fieldsUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateFieldsVerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; fields: IVerdocsTemplateFieldsITemplateField[]}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'roleName', 'templateId']
})
@Component({
  selector: 'verdocs-template-role-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'roleName', 'templateId'],
})
export class VerdocsTemplateRoleProperties {
  protected el: HTMLVerdocsTemplateRolePropertiesElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'delete', 'sdkError']);
  }
}


import type { SDKError as IVerdocsTemplateRolePropertiesSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateRoleProperties extends Components.VerdocsTemplateRoleProperties {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user deletes the role. The parent should update its UI to reflect the removal. When this event is emitted,
the role will have already been deleted server-side.
   */
  delete: EventEmitter<CustomEvent<{templateId: string; roleName: string}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateRolePropertiesSDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateRoles {
  protected el: HTMLVerdocsTemplateRolesElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'exit', 'sdkError', 'rolesUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateRolesSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateRolesVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IRole as IVerdocsTemplateRolesIRole } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateRoles extends Components.VerdocsTemplateRoles {
  /**
   * Event fired when the user clicks to proceed.
   */
  next: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateRolesSDKError>>;
  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  rolesUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateRolesVerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: IVerdocsTemplateRolesIRole[]}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateSettings {
  protected el: HTMLVerdocsTemplateSettingsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['next', 'exit', 'sdkError', 'templateUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateSettingsSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateSettingsVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplateSettingsITemplate } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateSettings extends Components.VerdocsTemplateSettings {
  /**
   * Event fired when the user clicks to proceed.
   */
  next: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateSettingsSDKError>>;
  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  templateUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplateSettingsVerdocsEndpoint; template: IVerdocsTemplateSettingsITemplate; event: string}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'template']
})
@Component({
  selector: 'verdocs-template-star',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'template'],
})
export class VerdocsTemplateStar {
  protected el: HTMLVerdocsTemplateStarElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['starChange', 'sdkError']);
  }
}


import type { SDKError as IVerdocsTemplateStarSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateStar extends Components.VerdocsTemplateStar {
  /**
   * Event fired when the user toggles the star on or off. The event detail will contain
the new "starred" status and count.
   */
  starChange: EventEmitter<CustomEvent<{templateId: string; starred: boolean; count: number}>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateStarSDKError>>;
}


@ProxyCmp({
  inputs: ['tags']
})
@Component({
  selector: 'verdocs-template-tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['tags'],
})
export class VerdocsTemplateTags {
  protected el: HTMLVerdocsTemplateTagsElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTemplateTags extends Components.VerdocsTemplateTags {}


@ProxyCmp({
  inputs: ['allowedActions', 'endpoint', 'name', 'rowsPerPage', 'selectedPage', 'showPagination', 'sort', 'starred', 'visibility']
})
@Component({
  selector: 'verdocs-templates-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['allowedActions', 'endpoint', 'name', 'rowsPerPage', 'selectedPage', 'showPagination', 'sort', 'starred', 'visibility'],
})
export class VerdocsTemplatesList {
  protected el: HTMLVerdocsTemplatesListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'viewTemplate', 'signNow', 'submittedData', 'editTemplate', 'templateDeleted', 'changeSort', 'changeVisibility', 'changeStarred', 'changeName']);
  }
}


import type { SDKError as IVerdocsTemplatesListSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplatesListVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplatesListITemplate } from '@verdocs/web-sdk';

export declare interface VerdocsTemplatesList extends Components.VerdocsTemplatesList {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplatesListSDKError>>;
  /**
   * Event fired when the user clicks a template to view it. Typically the host application will use this to navigate
to the template preview. This is also fired when the user selects "Preview/Send" fropm the dropdown menu.
   */
  viewTemplate: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplatesListVerdocsEndpoint; template: IVerdocsTemplatesListITemplate}>>;
  /**
   * Event fired when the user clicks to sign a template now.
   */
  signNow: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplatesListVerdocsEndpoint; template: IVerdocsTemplatesListITemplate}>>;
  /**
   * Event fired when the user clicks to sign a template now.
   */
  submittedData: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplatesListVerdocsEndpoint; template: IVerdocsTemplatesListITemplate}>>;
  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  editTemplate: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplatesListVerdocsEndpoint; template: IVerdocsTemplatesListITemplate}>>;
  /**
   * Event fired when the user chooses the Delete option from the dropdown menu. When this is fired, the template
will already have been deleted. The host application should remove it from the list or refresh the list.
   */
  templateDeleted: EventEmitter<CustomEvent<{endpoint: IVerdocsTemplatesListVerdocsEndpoint; template: IVerdocsTemplatesListITemplate}>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeSort: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeVisibility: EventEmitter<CustomEvent<'private_shared' | 'private' | 'shared' | 'public'>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeStarred: EventEmitter<CustomEvent<'all' | 'starred' | 'unstarred'>>;
  /**
   * Event fired when the user changes the name filter. This is fired for every inputChange event (every character
typed). This event is provided for balance with the other events, but host applications should generally not
save this value. Users might appreciate applications remembering their sorting or filtering preferences, but
probably not their search terms.
   */
  changeName: EventEmitter<CustomEvent<string>>;
}


@ProxyCmp({
  inputs: ['autocomplete', 'clearable', 'copyable', 'disabled', 'helpText', 'label', 'placeholder', 'required', 'type', 'value']
})
@Component({
  selector: 'verdocs-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['autocomplete', 'clearable', 'copyable', 'disabled', 'helpText', 'label', 'placeholder', 'required', 'type', 'value'],
})
export class VerdocsTextInput {
  protected el: HTMLVerdocsTextInputElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTextInput extends Components.VerdocsTextInput {}


@ProxyCmp({
  inputs: ['options', 'theme']
})
@Component({
  selector: 'verdocs-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['options', 'theme'],
})
export class VerdocsToggle {
  protected el: HTMLVerdocsToggleElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsToggle extends Components.VerdocsToggle {}


@ProxyCmp({
  inputs: ['active', 'icon', 'label', 'size']
})
@Component({
  selector: 'verdocs-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['active', 'icon', 'label', 'size'],
})
export class VerdocsToggleButton {
  protected el: HTMLVerdocsToggleButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['toggle']);
  }
}


export declare interface VerdocsToggleButton extends Components.VerdocsToggleButton {
  /**
   * Event fired when the button is pressed.
   */
  toggle: EventEmitter<CustomEvent<{active: boolean}>>;
}


@ProxyCmp({
  inputs: ['icon', 'placement', 'text']
})
@Component({
  selector: 'verdocs-toolbar-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['icon', 'placement', 'text'],
})
export class VerdocsToolbarIcon {
  protected el: HTMLVerdocsToolbarIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsToolbarIcon extends Components.VerdocsToolbarIcon {}


@ProxyCmp({
  inputs: ['existingFile', 'maxSize']
})
@Component({
  selector: 'verdocs-upload-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['existingFile', 'maxSize'],
})
export class VerdocsUploadDialog {
  protected el: HTMLVerdocsUploadDialogElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next', 'remove']);
  }
}


export declare interface VerdocsUploadDialog extends Components.VerdocsUploadDialog {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the file selected.
   */
  next: EventEmitter<CustomEvent<File[]>>;
  /**
   * Event fired when an existing attachment is deleted. The parent component is
responsible for the actual removal.
   */
  remove: EventEmitter<CustomEvent<any>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'envelopeId', 'headerTargetId']
})
@Component({
  selector: 'verdocs-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'envelopeId', 'headerTargetId'],
})
export class VerdocsView {
  protected el: HTMLVerdocsViewElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'envelopeUpdated', 'another', 'view', 'next']);
  }
}


import type { SDKError as IVerdocsViewSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsViewVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsViewIEnvelope } from '@verdocs/web-sdk';

export declare interface VerdocsView extends Components.VerdocsView {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsViewSDKError>>;
  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  envelopeUpdated: EventEmitter<CustomEvent<{endpoint: IVerdocsViewVerdocsEndpoint; envelope: IVerdocsViewIEnvelope; event: string}>>;
  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  another: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  view: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  next: EventEmitter<CustomEvent<any>>;
}


