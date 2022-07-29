import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop} from '@stencil/core';
import SearchIcon from './search.svg';
import CloseIcon from './close.svg';

export type TContentType = 'all' | 'document' | 'template' | 'organization';

export interface ISearchEvent {
  query: string;
  type: TContentType;
}

/**
 * Displays a customizable input box for search queries.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 */
@Component({
  tag: 'verdocs-search-box',
  styleUrl: 'verdocs-search-box.scss',
  shadow: false,
})
export class VerdocsSearchBox {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The placeholder to display in the input field.
   */
  @Prop() placeholder = 'search documents, templates, people...';

  /**
   * If set to a value other than 'all', a removeable filter indicator will be displayed.
   */
  @Prop() type: TContentType = 'all';

  /**
   * The text search string entered by the user.
   */
  @Prop() query = '';

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) searchClicked: EventEmitter<ISearchEvent>;

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) typeChanged: EventEmitter<TContentType>;

  /**
   * Event fired when the user changes the query string.
   */
  @Event({composed: true}) queryChanged: EventEmitter<string>;

  handleSearch(e) {
    this.searchClicked.emit({type: this.type, query: this.query});
    e.preventDefault();
    return false;
  }

  handleChange(e) {
    this.queryChanged.emit(e.target.value);
  }

  handleClearFilter() {
    this.typeChanged.emit('all');
  }

  handleKeyUp(e) {
    if (e.key === 'Enter') {
      this.searchClicked.emit({type: this.type, query: this.query});
    }
  }

  render() {
    return (
      <form onSubmit={e => this.handleSearch(e)}>
        {this.type !== undefined && this.type !== 'all' && (
          <span class="type">
            {this.type}s <button class="remove" innerHTML={CloseIcon} onClick={() => this.handleClearFilter()} />
          </span>
        )}
        <input type="text" placeholder={this.placeholder} value={this.query} onInput={e => this.handleChange(e)} onKeyUp={e => this.handleKeyUp(e)} />
        <button onClick={e => this.handleSearch(e)} class="search">
          <span innerHTML={SearchIcon} />
          Search
        </button>
      </form>
    );
  }
}
