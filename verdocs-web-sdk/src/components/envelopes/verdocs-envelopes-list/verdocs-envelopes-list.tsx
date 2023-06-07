import {Component, Prop, Host, h, State} from '@stencil/core';
import {IEnvelope, TEnvelopeStatus, TRecipientStatus} from '@verdocs/js-sdk/Envelopes/Types';

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
  tag: 'verdocs-envelopes-list',
  styleUrl: 'verdocs-envelopes-list.scss',
})
export class VerdocsEnvelopesList {
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

  componentDidLoad() {}

  render() {
    return <Host></Host>;
  }
}
