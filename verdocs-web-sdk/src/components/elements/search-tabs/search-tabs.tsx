import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'search-tabs',
  styleUrl: 'search-tabs.css',
  shadow: true,
})
export class SearchTabs {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
