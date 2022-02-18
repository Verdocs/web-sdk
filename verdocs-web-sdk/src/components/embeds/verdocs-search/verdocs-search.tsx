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
        <verdocs-search-box />

        <div class="boxes">
          <verdocs-search-activity type="recent" />
          <verdocs-search-activity type="saved" />
          <verdocs-search-activity type="starred" />
          <search-quick-functions />
        </div>
      </div>
    );
  }
}
