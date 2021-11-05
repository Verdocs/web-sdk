import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';

import DocumentIcon from './document-icon.svg';
import {IRecentSearch} from '@verdocs/js-sdk/Search/Types';

/**
 * Display a list of starred items.
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
            {(this.options?.length || []) < 1 && <div class="empty">You do not have any starred items.</div>}
          </div>
        </div>
      </Host>
    );
  }
}
