/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from 'verdocs-web-sdk';

import { DropdownMenu as IDropdownMenu } from 'verdocs-web-sdk/dist/custom-elements/components/controls/dropdown-menu/dropdown-menu';
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
  /** Event fired when a menu option is clicked. */
  optionSelected!: IDropdownMenu['optionSelected'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['optionSelected']);
  }
}


export declare interface MyComponent extends Components.MyComponent {}
@ProxyCmp({
  inputs: ['first', 'last', 'middle']
})
@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['first', 'last', 'middle']
})
export class MyComponent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
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

import { PdfViewer as IPdfViewer } from 'verdocs-web-sdk/dist/custom-elements/components/pdf-viewer/pdf-viewer';
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
