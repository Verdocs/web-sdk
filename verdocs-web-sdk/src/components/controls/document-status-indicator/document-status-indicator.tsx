import {Component, Prop, h} from '@stencil/core';
import {IDocumentStatus} from '@verdocs/js-sdk/Documents/Documents';
import CancelledIcon from './cancelled-icon.svg';
import DeclinedIcon from './declined-icon.svg';
import FinishedIcon from './finished-icon.svg';
import PendingIcon from './pending-icon.svg';

/**
 * Displays an icon and message describing a document's status of completion.
 */
@Component({
  tag: 'document-status-indicator',
  styleUrl: 'document-status-indicator.scss',
})
export class DocumentStatusIndicator {
  /**
   * The status to display
   */
  @Prop() status: IDocumentStatus;

  render() {
    let icon;
    let statusMessage;

    switch (this.status) {
      case 'complete':
        icon = FinishedIcon;
        statusMessage = 'Complete';
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
        icon = CancelledIcon;
        statusMessage = 'Cancelled';
        break;
      case 'declined':
        icon = DeclinedIcon;
        statusMessage = 'Declined';
        break;
    }

    return (
      <div class="container">
        <span class="icon" innerHTML={icon} />
        <span class="content">{statusMessage}</span>
      </div>
    );
  }
}
