import {Component, Host, h} from '@stencil/core';

@Component({
  tag: 'search-embed',
  styleUrl: 'search-embed.scss',
  shadow: true,
})
export class SearchEmbed {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
