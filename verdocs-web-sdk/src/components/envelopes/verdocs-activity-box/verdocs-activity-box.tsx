import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {IEnvelope} from '@verdocs/js-sdk/Envelopes/Types';
import {formatShortTimeAgo} from '@verdocs/js-sdk/Utils/DateTime';
import {getNextRecipient} from '@verdocs/js-sdk/Envelopes/Permissions';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {SDKError} from '../../../utils/errors';
import {integerSequence} from '@verdocs/js-sdk/Utils/Primitives';

const EmptyImage = 'https://verdocs-public-assets.s3.amazonaws.com/no-verdocs.png';

/**
 * Displays a box showing summaries of envelopes matching specified conditions. Activity Boxes show a fixed number
 * of items because they are meant to be laid out horizontally (if the user's screen is large enough) and this helps
 * them appear more visually balanced.
 */
@Component({
  tag: 'verdocs-activity-box',
  styleUrl: 'verdocs-activity-box.scss',
})
export class VerdocsActivityBox {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The number of items to display.
   */
  @Prop() items: number = 5;

  // The filtered view to display. "completed" will show envelopes that have been submitted. "action" will
  // show envelopes where the user is a recipient and the envelope is not completed. "waiting" will show
  // only envelopes where the user is the sender and the envelope is not completed.
  @Prop() view?: 'completed' | 'action' | 'waiting' = undefined;

  /**
   * The title to display on the box ("title" is a reserved word). This is optional, and if not set, the title
   * will be derived from the view. Set this to an empty string to hide the header.
   */
  @Prop() header?: string | undefined = undefined;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user clicks an activity entry. Typically the host application will use this to navigate
   * to the envelope detail view.
   */
  @Event({composed: true}) viewEnvelope: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope}>;

  /**
   * Event fired when the user clicks View All in the title bar. The current view will be included in the event
   * details to help the host application navigate the user to the appropriate screen for the request. Note that
   * the verdocs-envelopes-list control uses the same "view" parameter, so host applications can typically pass
   * this value through directly. This button is not visible if the header is hidden.
   */
  @Event({composed: true}) viewAll: EventEmitter<{endpoint: VerdocsEndpoint; view: string}>;

  @State() title = '';
  @State() count = 0;
  @State() loading = true;
  @State() envelopes: IEnvelope[] = [];

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[ACTIVITIES] Must be authenticated');
        return;
      }

      const page = 0;
      let queryParams;
      switch (this.view) {
        case 'action':
          queryParams = {
            page,
            limit: 10,
            ascending: false,
            is_recipient: true,
            sort_by: 'updated_at',
            envelope_status: ['pending', 'in progress'],
            recipient_status: ['invited', 'opened', 'signed'],
          };

          if (this.header === undefined) {
            this.title = 'Action Required';
          }

          break;

        case 'waiting':
          queryParams = {
            page,
            limit: 10,
            is_owner: true,
            ascending: false,
            sort_by: 'updated_at',
            envelope_status: ['pending', 'in progress'],
          };

          if (this.header === undefined) {
            this.title = 'Waiting on Others';
          }

          break;

        case 'completed':
        default:
          queryParams = {
            page,
            limit: 10,
            ascending: false,
            sort_by: 'updated_at',
            envelope_status: ['complete'],
          };

          if (this.header === undefined) {
            this.title = 'Completed';
          }

          break;
      }

      const response = await Envelopes.searchEnvelopes(this.endpoint, queryParams);
      console.log('[ACTIVITIES] Got envelopes', response);
      this.envelopes = response.result;
      this.count = response.total;
      this.loading = false;
    } catch (e) {
      console.log('[ACTIVITIES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  getNextRecipientName(envelope: IEnvelope) {
    const nextRecipient = getNextRecipient(envelope) || envelope.recipients?.[0];
    return nextRecipient?.full_name || 'N/A';
  }

  render() {
    if (this.loading) {
      return (
        <Host style={{minHeight: '300px'}}>
          {this.title && (
            <div class="box-title">
              {this.title} <span class="count">(0)</span>
            </div>
          )}

          {integerSequence(0, this.items).map(() => (
            <div class="loading-placeholder">
              <div class="loading-placeholder-bg"></div>
            </div>
          ))}
        </Host>
      );
    }

    return (
      <Host>
        {this.title && (
          <div class="box-title">
            {this.title} <span class="count">({this.count})</span>
            <div class="spacer" />
            <verdocs-button label="View All" size="small" onClick={() => this.viewAll?.emit({endpoint: this.endpoint, view: this.view})} />
          </div>
        )}

        {this.count > 0 ? (
          this.envelopes.slice(0, Math.max(this.items, 1)).map(envelope => (
            <div
              class="activity-entry"
              onClick={() => {
                this.viewEnvelope?.emit({endpoint: this.endpoint, envelope});
              }}
            >
              <div class="title">
                {envelope.name}
                <br /> <strong>{this.getNextRecipientName(envelope)}</strong>
              </div>
              <div class="time-ago">{formatShortTimeAgo(envelope.updated_at)}</div>
            </div>
          ))
        ) : (
          <img src={EmptyImage} alt="No documents to show" style={{width: '190px', margin: '0 auto'}} />
        )}
      </Host>
    );
  }
}
