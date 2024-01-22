/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'ipc-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class IpcTest {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IpcTest extends Components.IpcTest {}


@ProxyCmp({
  inputs: ['endpoint', 'header', 'items', 'view']
})
@Component({
  selector: 'verdocs-activity-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'header', 'items', 'view'],
})
export class VerdocsActivityBox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'viewEnvelope', 'viewAll']);
  }
}


import type { SDKError as IVerdocsActivityBoxSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsActivityBoxVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IActivityEntry as IVerdocsActivityBoxIActivityEntry } from '@verdocs/web-sdk';

export declare interface VerdocsActivityBox extends Components.VerdocsActivityBox {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsActivityBoxSDKError>>;
  /**
   * Event fired when the user clicks an activity entry. Typically the host application will use this to navigate
to the envelope detail view.
   */
  viewEnvelope: EventEmitter<CustomEvent<IVerdocsActivityBoxIVerdocsActivityBox{endpoint: [object Object]; entry: [object Object]}>>;
  /**
   * Event fired when the user clicks View All in the title bar. The current view will be included in the event
details to help the host application navigate the user to the appropriate screen for the request. Note that
the verdocs-envelopes-list control uses the same "view" parameter, so host applications can typically pass
this value through directly. This button is not visible if the header is hidden.
   */
  viewAll: EventEmitter<CustomEvent<IVerdocsActivityBox{endpoint: [object Object]; view: string}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'logo', 'visible']
})
@Component({
  selector: 'verdocs-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'logo', 'visible'],
})
export class VerdocsAuth {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'stepChanged', 'send', 'templateUpdated', 'templateCreated', 'rolesUpdated']);
  }
}


import type { SDKError as IVerdocsBuildSDKError } from '@verdocs/web-sdk';
import type { TVerdocsBuildStep as IVerdocsBuildTVerdocsBuildStep } from '@verdocs/web-sdk';
import type { ICreateEnvelopeRole as IVerdocsBuildICreateEnvelopeRole } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsBuildVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsBuildITemplate } from '@verdocs/web-sdk';
import type { IRole as IVerdocsBuildIRole } from '@verdocs/web-sdk';

export declare interface VerdocsBuild extends Components.VerdocsBuild {
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
  send: EventEmitter<CustomEvent<IVerdocsBuild{roles: [object Object][]; name: string; template_id: string}>>;
  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  templateUpdated: EventEmitter<CustomEvent<IVerdocsBuildIVerdocsBuild{endpoint: [object Object]; template: [object Object]; event: string}>>;
  /**
   * Event fired when the template is created by the upload step.
   */
  templateCreated: EventEmitter<CustomEvent<IVerdocsBuildIVerdocsBuild{endpoint: [object Object]; template: [object Object]; event: string}>>;
  /**
   * Event fired when roles are updated in the roles step.
   */
  rolesUpdated: EventEmitter<CustomEvent<IVerdocsBuildIVerdocsBuild{endpoint: [object Object]; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: [object Object][]}>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsButtonPanel extends Components.VerdocsButtonPanel {}


@ProxyCmp({
  inputs: ['checked', 'disabled', 'label', 'name', 'theme', 'value']
})
@Component({
  selector: 'verdocs-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['checked', 'disabled', 'label', 'name', 'theme', 'value'],
})
export class VerdocsCheckbox {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
})
@Component({
  selector: 'verdocs-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class VerdocsDialog {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  next: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientLink{envelope: [object Object]}>>;
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
  protected el: HTMLElement;
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
  another: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientSummary{envelope: [object Object]}>>;
  /**
   * Event fired when the user clicks Send Another to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  view: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientSummary{envelope: [object Object]}>>;
  /**
   * Event fired when the user clicks Done to proceed. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  next: EventEmitter<CustomEvent<IVerdocsEnvelopeRecipientSummary{envelope: [object Object]}>>;
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
  protected el: HTMLElement;
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
  envelopeUpdated: EventEmitter<CustomEvent<IVerdocsEnvelopeSidebarIVerdocsEnvelopeSidebar{endpoint: [object Object]; envelope: [object Object]; event: string}>>;
  /**
   * Event fired when the sidebar is opened or closed.
   */
  toggle: EventEmitter<CustomEvent<{open: boolean}>>;
  /**
   * Event fired when the user clicks Send Another in the Manage Recipients dialog. It is up to the host application
to redirect the user to the appropriate next workflow step.
   */
  another: EventEmitter<CustomEvent<IVerdocsEnvelopeSidebar{envelope: [object Object]}>>;
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
  protected el: HTMLElement;
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
  viewEnvelope: EventEmitter<CustomEvent<IVerdocsEnvelopesListIVerdocsEnvelopesList{endpoint: [object Object]; envelope: [object Object]}>>;
  /**
   * Event fired when the user clicks to finish the envelope.
   */
  finishEnvelope: EventEmitter<CustomEvent<IVerdocsEnvelopesListIVerdocsEnvelopesList{endpoint: [object Object]; envelope: [object Object]}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldAttachment {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted', 'attached']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldAttachmentITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldAttachmentITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldAttachment extends Components.VerdocsFieldAttachment {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldAttachmentIVerdocsFieldAttachment{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
  /**
   * Event fired when the field is deleted.
   */
  attached: EventEmitter<CustomEvent<{data: string; lastModified: number; name: string; size: number; type: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'option', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'option', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldCheckbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldCheckboxITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldCheckboxITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldCheckbox extends Components.VerdocsFieldCheckbox {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldCheckboxIVerdocsFieldCheckbox{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-date',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'field', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldDate {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsPress', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldDateITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldDateITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldDate extends Components.VerdocsFieldDate {
  /**
   * Event fired on every character entered into / deleted from the field.
   */
  settingsPress: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldDateIVerdocsFieldDate{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldDropdown {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldDropdownITemplateFieldSetting } from '@verdocs/web-sdk';
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
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldDropdownIVerdocsFieldDropdown{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'initials', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-initial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'initials', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldInitial {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['adopt', 'exit', 'fieldChange', 'settingsChanged', 'settingsPress', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldInitialITemplateFieldSetting } from '@verdocs/web-sdk';
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
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldInitialIVerdocsFieldInitial{fieldName: string; settings: [object Object]; field: [object Object]}>>;
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
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'fieldId', 'fieldname', 'fields', 'focused', 'pageNum', 'pagenumber', 'pdfPages', 'recipients', 'roleName', 'roleindex', 'selectedRoleName', 'signed', 'templateid', 'xscale', 'yscale'],
  methods: ['showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['currentInitial', 'currentInitialId', 'currentSignature', 'currentSignatureId', 'disabled', 'fieldId', 'fieldname', 'fields', 'focused', 'pageNum', 'pagenumber', 'pdfPages', 'recipients', 'roleName', 'roleindex', 'selectedRoleName', 'signed', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldPayment {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['signatureComplete', 'initialComplete', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldPaymentITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldPaymentITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldPayment extends Components.VerdocsFieldPayment {

  signatureComplete: EventEmitter<CustomEvent<string>>;

  initialComplete: EventEmitter<CustomEvent<string>>;

  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldPaymentIVerdocsFieldPayment{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'option', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'option', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldRadioButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldRadioButtonITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldRadioButtonITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldRadioButton extends Components.VerdocsFieldRadioButton {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldRadioButtonIVerdocsFieldRadioButton{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'name', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-signature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'name', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldSignature {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['fieldChange', 'settingsPress', 'settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldSignatureITemplateFieldSetting } from '@verdocs/web-sdk';
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
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldSignatureIVerdocsFieldSignature{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldTextarea {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldTextareaITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldTextareaITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTextarea extends Components.VerdocsFieldTextarea {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldTextareaIVerdocsFieldTextarea{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-textbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'endpoint', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldTextbox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldTextboxITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldTextboxITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTextbox extends Components.VerdocsFieldTextbox {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldTextboxIVerdocsFieldTextbox{fieldName: string; settings: [object Object]; field: [object Object]}>>;
  /**
   * Event fired when the field is deleted.
   */
  deleted: EventEmitter<CustomEvent<{fieldName: string}>>;
}


@ProxyCmp({
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
  methods: ['focusField', 'showSettingsPanel', 'hideSettingsPanel']
})
@Component({
  selector: 'verdocs-field-timestamp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'done', 'editable', 'fieldname', 'moveable', 'pagenumber', 'templateid', 'xscale', 'yscale'],
})
export class VerdocsFieldTimestamp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['settingsChanged', 'deleted']);
  }
}


import type { ITemplateFieldSetting as IVerdocsFieldTimestampITemplateFieldSetting } from '@verdocs/web-sdk';
import type { ITemplateField as IVerdocsFieldTimestampITemplateField } from '@verdocs/web-sdk';

export declare interface VerdocsFieldTimestamp extends Components.VerdocsFieldTimestamp {
  /**
   * Event fired when the field's settings are changed.
   */
  settingsChanged: EventEmitter<CustomEvent<IVerdocsFieldTimestampIVerdocsFieldTimestamp{fieldName: string; settings: [object Object]; field: [object Object]}>>;
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
  protected el: HTMLElement;
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
  inputs: ['options']
})
@Component({
  selector: 'verdocs-floating-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['options'],
})
export class VerdocsFloatingMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


import type { IOption as IVerdocsFloatingMenuIOption } from '@verdocs/web-sdk';

export declare interface VerdocsFloatingMenu extends Components.VerdocsFloatingMenu {
  /**
   * Event fired when a menu option is clicked.
Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  optionSelected: EventEmitter<CustomEvent<IVerdocsFloatingMenuIOption>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'placeholder', 'step', 'steps']
})
@Component({
  selector: 'verdocs-kba-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['choices', 'helptext', 'helptitle', 'label', 'mode', 'placeholder', 'step', 'steps'],
})
export class VerdocsKbaDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next']);
  }
}


export declare interface VerdocsKbaDialog extends Components.VerdocsKbaDialog {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the value selected.
   */
  next: EventEmitter<CustomEvent<string>>;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsLoader extends Components.VerdocsLoader {}


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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsOrganizationCard extends Components.VerdocsOrganizationCard {}


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
  protected el: HTMLElement;
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
  inputs: ['align', 'anchor', 'voffset']
})
@Component({
  selector: 'verdocs-portal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['align', 'anchor', 'voffset'],
})
export class VerdocsPortal {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsRadioButton extends Components.VerdocsRadioButton {}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSearch extends Components.VerdocsSearch {}


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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['send', 'exit', 'sdkError', 'searchContacts']);
  }
}


import type { ICreateEnvelopeRole as IVerdocsSendICreateEnvelopeRole } from '@verdocs/web-sdk';
import type { IEnvelope as IVerdocsSendIEnvelope } from '@verdocs/web-sdk';
import type { SDKError as IVerdocsSendSDKError } from '@verdocs/web-sdk';
import type { IContactSearchEvent as IVerdocsSendIContactSearchEvent } from '@verdocs/web-sdk';

export declare interface VerdocsSend extends Components.VerdocsSend {
  /**
   * The user completed the form and clicked send.
   */
  send: EventEmitter<CustomEvent<IVerdocsSendIVerdocsSend{roles: [object Object][]; name: string; template_id: string; envelope_id: string; envelope: [object Object]}>>;
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
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSettings {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError']);
  }
}


import type { SDKError as IVerdocsSettingsSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsSettings extends Components.VerdocsSettings {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSettingsSDKError>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-settings-api-keys',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSettingsApiKeys {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'memberInvited', 'memberUpdated', 'memberRemoved']);
  }
}


import type { SDKError as IVerdocsSettingsApiKeysSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsSettingsApiKeysVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IProfile as IVerdocsSettingsApiKeysIProfile } from '@verdocs/web-sdk';

export declare interface VerdocsSettingsApiKeys extends Components.VerdocsSettingsApiKeys {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSettingsApiKeysSDKError>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberInvited: EventEmitter<CustomEvent<IVerdocsSettingsApiKeysIVerdocsSettingsApiKeys{endpoint: [object Object]; member: [object Object]}>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberUpdated: EventEmitter<CustomEvent<IVerdocsSettingsApiKeysIVerdocsSettingsApiKeys{endpoint: [object Object]; member: [object Object]}>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberRemoved: EventEmitter<CustomEvent<IVerdocsSettingsApiKeysIVerdocsSettingsApiKeys{endpoint: [object Object]; member: [object Object]}>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-settings-members',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSettingsMembers {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'memberInvited', 'memberUpdated', 'memberRemoved']);
  }
}


import type { SDKError as IVerdocsSettingsMembersSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsSettingsMembersVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IProfile as IVerdocsSettingsMembersIProfile } from '@verdocs/web-sdk';

export declare interface VerdocsSettingsMembers extends Components.VerdocsSettingsMembers {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSettingsMembersSDKError>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberInvited: EventEmitter<CustomEvent<IVerdocsSettingsMembersIVerdocsSettingsMembers{endpoint: [object Object]; member: [object Object]}>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberUpdated: EventEmitter<CustomEvent<IVerdocsSettingsMembersIVerdocsSettingsMembers{endpoint: [object Object]; member: [object Object]}>>;
  /**
   * Event fired when the user chooses to invite a new member.
   */
  memberRemoved: EventEmitter<CustomEvent<IVerdocsSettingsMembersIVerdocsSettingsMembers{endpoint: [object Object]; member: [object Object]}>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-settings-organization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSettingsOrganization {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'organizationUpdated']);
  }
}


import type { SDKError as IVerdocsSettingsOrganizationSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsSettingsOrganizationVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IOrganization as IVerdocsSettingsOrganizationIOrganization } from '@verdocs/web-sdk';

export declare interface VerdocsSettingsOrganization extends Components.VerdocsSettingsOrganization {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSettingsOrganizationSDKError>>;
  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  organizationUpdated: EventEmitter<CustomEvent<IVerdocsSettingsOrganizationIVerdocsSettingsOrganization{endpoint: [object Object]; organization: [object Object]}>>;
}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-settings-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsSettingsProfile {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'profileUpdated']);
  }
}


import type { SDKError as IVerdocsSettingsProfileSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsSettingsProfileVerdocsEndpoint } from '@verdocs/web-sdk';
import type { IProfile as IVerdocsSettingsProfileIProfile } from '@verdocs/web-sdk';

export declare interface VerdocsSettingsProfile extends Components.VerdocsSettingsProfile {
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsSettingsProfileSDKError>>;
  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  profileUpdated: EventEmitter<CustomEvent<IVerdocsSettingsProfileIVerdocsSettingsProfile{endpoint: [object Object]; profile: [object Object]}>>;
}


@ProxyCmp({
  inputs: ['envelopeId', 'headerTargetId', 'inviteCode', 'roleId']
})
@Component({
  selector: 'verdocs-sign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['envelopeId', 'headerTargetId', 'inviteCode', 'roleId'],
})
export class VerdocsSign {
  protected el: HTMLElement;
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
  envelopeLoaded: EventEmitter<CustomEvent<IVerdocsSignIVerdocsSign{endpoint: [object Object]; envelope: [object Object]}>>;
  /**
   * Event fired when the envelope is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  envelopeUpdated: EventEmitter<CustomEvent<IVerdocsSignIVerdocsSign{endpoint: [object Object]; envelope: [object Object]; event: string}>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsStatusIndicator extends Components.VerdocsStatusIndicator {}


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
  protected el: HTMLElement;
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
  colHeaderClick: EventEmitter<CustomEvent<IVerdocsTable{col: [object Object]}>>;
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
  protected el: HTMLElement;
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
  selectTab: EventEmitter<CustomEvent<IVerdocsTabs{tab: [object Object]; index: number}>>;
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
  protected el: HTMLElement;
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
  next: EventEmitter<CustomEvent<IVerdocsTemplateAttachments{template: [object Object]}>>;
  /**
   * Event fired when the user updates the template.
   */
  templateUpdated: EventEmitter<CustomEvent<IVerdocsTemplateAttachmentsIVerdocsTemplateAttachments{endpoint: [object Object]; template: [object Object]; event: string}>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTemplateCard extends Components.VerdocsTemplateCard {}


@ProxyCmp({
  inputs: ['endpoint']
})
@Component({
  selector: 'verdocs-template-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint'],
})
export class VerdocsTemplateCreate {
  protected el: HTMLElement;
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
  templateCreated: EventEmitter<CustomEvent<IVerdocsTemplateCreateIVerdocsTemplateCreate{endpoint: [object Object]; template: [object Object]; templateId: string}>>;
}


@ProxyCmp({
  inputs: ['documentId', 'done', 'editable', 'endpoint', 'layers', 'pageNumber', 'templateId', 'virtualHeight', 'virtualWidth']
})
@Component({
  selector: 'verdocs-template-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['documentId', 'done', 'editable', 'endpoint', 'layers', 'pageNumber', 'templateId', 'virtualHeight', 'virtualWidth'],
})
export class VerdocsTemplateDocumentPage {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'delete', 'settingsChanged', 'sdkError']);
  }
}


import type { ITemplateFieldSetting as IVerdocsTemplateFieldPropertiesITemplateFieldSetting } from '@verdocs/web-sdk';
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
  settingsChanged: EventEmitter<CustomEvent<IVerdocsTemplateFieldPropertiesIVerdocsTemplateFieldProperties{fieldName: string; settings: [object Object]; field: [object Object]}>>;
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
  protected el: HTMLElement;
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
  templateUpdated: EventEmitter<CustomEvent<IVerdocsTemplateFieldsIVerdocsTemplateFields{endpoint: [object Object]; template: [object Object]; event: string}>>;

  fieldsUpdated: EventEmitter<CustomEvent<IVerdocsTemplateFieldsIVerdocsTemplateFields{endpoint: [object Object]; templateId: string; event: 'added' | 'deleted' | 'updated'; fields: [object Object][]}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateName {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'sdkError', 'templateUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateNameSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateNameVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplateNameITemplate } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateName extends Components.VerdocsTemplateName {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateNameSDKError>>;
  /**
   * Event fired when the user updates the template.
   */
  templateUpdated: EventEmitter<CustomEvent<IVerdocsTemplateNameIVerdocsTemplateName{endpoint: [object Object]; template: [object Object]; event: string}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-reminders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateReminders {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'sdkError', 'templateUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateRemindersSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateRemindersVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplateRemindersITemplate } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateReminders extends Components.VerdocsTemplateReminders {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateRemindersSDKError>>;
  /**
   * Event fired when the user updates the template.
   */
  templateUpdated: EventEmitter<CustomEvent<IVerdocsTemplateRemindersIVerdocsTemplateReminders{endpoint: [object Object]; template: [object Object]; event: string}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'roleName', 'sender', 'templateId']
})
@Component({
  selector: 'verdocs-template-role-properties',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'roleName', 'sender', 'templateId'],
})
export class VerdocsTemplateRoleProperties {
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  rolesUpdated: EventEmitter<CustomEvent<IVerdocsTemplateRolesIVerdocsTemplateRoles{endpoint: [object Object]; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: [object Object][]}>>;
}


@ProxyCmp({
  inputs: ['endpoint', 'sender', 'templateId']
})
@Component({
  selector: 'verdocs-template-sender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'sender', 'templateId'],
})
export class VerdocsTemplateSender {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'sdkError']);
  }
}


import type { SDKError as IVerdocsTemplateSenderSDKError } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateSender extends Components.VerdocsTemplateSender {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateSenderSDKError>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsTemplateTags extends Components.VerdocsTemplateTags {}


@ProxyCmp({
  inputs: ['endpoint', 'templateId']
})
@Component({
  selector: 'verdocs-template-visibility',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['endpoint', 'templateId'],
})
export class VerdocsTemplateVisibility {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['close', 'sdkError', 'templateUpdated']);
  }
}


import type { SDKError as IVerdocsTemplateVisibilitySDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplateVisibilityVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplateVisibilityITemplate } from '@verdocs/web-sdk';

export declare interface VerdocsTemplateVisibility extends Components.VerdocsTemplateVisibility {
  /**
   * Event fired when the user cancels the dialog.
   */
  close: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
terminate the process, and the calling application should correct the condition and re-render the component.
   */
  sdkError: EventEmitter<CustomEvent<IVerdocsTemplateVisibilitySDKError>>;
  /**
   * Event fired when the user updates the template.
   */
  templateUpdated: EventEmitter<CustomEvent<IVerdocsTemplateVisibilityIVerdocsTemplateVisibility{endpoint: [object Object]; template: [object Object]; event: string}>>;
}


@ProxyCmp({
  inputs: ['allowedActions', 'endpoint', 'name', 'rowsPerPage', 'selectedPage', 'sharing', 'showPagination', 'sort', 'starred']
})
@Component({
  selector: 'verdocs-templates-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['allowedActions', 'endpoint', 'name', 'rowsPerPage', 'selectedPage', 'sharing', 'showPagination', 'sort', 'starred'],
})
export class VerdocsTemplatesList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['sdkError', 'viewTemplate', 'signNow', 'submittedData', 'editTemplate', 'templateDeleted', 'changeSort', 'changeSharing', 'changeStarred', 'changeName']);
  }
}


import type { SDKError as IVerdocsTemplatesListSDKError } from '@verdocs/web-sdk';
import type { VerdocsEndpoint as IVerdocsTemplatesListVerdocsEndpoint } from '@verdocs/web-sdk';
import type { ITemplate as IVerdocsTemplatesListITemplate } from '@verdocs/web-sdk';
import type { IGetTemplateSummarySortBy as IVerdocsTemplatesListIGetTemplateSummarySortBy } from '@verdocs/web-sdk';

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
  viewTemplate: EventEmitter<CustomEvent<IVerdocsTemplatesListIVerdocsTemplatesList{endpoint: [object Object]; template: [object Object]}>>;
  /**
   * Event fired when the user clicks to sign a template now.
   */
  signNow: EventEmitter<CustomEvent<IVerdocsTemplatesListIVerdocsTemplatesList{endpoint: [object Object]; template: [object Object]}>>;
  /**
   * Event fired when the user clicks to sign a template now.
   */
  submittedData: EventEmitter<CustomEvent<IVerdocsTemplatesListIVerdocsTemplatesList{endpoint: [object Object]; template: [object Object]}>>;
  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  editTemplate: EventEmitter<CustomEvent<IVerdocsTemplatesListIVerdocsTemplatesList{endpoint: [object Object]; template: [object Object]}>>;
  /**
   * Event fired when the user chooses the Delete option from the dropdown menu. When this is fired, the template
will already have been deleted. The host application should remove it from the list or refresh the list.
   */
  templateDeleted: EventEmitter<CustomEvent<IVerdocsTemplatesListIVerdocsTemplatesList{endpoint: [object Object]; template: [object Object]}>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeSort: EventEmitter<CustomEvent<IVerdocsTemplatesListIGetTemplateSummarySortBy>>;
  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  changeSharing: EventEmitter<CustomEvent<'all' | 'personal' | 'shared' | 'public'>>;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
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
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsToolbarIcon extends Components.VerdocsToolbarIcon {}


@ProxyCmp({
})
@Component({
  selector: 'verdocs-upload-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [],
})
export class VerdocsUploadDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['exit', 'next']);
  }
}


import type { FileWithData as IVerdocsUploadDialogFileWithData } from '@verdocs/web-sdk';

export declare interface VerdocsUploadDialog extends Components.VerdocsUploadDialog {
  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  exit: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the dialog is closed. The event data will contain the file selected.
   */
  next: EventEmitter<CustomEvent<IVerdocsUploadDialogFileWithData[]>>;
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
  protected el: HTMLElement;
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
  envelopeUpdated: EventEmitter<CustomEvent<IVerdocsViewIVerdocsView{endpoint: [object Object]; envelope: [object Object]; event: string}>>;
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


