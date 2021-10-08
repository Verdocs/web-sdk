import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'search-recent',
  styleUrl: 'search-recent.css',
  shadow: true,
})
export class SearchRecent {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
