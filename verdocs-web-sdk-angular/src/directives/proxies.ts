/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';




export declare interface DocumentStatusIndicator extends Components.DocumentStatusIndicator {}

@ProxyCmp({
  tagName: 'document-status-indicator',
  customElement: undefined,
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

import type { IMenuOption as IDropdownMenuIMenuOption } from '@verdocs/web-sdk';
export declare interface DropdownMenu extends Components.DropdownMenu {
  /**
   * Event fired when a menu option is clicked.
Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks. 
   */
  optionSelected: EventEmitter<CustomEvent<IDropdownMenuIMenuOption>>;

}

@ProxyCmp({
  tagName: 'dropdown-menu',
  customElement: undefined,
  inputs: ['open', 'options', 'tall']
})
@Component({
  selector: 'dropdown-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['open', 'options', 'tall']
})
export class DropdownMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


export declare interface OrgPopup extends Components.OrgPopup {}

@ProxyCmp({
  tagName: 'org-popup',
  customElement: undefined,
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


export declare interface PdfViewer extends Components.PdfViewer {
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
  tagName: 'pdf-viewer',
  customElement: undefined,
  inputs: ['rotation', 'src']
})
@Component({
  selector: 'pdf-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['rotation', 'src']
})
export class PdfViewer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered', 'pageChange']);
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
  tagName: 'search-box',
  customElement: undefined,
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


export declare interface SearchEmbed extends Components.SearchEmbed {}

@ProxyCmp({
  tagName: 'search-embed',
  customElement: undefined
})
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
  tagName: 'search-quick-functions',
  customElement: undefined
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
  tagName: 'search-recent',
  customElement: undefined,
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
  tagName: 'search-saved',
  customElement: undefined,
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
  tagName: 'search-starred',
  customElement: undefined,
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
  tagName: 'search-tabs',
  customElement: undefined
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
  tagName: 'tags-indicator',
  customElement: undefined,
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
  tagName: 'template-card',
  customElement: undefined,
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
  tagName: 'toggle-icon-buttons',
  customElement: undefined,
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
