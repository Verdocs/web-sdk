import {IRecentSearch} from '@verdocs/js-sdk/dist/Search/Types';
import {getSearchHistory} from '@verdocs/js-sdk/dist/Search/Content';
import {Component, Host, h, Prop, State, Event, EventEmitter} from '@stencil/core';
import SearchIcon from './search-icon.svg';

/**
 * Display a list of recent searches. Note that only some types of searches are automatically saved in the
 * user's history (those that contain a unique `q` query string from the next-most-recent search.
 */
@Component({
  tag: 'search-recent',
  styleUrl: 'search-recent.css',
  shadow: true,
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

  componentDidLoad() {
    getSearchHistory()
      .then(r => {
        this.recent = r.recent;
      })
      .catch(e => console.warn('[Verdocs/search-recent] Error getting search history', e));
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
                {entry.params.type && <span class="pill">type: {entry.params.type}</span>}
                {entry.params.q}
              </button>
            ))}
          </div>
        </div>
      </Host>
    );
  }
}
