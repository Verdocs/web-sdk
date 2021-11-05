import {ISavedSearch} from '@verdocs/js-sdk/Search/Types';
import {getSearchHistory} from '@verdocs/js-sdk/Search/Content';
import {Component, Host, h, Prop, State, Event, EventEmitter} from '@stencil/core';
import SearchIcon from './search-icon.svg';

/**
 * Display a list of saved searches. Note that only some types of searches are automatically saved in the
 * user's history (those that contain a unique `q` query string from the next-most-recent search.
 */
@Component({
  tag: 'search-saved',
  styleUrl: 'search-saved.scss',
})
export class SearchSaved {
  /**
   * If set, limits the number of entries that will be shown. Note that there is a server-imposed limit of 20 entries
   * that cannot currently be increased (only reduced).
   */
  @Prop() limit: number = 10;

  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) entrySelected: EventEmitter<ISavedSearch>;

  @State() saved: ISavedSearch[] = [];

  componentDidLoad() {
    getSearchHistory()
      .then(r => {
        this.saved = r.saved;
      })
      .catch(e => console.warn('[Verdocs/search-saved] Error getting search history', e));
  }

  handleSelectEntry(entry: ISavedSearch) {
    this.entrySelected.emit(entry);
  }

  render() {
    return (
      <Host>
        <div class="container">
          <p class="title">Saved Searches</p>
          <div class="items">
            {this.saved.slice(0, this.limit).map(entry => (
              <button class="button" innerHTML={SearchIcon} onClick={() => this.handleSelectEntry(entry)}>
                {entry.name}
              </button>
            ))}
            {this.saved.length < 1 && <div class="empty">You do not have any saved searches.</div>}
          </div>
        </div>
      </Host>
    );
  }
}
