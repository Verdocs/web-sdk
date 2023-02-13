import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, Method} from '@stencil/core';

const SearchIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.4809 20.7176L17.9111 15.2536C19.0961 13.6368 19.727 11.6926 19.7128 9.70131C19.7201 7.53345 18.9846 5.42606 17.6244 3.71753C16.2642 2.009 14.3581 0.798456 12.2123 0.280282C10.0665 -0.237892 7.80552 -0.0336342 5.79227 0.86026C3.77902 1.75415 2.13038 3.28582 1.1111 5.20931C0.0918114 7.1328 -0.238985 9.33652 0.171813 11.4666C0.582612 13.5967 1.71117 15.5296 3.37628 16.9548C5.0414 18.3801 7.14646 19.2151 9.35344 19.3257C11.5604 19.4364 13.7413 18.8162 15.5458 17.5649L21.1372 23.05L21.1563 23.0663C21.4841 23.3487 21.9039 23.507 22.3401 23.5128C22.7823 23.5125 23.2063 23.3402 23.5191 23.0337V23.0337C23.6749 22.8812 23.7979 22.6995 23.8804 22.4993C23.963 22.2991 24.0036 22.0847 23.9997 21.8688C23.9959 21.6529 23.9477 21.44 23.858 21.2428C23.7683 21.0456 23.639 20.8682 23.4778 20.7212L23.4809 20.7176ZM14.5167 14.1975C13.4564 15.2349 12.0623 15.8797 10.5719 16.022C9.08145 16.1644 7.58681 15.7955 6.34249 14.9781C5.09816 14.1608 4.18109 12.9456 3.74751 11.5395C3.31393 10.1334 3.39064 8.6233 3.96455 7.26643C4.53846 5.90955 5.57409 4.7898 6.89507 4.09787C8.21606 3.40594 9.74071 3.18461 11.2093 3.4716C12.678 3.75858 13.9998 4.53612 14.9497 5.6718C15.8996 6.80748 16.4188 8.23105 16.4189 9.7001C16.4196 10.5357 16.2519 11.3632 15.9254 12.135C15.599 12.9069 15.1202 13.6078 14.5167 14.1975V14.1975Z" fill="white"/></svg>`;

const CloseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.0739 11.7565L19.7127 6.23228C20.0875 5.85692 20.0875 5.25309 19.7127 4.87773L19.0213 4.20046C18.6382 3.82511 18.0219 3.82511 17.6387 4.20046L12 9.72472L6.36127 4.20046C5.97814 3.82511 5.36179 3.82511 4.97866 4.20046L4.28735 4.87773C3.90422 5.25309 3.90422 5.85692 4.28735 6.23228L9.92608 11.7565L4.28735 17.2808C3.90422 17.6561 3.90422 18.26 4.28735 18.6353L4.97866 19.3126C5.36179 19.688 5.97814 19.688 6.36127 19.3126L12 13.7883L17.6387 19.3126C18.0219 19.688 18.6382 19.688 19.0213 19.3126L19.7127 18.6353C20.0958 18.26 20.0958 17.6561 19.7127 17.2808L14.0739 11.7565Z" fill="white"/></svg>`;

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
  private inputEl: HTMLInputElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The placeholder to display in the input field.
   */
  @Prop() placeholder = 'Search envelopes, templates, organizations...';

  /**
   * If set to a value other than 'all', a removeable filter indicator will be displayed.
   */
  @Prop() type: TContentType = 'all';

  /**
   * The text search string entered by the user.
   */
  @Prop() query = '';

  /**
   * If set, the input field will attempt to "grab" focus after being rendered.
   */
  @Prop() grabsFocus = false;

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

  @Method() async focusField() {
    this.inputEl.focus();
  }

  componentDidRender() {
    if (this.grabsFocus) {
      this.inputEl.focus();
    }
  }

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
        <input
          type="text"
          value={this.query}
          placeholder={this.placeholder}
          onInput={e => this.handleChange(e)}
          onKeyUp={e => this.handleKeyUp(e)}
          ref={el => (this.inputEl = el)}
        />
        <button onClick={e => this.handleSearch(e)} class="search">
          <span innerHTML={SearchIcon} />
          Search
        </button>
      </form>
    );
  }
}
