import {Component, h, Prop} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';

@Component({
  tag: 'verdocs-search',
  styleUrl: 'verdocs-search.scss',
  shadow: false,
})
export class VerdocsSearch {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  render() {
    return (
      <div class="container">
        <verdocs-search-box endpoint={this.endpoint} />

        <div class="boxes">
          <verdocs-search-activity type="recent" endpoint={this.endpoint} />
          <verdocs-search-activity type="saved" endpoint={this.endpoint} />
          <verdocs-search-activity type="starred" endpoint={this.endpoint} />
          <verdocs-quick-functions endpoint={this.endpoint} />
        </div>
      </div>
    );
  }
}
