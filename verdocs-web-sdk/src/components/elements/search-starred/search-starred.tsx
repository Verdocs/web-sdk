import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'search-starred',
  styleUrl: 'search-starred.css',
  shadow: true,
})
export class SearchStarred {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
