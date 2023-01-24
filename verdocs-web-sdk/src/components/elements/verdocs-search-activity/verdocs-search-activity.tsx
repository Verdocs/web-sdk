import {ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {getSearchHistory} from '@verdocs/js-sdk/Search/Content';
import {getTemplates} from '@verdocs/js-sdk/Templates/Templates';
import {IRecentSearch, ISavedSearch} from '@verdocs/js-sdk/Search/Types';
import {Component, h, Prop, Event, EventEmitter, State} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';

const DocumentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`;

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
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

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
    this.endpoint.loadSession();

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
        getSearchHistory(this.endpoint)
          .then(r => (this.recent = r.recent))
          .catch(errorHandler);
        break;

      case 'saved':
        this.title = 'Saved Searches';
        this.emptyMessage = 'You do not have any saved searches.';
        getSearchHistory(this.endpoint)
          .then(r => (this.saved = r.saved))
          .catch(errorHandler);
        break;

      case 'starred':
        this.title = 'My Starred items';
        this.emptyMessage = 'You do not have any starred templates.';
        getTemplates(this.endpoint, {is_starred: true})
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
