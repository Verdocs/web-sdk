/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';


export declare interface DocumentStatusIndicator extends Components.DocumentStatusIndicator {}
@ProxyCmp({
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

import { IMenuOption as IDropdownMenuIMenuOption } from '@verdocs/web-sdk';
export declare interface DropdownMenu extends Components.DropdownMenu {}
@ProxyCmp({
  inputs: ['open', 'options', 'tall']
})
@Component({
  selector: 'dropdown-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['open', 'options', 'tall'],
  outputs: ['optionSelected']
})
export class DropdownMenu {
  /** Event fired when a menu option is clicked.
Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks. */
  optionSelected!: EventEmitter<CustomEvent<IDropdownMenuIMenuOption>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


export declare interface OrgPopup extends Components.OrgPopup {}
@ProxyCmp({
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


export declare interface PdfViewer extends Components.PdfViewer {}
@ProxyCmp({
  inputs: ['rotation', 'src']
})
@Component({
  selector: 'pdf-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['rotation', 'src'],
  outputs: ['pageRendered', 'pageChange']
})
export class PdfViewer {
  /**  */
  pageRendered!: EventEmitter<CustomEvent<number>>;
  /**  */
  pageChange!: EventEmitter<CustomEvent<number>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered', 'pageChange']);
  }
}

import { ISearchEvent as ISearchBoxISearchEvent } from '@verdocs/web-sdk';
import { TContentType as ISearchBoxTContentType } from '@verdocs/web-sdk';
export declare interface SearchBox extends Components.SearchBox {}
@ProxyCmp({
  inputs: ['placeholder', 'query', 'type']
})
@Component({
  selector: 'search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['placeholder', 'query', 'type'],
  outputs: ['searchClicked', 'typeChanged', 'queryChanged']
})
export class SearchBox {
  /** Event fired when the user changes the type. */
  searchClicked!: EventEmitter<CustomEvent<ISearchBoxISearchEvent>>;
  /** Event fired when the user changes the type. */
  typeChanged!: EventEmitter<CustomEvent<ISearchBoxTContentType>>;
  /** Event fired when the user changes the query string. */
  queryChanged!: EventEmitter<CustomEvent<string>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['searchClicked', 'typeChanged', 'queryChanged']);
  }
}


export declare interface SearchEmbed extends Components.SearchEmbed {}

@Component({
  selector: 'search-embed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class SearchEmbed {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface SearchQuickFunctions extends Components.SearchQuickFunctions {}

@Component({
  selector: 'search-quick-functions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  outputs: ['createTemplate', 'createDocument']
})
export class SearchQuickFunctions {
  /** Event fired when an entry is clicked. */
  createTemplate!: EventEmitter<CustomEvent<any>>;
  /** Event fired when an entry is clicked. */
  createDocument!: EventEmitter<CustomEvent<any>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['createTemplate', 'createDocument']);
  }
}

import { IRecentSearch as ISearchRecentIRecentSearch } from '@verdocs/web-sdk';
export declare interface SearchRecent extends Components.SearchRecent {}
@ProxyCmp({
  inputs: ['limit']
})
@Component({
  selector: 'search-recent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['limit'],
  outputs: ['entrySelected']
})
export class SearchRecent {
  /** Event fired when an entry is clicked. */
  entrySelected!: EventEmitter<CustomEvent<ISearchRecentIRecentSearch>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import { ISavedSearch as ISearchSavedISavedSearch } from '@verdocs/web-sdk';
export declare interface SearchSaved extends Components.SearchSaved {}
@ProxyCmp({
  inputs: ['limit']
})
@Component({
  selector: 'search-saved',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['limit'],
  outputs: ['entrySelected']
})
export class SearchSaved {
  /** Event fired when an entry is clicked. */
  entrySelected!: EventEmitter<CustomEvent<ISearchSavedISavedSearch>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import { IRecentSearch as ISearchStarredIRecentSearch } from '@verdocs/web-sdk';
export declare interface SearchStarred extends Components.SearchStarred {}
@ProxyCmp({
  inputs: ['options']
})
@Component({
  selector: 'search-starred',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['options'],
  outputs: ['entrySelected']
})
export class SearchStarred {
  /** Event fired when an entry is clicked. */
  entrySelected!: EventEmitter<CustomEvent<ISearchStarredIRecentSearch>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}


export declare interface SearchTabs extends Components.SearchTabs {}

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
