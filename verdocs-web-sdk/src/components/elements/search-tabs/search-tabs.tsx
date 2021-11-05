import {Component, Host, h, State} from '@stencil/core';

export type TContentType = 'all' | 'document' | 'template' | 'organization';

@Component({
  tag: 'search-tabs',
  styleUrl: 'search-tabs.scss',
})
export class SearchTabs {
  @State() selected: TContentType = 'all';

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
