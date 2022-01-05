import {Component, h} from '@stencil/core';

@Component({
  tag: 'verdocs-search',
  styleUrl: 'verdocs-search.scss',
  shadow: false,
})
export class VerdocsSearch {
  render() {
    return (
      <div class="container">
        <search-box />

        <div class="boxes">
          <search-recent/>
          <search-starred/>
          <search-saved/>
          <search-quick-functions/>
        </div>
      </div>
    );
  }
}
