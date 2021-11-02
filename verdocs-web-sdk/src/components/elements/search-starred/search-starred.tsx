import {Component, Host, h, Prop} from '@stencil/core';

import DocumentIcon from './document-icon.svg';

@Component({
  tag: 'search-starred',
  styleUrl: 'search-starred.css',
  shadow: true,
})
export class SearchStarred {
  @Prop() options: any;

  handleSelectOption(option: any) {
    console.log('option ', option, ' has been clicked!');
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
              <button class="item" onClick={() => this.handleSelectOption(option)}>
                <div class="icon" innerHTML={DocumentIcon} />
                <div class="details">
                  <span class="item-title">{option.params.q}</span>
                  <span class="info">
                    {option.pages ? `${this.computePagesText(option.pages)} ` : ''}
                    {option.recipients ? this.computeRecipientsText(option.recipients) : ''}
                  </span>
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
