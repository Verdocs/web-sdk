import {IRecentSearch} from '@verdocs/js-sdk/Search/Types';
import {Component, Host, h, Prop, Event, EventEmitter, State} from '@stencil/core';
import DocumentIcon from './document-icon.svg';

/**
 * Display a list of starred items.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 */
@Component({
  tag: 'search-starred',
  styleUrl: 'search-starred.scss',
})
export class SearchStarred {
  @Prop() options: any;

  /**
   * Event fired when an entry is clicked.
   */
  @Event({composed: true}) entrySelected: EventEmitter<IRecentSearch>;

  @State() emptyMessage = 'You do not have any starred searches.';

  componentDidLoad() {
    // TODO
    // getStarred()
    //   .then(r => {
    //     this.saved = r.saved;
    //     this.emptyMessage = 'You do not have any saved searches.';
    //   })
    //   .catch(e => {
    //     console.warn('[Verdocs/search-recent] Error getting saved searches', e);
    //     if (e?.response?.status === 401) {
    //       this.emptyMessage = 'Authenticated required.';
    //     }
    //   });
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
    return (
      <Host>
        <div class="container">
          <p class="title">My Starred Items</p>
          <div class="items">
            {this.options?.map(option => (
              <button class="item" onClick={() => this.handleSelectEntry(option)}>
                <div class="icon" innerHTML={DocumentIcon} />
                <div class="details">
                  <div class="item-title">{option.params.q}</div>
                  <div class="info">
                    {option.pages ? `${this.computePagesText(option.pages)} ` : ''}
                    {option.recipients ? this.computeRecipientsText(option.recipients) : ''}
                  </div>
                </div>
              </button>
            ))}
            {(this.options?.length || []) < 1 && <div class="empty">{this.emptyMessage}</div>}
          </div>
        </div>
      </Host>
    );
  }
}
