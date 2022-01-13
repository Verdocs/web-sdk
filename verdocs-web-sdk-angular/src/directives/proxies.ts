/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';




export declare interface DocumentStatusIndicator extends Components.DocumentStatusIndicator {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['status']
})
@Component({
  selector: 'document-status-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['status']
})
export class DocumentStatusIndicator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OrgPopup extends Components.OrgPopup {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['organization', 'theme']
})
@Component({
  selector: 'org-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['organization', 'theme']
})
export class OrgPopup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { ISearchEvent as ISearchBoxISearchEvent } from '@verdocs/web-sdk';
import type { TContentType as ISearchBoxTContentType } from '@verdocs/web-sdk';
export declare interface SearchBox extends Components.SearchBox {
  /**
   * Event fired when the user changes the type. 
   */
  searchClicked: EventEmitter<CustomEvent<ISearchBoxISearchEvent>>;
  /**
   * Event fired when the user changes the type. 
   */
  typeChanged: EventEmitter<CustomEvent<ISearchBoxTContentType>>;
  /**
   * Event fired when the user changes the query string. 
   */
  queryChanged: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['placeholder', 'query', 'type']
})
@Component({
  selector: 'search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['placeholder', 'query', 'type']
})
export class SearchBox {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchClicked', 'typeChanged', 'queryChanged']);
  }
}


export declare interface SearchQuickFunctions extends Components.SearchQuickFunctions {
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
  defineCustomElementFn: undefined
})
@Component({
  selector: 'search-quick-functions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class SearchQuickFunctions {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['createTemplate', 'createDocument']);
  }
}

import type { IRecentSearch as ISearchRecentIRecentSearch } from '@verdocs/web-sdk';
export declare interface SearchRecent extends Components.SearchRecent {
  /**
   * Event fired when an entry is clicked. 
   */
  entrySelected: EventEmitter<CustomEvent<ISearchRecentIRecentSearch>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['limit']
})
@Component({
  selector: 'search-recent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['limit']
})
export class SearchRecent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import type { ISavedSearch as ISearchSavedISavedSearch } from '@verdocs/web-sdk';
export declare interface SearchSaved extends Components.SearchSaved {
  /**
   * Event fired when an entry is clicked. 
   */
  entrySelected: EventEmitter<CustomEvent<ISearchSavedISavedSearch>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['limit']
})
@Component({
  selector: 'search-saved',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['limit']
})
export class SearchSaved {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import type { IRecentSearch as ISearchStarredIRecentSearch } from '@verdocs/web-sdk';
export declare interface SearchStarred extends Components.SearchStarred {
  /**
   * Event fired when an entry is clicked. 
   */
  entrySelected: EventEmitter<CustomEvent<ISearchStarredIRecentSearch>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['options']
})
@Component({
  selector: 'search-starred',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['options']
})
export class SearchStarred {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}


export declare interface SearchTabs extends Components.SearchTabs {}

@ProxyCmp({
  defineCustomElementFn: undefined
})
@Component({
  selector: 'search-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class SearchTabs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface TagsIndicator extends Components.TagsIndicator {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['tags', 'theme']
})
@Component({
  selector: 'tags-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['tags', 'theme']
})
export class TagsIndicator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface TemplateCard extends Components.TemplateCard {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['template', 'theme']
})
@Component({
  selector: 'template-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['template', 'theme']
})
export class TemplateCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface ToggleIconButtons extends Components.ToggleIconButtons {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['options', 'theme']
})
@Component({
  selector: 'toggle-icon-buttons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['options', 'theme']
})
export class ToggleIconButtons {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import type { IAuthStatus as IVerdocsAuthIAuthStatus } from '@verdocs/web-sdk';
export declare interface VerdocsAuth extends Components.VerdocsAuth {
  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status. 
   */
  authenticated: EventEmitter<CustomEvent<IVerdocsAuthIAuthStatus>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['debug', 'logo', 'visible']
})
@Component({
  selector: 'verdocs-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['debug', 'logo', 'visible']
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
  press: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'label', 'type']
})
@Component({
  selector: 'verdocs-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'label', 'type']
})
export class VerdocsButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['press']);
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


export declare interface VerdocsOkDialog extends Components.VerdocsOkDialog {
  /**
   * Event fired when the dialog is closed. The event data will contain the closure reason. 
   */
  closed: EventEmitter<CustomEvent<'cancel' | 'ok'>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['heading', 'message', 'open']
})
@Component({
  selector: 'verdocs-ok-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['heading', 'message', 'open']
})
export class VerdocsOkDialog {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['closed']);
  }
}


export declare interface VerdocsSearch extends Components.VerdocsSearch {}

@ProxyCmp({
  defineCustomElementFn: undefined
})
@Component({
  selector: 'verdocs-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VerdocsSearch {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VerdocsSign extends Components.VerdocsSign {
  /**
   * Event fired when a signing session has been obtained. 
   */
  authenticated: EventEmitter<CustomEvent<any>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['documentid', 'invitecode', 'roleid']
})
@Component({
  selector: 'verdocs-sign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['documentid', 'invitecode', 'roleid']
})
export class VerdocsSign {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['authenticated']);
  }
}


export declare interface VerdocsTextButton extends Components.VerdocsTextButton {
  /**
   * Event fired when the button is clicked. 
   */
  press: EventEmitter<CustomEvent<string>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'label', 'type']
})
@Component({
  selector: 'verdocs-text-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'label', 'type']
})
export class VerdocsTextButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['press']);
  }
}


export declare interface VerdocsTextInput extends Components.VerdocsTextInput {
  /**
   * Event fired when the input value changes. 
   */
  tinput: EventEmitter<CustomEvent<string>>;
  /**
   * Event fired when the field receives focus. 
   */
  tfocus: EventEmitter<CustomEvent<any>>;
  /**
   * Event fired when the field loses focus. 
   */
  tblur: EventEmitter<CustomEvent<any>>;

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
    proxyOutputs(this, this.el, ['tinput', 'tfocus', 'tblur']);
  }
}


export declare interface VerdocsView extends Components.VerdocsView {
  /**
   *  
   */
  pageRendered: EventEmitter<CustomEvent<number>>;
  /**
   *  
   */
  pageChange: EventEmitter<CustomEvent<number>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['rotation', 'source', 'token']
})
@Component({
  selector: 'verdocs-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['rotation', 'source', 'token']
})
export class VerdocsView {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered', 'pageChange']);
  }
}
