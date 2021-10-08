import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'search-saved',
  styleUrl: 'search-saved.css',
  shadow: true,
})
export class SearchSaved {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
