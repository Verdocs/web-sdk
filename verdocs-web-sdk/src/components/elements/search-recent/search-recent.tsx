import {Component, Host, h, Prop} from '@stencil/core';
import {getRecentSearches} from '@verdocs/js-sdk/dist/Search/Content';

import SearchIcon from './search-icon.svg';

/**
 * Display a list of recent search queries.
 */
@Component({
  tag: 'search-recent',
  styleUrl: 'search-recent.css',
  shadow: true,
})
export class SearchRecent {
  // private container: HTMLDivElement;

  @Prop() options: any;

  componentDidLoad() {
    getRecentSearches()
      .then(r => {
        console.log('Recent', r);
      })
      .catch(e => {
        console.log('Error getting recent searches', e);
      });
  }

  handleSelectOption(option: any) {
    console.log('option ', option, ' has been clicked!');
  }

  //         <div class="container" ref={el => (this.container = el as HTMLDivElement)} >
  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">Recent Searches</p>
          <div class="items">
            {this.options?.map(option => (
              <button class="button" innerHTML={SearchIcon} onClick={() => this.handleSelectOption(option)}>
                {option.params.q}
              </button>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}
