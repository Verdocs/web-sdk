/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@verdocs/web-sdk';


export declare interface DocumentStatusIndicator extends Components.DocumentStatusIndicator {}
@ProxyCmp({
  inputs: ['status', 'theme']
})
@Component({
  selector: 'document-status-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['status', 'theme']
})
export class DocumentStatusIndicator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { DropdownMenu as IDropdownMenu } from '@verdocs/web-sdk/dist/custom-elements/components/controls/dropdown-menu/dropdown-menu';
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
  optionSelected!: IDropdownMenu['optionSelected'];
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

import { PdfViewer as IPdfViewer } from '@verdocs/web-sdk/dist/custom-elements/components/pdf-viewer/pdf-viewer';
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
  pageRendered!: IPdfViewer['pageRendered'];
  /**  */
  pageChange!: IPdfViewer['pageChange'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['pageRendered', 'pageChange']);
  }
}

import { SearchBox as ISearchBox } from '@verdocs/web-sdk/dist/custom-elements/components/elements/search-box/search-box';
export declare interface SearchBox extends Components.SearchBox {}
@ProxyCmp({
  inputs: ['type']
})
@Component({
  selector: 'search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['type'],
  outputs: ['search']
})
export class SearchBox {
  /** Event fired when the query value has changed. */
  search!: ISearchBox['search'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['search']);
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

import { SearchQuickFunctions as ISearchQuickFunctions } from '@verdocs/web-sdk/dist/custom-elements/components/elements/search-quick-functions/search-quick-functions';
export declare interface SearchQuickFunctions extends Components.SearchQuickFunctions {}

@Component({
  selector: 'search-quick-functions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  outputs: ['createTemplate', 'createDocument']
})
export class SearchQuickFunctions {
  /** Event fired when an entry is clicked. */
  createTemplate!: ISearchQuickFunctions['createTemplate'];
  /** Event fired when an entry is clicked. */
  createDocument!: ISearchQuickFunctions['createDocument'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['createTemplate', 'createDocument']);
  }
}

import { SearchRecent as ISearchRecent } from '@verdocs/web-sdk/dist/custom-elements/components/elements/search-recent/search-recent';
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
  entrySelected!: ISearchRecent['entrySelected'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import { SearchSaved as ISearchSaved } from '@verdocs/web-sdk/dist/custom-elements/components/elements/search-saved/search-saved';
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
  entrySelected!: ISearchSaved['entrySelected'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['entrySelected']);
  }
}

import { SearchStarred as ISearchStarred } from '@verdocs/web-sdk/dist/custom-elements/components/elements/search-starred/search-starred';
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
  entrySelected!: ISearchStarred['entrySelected'];
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
