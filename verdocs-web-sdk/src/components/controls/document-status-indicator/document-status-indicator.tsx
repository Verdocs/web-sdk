import {Component, Prop, h} from '@stencil/core';

import CancelledIcon from './cancelled-icon.svg';
import DeclinedIcon from './declined-icon.svg';
import FinishedIcon from './finished-icon.svg';
import PendingIcon from './pending-icon.svg';

/**
 * Displays a message describing a document's status of completion
 *
 * ```typescript
 *
 * ```
 */
@Component({
  tag: 'document-status-indicator',
  styleUrl: 'document-status-indicator.css',
  shadow: true,
})
export class DocumentStatusIndicator {
  /**
   * The status to display
   */
  @Prop() status: 'finished' | 'complete' | 'pending' | 'in-progress' | 'declined' | 'cancelled';

  /**
   * The "theme" to be used
   */
  @Prop() theme: 'light' | 'dark';

  render() {
    let icon;
    let statusMessage;

    switch(this.status) {
      case 'finished':
        icon = FinishedIcon
        statusMessage = 'Complete'
        break;
      case 'complete':
        // Change with a specific icon
        icon = FinishedIcon
        statusMessage = 'Complete'
        break;
      case 'in-progress':
        // Change with a specific icon
        icon = PendingIcon
        statusMessage = 'In Progress'
        break;
      case 'pending':
        // Change with a specific icon
        icon = PendingIcon
        statusMessage = 'Pending'
        break;
      case 'cancelled':
        icon = CancelledIcon
        statusMessage = 'Cancelled'
        break;
      case 'declined':
        // Change with a specific icon
        icon = DeclinedIcon
        statusMessage = 'Declined'
        break;
    }
    

    return (
      <div class="container">
        <span class="icon" innerHTML={icon}/>
        <span class="content">{statusMessage}</span>
      </div>);
  }
}
