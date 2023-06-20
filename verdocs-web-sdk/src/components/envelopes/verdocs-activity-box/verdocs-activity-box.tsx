import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {IActivityEntry} from '@verdocs/js-sdk/Envelopes/Types';
import {integerSequence} from '@verdocs/js-sdk/Utils/Primitives';
import {formatShortTimeAgo} from '@verdocs/js-sdk/Utils/DateTime';
import {Component, Prop, Host, h, State, Event, EventEmitter, Watch} from '@stencil/core';
import {SDKError} from '../../../utils/errors';

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

  /**
   * The filtered view to display. "completed" will show envelopes that have been submitted. "action" will
   * show envelopes where the user is a recipient and the envelope is not completed. "waiting" will show
   * only envelopes where the user is the sender and the envelope is not completed.
   */
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
  @Event({composed: true}) viewEnvelope: EventEmitter<{endpoint: VerdocsEndpoint; entry: IActivityEntry}>;

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
  @State() entries: IActivityEntry[] = [];

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();
      if (!this.endpoint.session) {
        console.log('[ACTIVITIES] Must be authenticated');
        return;
      }

      this.loadActivity();
    } catch (e) {
      console.log('[ACTIVITIES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  @Watch('items')
  handleItemsUpdated() {
    return this.loadActivity();
  }

  @Watch('view')
  handleViewUpdated() {
    return this.loadActivity();
  }

  async loadActivity() {
    this.loading = true;

    const r = await Envelopes.getSummary(this.endpoint, 0);

    let defaultHeader;
    if (this.view === 'action') {
      defaultHeader = 'Action Required';
      this.entries = r.action_required.result;
      this.count = r.action_required.total;
    } else if (this.view === 'waiting') {
      defaultHeader = 'Waiting on Others';
      this.entries = r.waiting_others.result;
      this.count = r.waiting_others.total;
    } else if (this.view === 'completed') {
      defaultHeader = 'Completed';
      this.entries = r.completed.result;
      this.count = r.completed.total;
    }

    this.title = this.header !== undefined ? this.header : defaultHeader;
    this.loading = false;
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
          this.entries.slice(0, Math.max(this.items, 1)).map(entry => (
            <div
              class="activity-entry"
              onClick={() => {
                this.viewEnvelope?.emit({endpoint: this.endpoint, entry});
              }}
            >
              <div class="title">
                {entry.name}
                <br /> <strong>{entry.recipient.name}</strong>
              </div>
              <div class="time-ago">{formatShortTimeAgo(entry.updated_at)}</div>
            </div>
          ))
        ) : (
          <img src={EmptyImage} alt="No documents to show" style={{width: '190px', margin: '0 auto'}} />
        )}
      </Host>
    );
  }
}
