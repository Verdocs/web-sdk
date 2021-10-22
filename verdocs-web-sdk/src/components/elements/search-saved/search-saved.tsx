import { Component, Host, h, Prop } from '@stencil/core';

import SearchIcon from './search-icon.svg'

@Component({
  tag: 'search-saved',
  styleUrl: 'search-saved.css',
  shadow: true,
})
export class SearchSaved {
  @Prop() options: any;

  handleSelectOption(option: any) {
    console.log('option ', option, ' has been clicked!')
  }

  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">Saved Searches</p>
          <div class="items">
            {this.options?.map(option => (
              <button class="button" innerHTML={SearchIcon} onClick={() => this.handleSelectOption(option)} >
                {option.params.q}
              </button>
            ))}
          </div>
        </div>
      </Host>
    );
  }

}
