import {Component, Prop, Host, h} from '@stencil/core';
import {TDocumentStatus} from '@verdocs/js-sdk/Documents/Documents';
import PendingIcon from './pending.svg';
import CheckIcon from './check.svg';
import StopIcon from './stop.svg';
import XIcon from './x.svg';

/**
 * Displays an icon and message describing a document's completion status.
 */
@Component({
  tag: 'verdocs-document-status',
  styleUrl: 'verdocs-document-status.scss',
})
export class VerdocsDocumentStatus {
  /**
   * The status to display
   */
  @Prop() status: TDocumentStatus;

  render() {
    let icon;
    let statusMessage;

    switch (this.status) {
      case 'complete':
        icon = CheckIcon;
        statusMessage = 'Completed';
        break;
      case 'pending':
        icon = PendingIcon;
        statusMessage = 'Pending';
        break;
      case 'in progress':
        icon = PendingIcon;
        statusMessage = 'In Progress';
        break;
      case 'canceled':
        icon = XIcon;
        statusMessage = 'Cancelled';
        break;
      case 'declined':
        icon = StopIcon;
        statusMessage = 'Declined';
        break;
    }

    return (
      <Host>
        <span class="icon" innerHTML={icon} />
        <span class="content">{statusMessage}</span>
      </Host>
    );
  }
}
