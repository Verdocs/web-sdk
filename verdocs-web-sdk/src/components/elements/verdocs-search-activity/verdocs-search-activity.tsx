import {loadSession} from '@verdocs/js-sdk/Users/Auth';
import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {getSearchHistory} from '@verdocs/js-sdk/Search/Content';
import {getTemplates} from '@verdocs/js-sdk/Templates/Templates';
import {IRecentSearch, ISavedSearch} from '@verdocs/js-sdk/Search/Types';
import {Component, h, Prop, Event, EventEmitter, State} from '@stencil/core';
import DocumentIcon from './document-icon.svg';

const SOURCE = 'verdocs-stage';

/**
 * Display a list of starred items.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 */
@Component({
  tag: 'verdocs-search-activity',
  styleUrl: 'verdocs-search-activity.scss',
  shadow: false,
})
export class VerdocsSearchActivity {
  @Prop() type: 'recent' | 'saved' | 'starred' = 'recent';

  @Prop() options: any;

  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) entrySelected: EventEmitter<IRecentSearch>;

  @State() emptyMessage = 'You do not have any starred searches.';

  @State() authFailure = false;

  @State() title = 'Recent Searches';

  @State() recent: IRecentSearch[] = [];

  @State() saved: ISavedSearch[] = [];

  @State() starred: ITemplate[] = [];

  componentWillLoad() {
    loadSession(SOURCE);

    const errorHandler = e => {
      console.warn('[Verdocs/search-activity] Error getting search data', e);
      if (e?.response?.status === 401) {
        this.authFailure = true;
      }
    };

    switch (this.type) {
      case 'recent':
        this.title = 'Recent Searches';
        this.emptyMessage = 'You do not have any recent searches.';
        getSearchHistory()
          .then(r => (this.recent = r.recent))
          .catch(errorHandler);
        break;

      case 'saved':
        this.title = 'Saved Searches';
        this.emptyMessage = 'You do not have any saved searches.';
        getSearchHistory()
          .then(r => (this.saved = r.saved))
          .catch(errorHandler);
        break;

      case 'starred':
        this.title = 'My Starred items';
        this.emptyMessage = 'You do not have any starred templates.';
        getTemplates({is_starred: true})
          .then(r => (this.starred = r))
          .catch(errorHandler);
        break;
    }
  }

  handleSelectEntry(entry: any) {
    this.entrySelected.emit(entry);
  }

  computePagesText(pages) {
    if (pages < 2) {
      return `${pages} Page`;
    } else {
      return `${pages} Pages`;
    }
  }

  computeRecipientsText(recipients) {
    if (typeof recipients === 'object') {
      return recipients.join(', ');
    } else if (recipients > 1) {
      return `${recipients} Recipients`;
    } else {
      return `${recipients} Recipient`;
    }
  }

  render() {
    const showEmpty = this.recent.length < 1 && this.saved.length < 1 && this.starred.length < 1;

    return (
      <div class="container">
        <p class="title">{this.title}</p>

        <div class="items">
          {this.recent.map(recent => (
            <button class="item" onClick={() => this.handleSelectEntry(recent)}>
              <div class="icon" innerHTML={DocumentIcon} />
              <div class="details">
                <div class="item-title">{recent.params.q}</div>
                <div class="info">Test</div>
              </div>
            </button>
          ))}

          {this.saved.map(option => (
            <button class="item" onClick={() => this.handleSelectEntry(option)}>
              <div class="icon" innerHTML={DocumentIcon} />
              <div class="details">
                <div class="item-title">{option.params.q}</div>
                <div class="info">
                  {/*{option.pages ? `${this.computePagesText(option.pages)} ` : ''}*/}
                  {/*{option.recipients ? this.computeRecipientsText(option.recipients) : ''}*/}
                </div>
              </div>
            </button>
          ))}

          {showEmpty && <div class="empty">{this.authFailure ? 'Authentication required' : this.emptyMessage}</div>}
        </div>
      </div>
    );
  }
}
