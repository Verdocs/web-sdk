import {Component, Host, h} from '@stencil/core';
import {getRecentSearches} from '@verdocs/js-sdk/dist/Search/Content';

/**
 * Display a list of recent search queries.
 */
@Component({
  tag: 'search-recent',
  styleUrl: 'search-recent.css',
  shadow: true,
})
export class SearchRecent {
  componentDidLoad() {
    getRecentSearches()
      .then(r => {
        console.log('Recent', r);
      })
      .catch(e => {
        console.log('Error getting recent searches', e);
      });
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
