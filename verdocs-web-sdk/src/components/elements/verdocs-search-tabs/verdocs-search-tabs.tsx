import {Component, h, State} from '@stencil/core';

export type TContentType = 'all' | 'document' | 'template' | 'organization';

@Component({
  tag: 'verdocs-search-tabs',
  styleUrl: 'verdocs-search-tabs.scss',
  shadow: false,
})
export class VerdocsSearchTabs {
  @State() selected: TContentType = 'all';

  render() {
    return <div>&nbsp;</div>;
  }
}
