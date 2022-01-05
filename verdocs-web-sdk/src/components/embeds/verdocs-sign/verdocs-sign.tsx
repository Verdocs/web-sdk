import {Component, Host, h} from '@stencil/core';

@Component({
  tag: 'verdocs-sign',
  styleUrl: 'verdocs-sign.scss',
  shadow: true,
})
export class VerdocsSign {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
