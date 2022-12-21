import {RecipientFlow} from './recipient-flow';
import {createPopper, Instance} from '@popperjs/core';
import {Component, Prop, Host, h, State} from '@stencil/core';
import {IEnvelope, TEnvelopeStatus, TRecipientStatus} from '@verdocs/js-sdk/Envelopes/Types';
import AcceptedLight from './accepted-light.svg';
import AcceptedDark from './accepted-dark.svg';
import CanceledLight from './canceled-light.svg';
import CanceledDark from './canceled-dark.svg';
import CompletedLight from './complete-light.svg';
import CompletedDark from './complete-dark.svg';
import DeclinedLight from './declined-light.svg';
import DeclinedDark from './declined-dark.svg';
import InProgressLight from './in-progress-light.svg';
import InProgressDark from './in-progress-dark.svg';
import OpenedLight from './opened-light.svg';
import OpenedDark from './opened-dark.svg';
import PendingLight from './pending-light.svg';
import PendingDark from './pending-dark.svg';
import SignedLight from './signed-light.svg';
import SignedDark from './signed-dark.svg';
import SomeSignedLight from './some-signed-light.svg';
import SomeSignedDark from './some-signed-dark.svg';
import SubmittedLight from './submitted-light.svg';
import SubmittedDark from './submitted-dark.svg';

const ENTRY_WIDTH = 140;
const ENTRY_HEIGHT = 40;
const ENTRY_PADDING = 40;

/**
 * Displays an icon and message describing a document's completion status. For convenience, the status may be passed in either
 * directly as a status field or the whole document object may be passed in.
 *
 * If the document is provided, the status flag will indicate the document's overall status. This also makes the component clickable
 * to display a popup panel with per-recipient status data.
 *
 * If the status is provided as a string it can be either a `TRecipientStatus` or `TDocumentStatus` value.
 */
@Component({
  tag: 'verdocs-status-indicator',
  styleUrl: 'verdocs-status-indicator.scss',
})
export class VerdocsStatusIndicator {
  private summaryComponent?: HTMLButtonElement;
  private detailPanel?: HTMLDivElement;
  private popper?: Instance;

  /**
   * The size (height) of the indicator. The small variant is suitable for use in densely populated components such as table rows.
   */
  @Prop() size: 'small' | 'normal' = 'normal';

  /**
   * The theme to use for diplay.
   */
  @Prop() theme?: 'dark' | 'light' = 'light';

  /**
   * The status to display.
   */
  // The accepted override is here because we don't actually have an official status for that yet, but we plan to add it
  @Prop() status?: TEnvelopeStatus | TRecipientStatus | 'accepted';

  /**
   * The document to display status for. Ignored if `status` is set directly.
   */
  @Prop() envelope?: IEnvelope;

  @State() isOpen: boolean;

  @State() recipientStatusIcons = [];

  @State() containerId = `verdocs-status-indicator-${Math.random().toString(36).substring(2, 11)}`;

  componentDidLoad() {
    this.popper = createPopper(this.summaryComponent, this.detailPanel, {placement: 'bottom-start', modifiers: [{name: 'offset', options: {offset: [0, 10]}}]});

    if (this.envelope?.recipients) {
      const recipientsAtLevel = [];
      this.envelope.recipients.forEach(recipient => {
        const level = recipient.sequence - 1;
        recipientsAtLevel[level] ||= [];
        const id = `r-${level}-${recipientsAtLevel[level].length}`;
        recipientsAtLevel[level].push({...recipient, id});
      });

      const levelCount = Object.keys(recipientsAtLevel).length;

      const canvasHeight = levelCount * ENTRY_HEIGHT + (levelCount + 1) * ENTRY_PADDING;
      let canvasWidth = 0;
      Object.values(recipientsAtLevel).forEach(recipients => {
        let minW = recipients.length * ENTRY_WIDTH + (recipients.length + 1) * ENTRY_PADDING;
        if (minW > canvasWidth) {
          canvasWidth = minW;
        }
      });

      const entities = [];
      const lines = [];
      const statusIcons = [];

      let y = ENTRY_PADDING;
      Object.entries(recipientsAtLevel).forEach(([level, recipients]) => {
        // To center align here, we figure out how many items are per line and how much leftover space there would be if we just
        // drew them left-to-right. We add half of that as a left offset.
        const renderedItemsWidth = recipients.length * (ENTRY_WIDTH + ENTRY_PADDING);
        const leftoverSpace = canvasWidth - renderedItemsWidth;
        const leftOffset = ENTRY_PADDING / 2 + leftoverSpace / 2;

        recipients.forEach((recipient, index) => {
          const [first, last] = (recipient.full_name || 'Unknown').toUpperCase().split(' ');
          const name = `${first} ${last?.substring(0, 1)}`;
          const entity = {
            id: recipient.id,
            text: name,
            icon: this.getStatusIcon(recipient.status),
            x: index * (ENTRY_WIDTH + ENTRY_PADDING) + leftOffset,
            y,
            width: ENTRY_WIDTH,
            height: ENTRY_HEIGHT,
            color: this.getStatusColor(recipient.status),
            radius: 8,
          };
          entities.push(entity);

          statusIcons.push({
            icon: this.getStatusIcon(recipient.status),
            x: index * (ENTRY_WIDTH + ENTRY_PADDING) + leftOffset + (ENTRY_WIDTH - 32),
            y: y + ENTRY_HEIGHT / 2 - 13,
          });

          recipientsAtLevel[+level - 1]?.forEach(prevRecip => {
            const line = {
              id: `line-${prevRecip.id}-${entity.id}`,
              from: {element: prevRecip.id, point: 'bottom'},
              to: {element: entity.id, point: 'top'},
              color: this.getStatusColor(recipient.status),
            };
            lines.push(line);
          });
        });

        y += ENTRY_HEIGHT + ENTRY_PADDING;
      });

      this.recipientStatusIcons = statusIcons;

      const diagram = RecipientFlow();
      diagram.initalize(`#${this.containerId}`, canvasWidth, canvasHeight);
      diagram.update({entities, lines});
    }
  }

  // See https://popper.js.org/docs/v2/tutorial/
  // What we're doing here is clearing event listeners when they aren't needed, to increase performance in lists
  showDropdown() {
    this.isOpen = true;
    this.detailPanel.setAttribute('data-show', '');
    this.detailPanel.removeAttribute('aria-hidden');

    this.popper?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers, {name: 'eventListeners', enabled: true}],
    }));

    this.popper?.update();
  }

  handleHideDropdown(e: any) {
    if (e?.target?.localName === 'button' && e?.target?.className === 'arrow') {
      // This event is fired when a menu element is clicked because the button "loses focus" then too
      return;
    }

    this.hide();
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.showDropdown();
    }
  }

  hide() {
    this.isOpen = false;
    this.detailPanel.removeAttribute('data-show');
    this.detailPanel.setAttribute('aria-hidden', 'true');
    this.popper?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers, {name: 'eventListeners', enabled: false}],
    }));
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'invited':
      case 'opened':
      case 'accepted':
      case 'signed':
        return '#654dcb';
      case 'some-signed':
      case 'submitted':
      case 'complete':
        return '#55bc81';
      case 'declined':
        return '#ff0000';
      case 'canceled':
      case 'in progress':
      case 'pending':
      default:
        return '#999999';
    }
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'accepted':
        return this.theme === 'light' ? AcceptedLight : AcceptedDark;
      case 'complete':
        return this.theme === 'light' ? CompletedLight : CompletedDark;
      case 'in progress':
        return this.theme === 'light' ? InProgressLight : InProgressDark;
      case 'canceled':
        return this.theme === 'light' ? CanceledLight : CanceledDark;
      case 'declined':
        return this.theme === 'light' ? DeclinedLight : DeclinedDark;
      case 'invited':
        return this.theme === 'light' ? InProgressLight : InProgressDark;
      case 'opened':
        return this.theme === 'light' ? OpenedLight : OpenedDark;
      case 'signed':
        return this.theme === 'light' ? SignedLight : SignedDark;
      case 'submitted':
        return this.theme === 'light' ? SubmittedLight : SubmittedDark;
      case 'some-signed':
        return this.theme === 'light' ? SomeSignedLight : SomeSignedDark;
      default:
      case 'pending':
        return this.theme === 'light' ? PendingLight : PendingDark;
    }
  }

  getStatusMessage(status: string) {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'complete':
        return 'Completed';
      case 'in progress':
        return 'In Progress';
      case 'canceled':
        return 'Cancelled';
      case 'declined':
        return 'Declined';
      case 'invited':
        return 'Invited';
      case 'opened':
        return 'Opened';
      case 'signed':
        return 'Signed';
      case 'submitted':
        return 'Submitted';
      case 'some-signed':
        return 'Partly Signed';
      default:
      case 'pending':
        return 'Pending';
    }
  }

  render() {
    // The extra fallback for accepted is to future proof for when we add that.
    let status: string = this.status || this.envelope?.status || 'pending' || 'accepted';
    if (!this.status && this.envelope?.recipients) {
      const submittedRecipients = this.envelope.recipients.filter(r => r.status === 'submitted');
      if (submittedRecipients.length > 0 && submittedRecipients.length !== this.envelope.recipients.length) {
        status = 'some-signed';
      }
    }

    const icon = this.getStatusIcon(status);
    const statusMessage = this.getStatusMessage(status);

    return (
      <Host
        ref={el => (this.summaryComponent = el as HTMLButtonElement)}
        class={`${this.theme} ${this.size} ${this.envelope ? 'has-document' : ''}`}
        aria-label="Click to View Details"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          this.envelope && this.toggleDropdown();
        }}
        onBlur={e => this.envelope && this.handleHideDropdown(e)}
      >
        <span class="icon" innerHTML={icon} />
        <span class="content">{statusMessage}</span>

        <div class="detail-panel" ref={el => (this.detailPanel = el as HTMLDivElement)}>
          <div id={`${this.containerId}`} />
          {this.recipientStatusIcons.map(icon => (
            <span innerHTML={icon.icon} style={{position: 'absolute', top: `${icon.y}px`, left: `${icon.x}px`}} />
          ))}
        </div>
      </Host>
    );
  }
}
