import {IRecentSearch} from '@verdocs/js-sdk/Search/Types';
import {getSearchHistory} from '@verdocs/js-sdk/Search/Content';
import {Component, Host, h, Prop, State, Event, EventEmitter} from '@stencil/core';
import SearchIcon from './search-icon.svg';

/**
 * Display a list of recent searches. Note that only some types of searches are automatically saved in the
 * user's history (those that contain a unique `q` query string from the next-most-recent search.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 */
@Component({
  tag: 'search-recent',
  styleUrl: 'search-recent.scss',
})
export class SearchRecent {
  /**
   * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries
   * that cannot currently be increased (only reduced).
   */
  @Prop() limit: number = 10;

  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) entrySelected: EventEmitter<IRecentSearch>;

  @State() recent: IRecentSearch[] = [];

  @State() emptyMessage = 'You do not have any recent searches.';

  componentDidLoad() {
    getSearchHistory()
      .then(r => {
        this.recent = r.recent;
        this.emptyMessage = 'You do not have any recent searches.';
      })
      .catch(e => {
        console.warn('[Verdocs/search-recent] Error getting reent searches', e);
        if (e?.response?.status === 401) {
          this.emptyMessage = 'Authenticated required.';
        }
      });
  }

  handleSelectEntry(entry: IRecentSearch) {
    this.entrySelected.emit(entry);
  }

  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">Recent Searches</p>
          <div class="items">
            {this.recent.slice(0, this.limit).map(entry => (
              <button class="button" innerHTML={SearchIcon} onClick={() => this.handleSelectEntry(entry)}>
                {entry.params.q}
              </button>
            ))}
            {this.recent.length < 1 && <div class="empty">{this.emptyMessage}</div>}
          </div>
        </div>
      </Host>
    );
  }
}
