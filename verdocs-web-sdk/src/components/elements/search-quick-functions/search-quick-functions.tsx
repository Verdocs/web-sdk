import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'search-quick-functions',
  styleUrl: 'search-quick-functions.css',
  shadow: true,
})
export class SearchQuickFunctions {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
