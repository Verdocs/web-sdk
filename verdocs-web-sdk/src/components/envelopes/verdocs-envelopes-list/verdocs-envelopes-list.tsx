import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {IEnvelope, TEnvelopeStatus} from '@verdocs/js-sdk/Envelopes/Types';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {cancelEnvelope, IEnvelopeSearchParams} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {getRecipientsWithActions, userCanAct, userCanCancelEnvelope} from '@verdocs/js-sdk/Envelopes/Permissions';
import {saveEnvelopesAsZip} from '../../../utils/utils';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const DocumentIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

// const ViewFilters: [string, string][] = [
//   ['all', 'All'],
//   ['inbox', 'Inbox'],
//   ['sent', 'Sent'],
//   ['completed', 'Completed'],
//   ['action', 'Action Required'],
//   ['waiting', 'Waiting on Others'],
// ];
//
// const StatusFilters: [string, string][] = [
//   ['all', 'All'],
//   ['pending', 'Pending'],
//   ['in progress', 'In Progress'],
//   ['complete', 'Completed'],
//   ['declined', 'Declined'],
//   ['canceled', 'Canceled'],
// ];
//
// const SortFilters: [string, string][] = [
//   ['created_at', 'Created'],
//   ['updated_at', 'Updated'],
//   ['canceled_at', 'Canceled'],
//   ['envelope_name', 'Name'],
//   ['envelope_status', 'Status'],
// ];

/**
 * Displays a list of envelopes matching specified conditions.
 */
@Component({
  tag: 'verdocs-envelopes-list',
  styleUrl: 'verdocs-envelopes-list.scss',
})
export class VerdocsEnvelopesList {
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
  @Prop({reflect: true}) view?: 'all' | 'inbox' | 'sent' | 'completed' | 'action' | 'waiting' = undefined;

  /**
   * The status value to filter by
   */
  @Prop({reflect: true}) status: TEnvelopeStatus | 'all' = 'all';

  /**
   * The sort field to use
   */
  @Prop({reflect: true}) sortBy: 'created_at' | 'updated_at' | 'envelope_name' | 'canceled_at' | 'envelope_status' = 'updated_at';

  /**
   * The first page nymbver to display (0-based)
   */
  @Prop({reflect: true}) page = 0;

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
   * Event fired when the user clicks to finish signing later. Typically the host application should redirect
   * the user to another page.
   */
  @Event({composed: true}) finishLater: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelope}>;

  /**
   * Event fired when the user clicks View All in the title bar. The current view will be included in the event
   * details to help the host application navigate the user to the appropriate screen for the request. Note that
   * the verdocs-envelopes-list control uses the same "view" parameter, so host applications can typically pass
   * this value through directly. This button is not visible if the header is hidden.
   */
  @Event({composed: true}) viewAll: EventEmitter<{endpoint: VerdocsEndpoint; view: string}>;

  @State() count = 0;
  @State() loading = true;
  @State() name = '';
  @State() containing = '';
  @State() selectedEnvelopes: IEnvelope[] = [];
  @State() envelopes: IEnvelope[] = [];

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[ENVELOPES] Must be authenticated');
        return;
      }

      let queryParams: IEnvelopeSearchParams = {
        page: this.page,
        limit: Math.min(Math.max(this.items, 1), 50),
        ascending: false,
        sort_by: 'updated_at',
      };

      switch (this.view) {
        case 'inbox':
          queryParams = {
            ...queryParams,
            is_recipient: true,
            sort_by: 'created_at',
            recipient_status: ['invited', 'declined', 'opened', 'signed', 'submitted', 'canceled'],
          };
          break;

        case 'sent':
          queryParams = {
            ...queryParams,
            is_owner: true,
            sort_by: 'created_at',
          };
          break;

        case 'action':
          queryParams = {
            ...queryParams,
            is_recipient: true,
            envelope_status: ['pending', 'in progress'],
            recipient_status: ['invited', 'opened', 'signed'],
          };
          break;

        case 'waiting':
          queryParams = {
            ...queryParams,
            is_owner: true,
            envelope_status: ['pending', 'in progress'],
          };
          break;

        case 'completed':
          queryParams = {
            ...queryParams,
            envelope_status: ['complete'],
          };
          break;

        default:
          queryParams = {
            ...queryParams,
            envelope_status: (this.status === 'all' ? ['pending', 'in progress', 'complete', 'declined', 'canceled'] : [this.status]) as TEnvelopeStatus[],
          };
      }

      // These filters should only be applied in "View All" mode. Otherwise the user could have set them to something
      // then changed the view e.g. to Inbox and the filter could break the view (e.g. View:Inbox, Status:Declined
      // would never return anything).
      if (this.view === 'all') {
        if (this.status !== 'all') {
          queryParams.envelope_status = [this.status as TEnvelopeStatus];
        }
      }

      if (this.name.trim()) {
        queryParams.name = this.name.trim();
      }

      if (this.containing.trim()) {
        queryParams.text_field_value = this.containing.trim();
      }

      const response = await Envelopes.searchEnvelopes(this.endpoint, queryParams);
      console.log('[ENVELOPES] Got envelopes', response);
      this.envelopes = response.result;
      this.count = response.total;
      this.loading = false;

      // let queryParams: IEnvelopeSearchParams = {
      //   page: 0,
      //   ascending: false,
      //   sort_by: 'updated_at',
      //   limit: Math.max(Math.min(this.items, 30), 1),
      // };
      //
      // let defaultHeader;
      // switch (this.view) {
      //   case 'action':
      //     queryParams = {...queryParams, is_recipient: true, envelope_status: ['pending', 'in progress'], recipient_status: ['invited', 'opened', 'signed']};
      //     defaultHeader = 'Action Required';
      //
      //     break;
      //
      //   case 'waiting':
      //     queryParams = {...queryParams, is_owner: true, ascending: false, envelope_status: ['pending', 'in progress']};
      //     defaultHeader = 'Waiting on Others';
      //     break;
      //
      //   case 'completed':
      //   default:
      //     queryParams = {...queryParams, envelope_status: ['complete']};
      //     defaultHeader = 'Completed';
      //     break;
      // }
      //
      // this.title = this.header !== undefined ? this.header : defaultHeader;
      //
      // const response = await Envelopes.searchEnvelopes(this.endpoint, queryParams);
      // console.log('[ENVELOPES] Got envelopes', response);
      // this.envelopes = response.result;
      // this.count = response.total;
      // this.loading = false;
    } catch (e) {
      console.log('[ENVELOPES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleDownload() {
    saveEnvelopesAsZip(VerdocsEndpoint.getDefault(), this.selectedEnvelopes)
      .then(() => {
        this.selectedEnvelopes = [];
      })
      .catch(e => {
        console.log('Download error', e);
        VerdocsToast('Download error: ' + e.message, {style: 'error'});
      });
  }

  downloadEnvelope(envelope: IEnvelope) {
    saveEnvelopesAsZip(VerdocsEndpoint.getDefault(), [envelope]).catch(e => {
      console.log('Download error', e);
      VerdocsToast('Download error: ' + e.message, {style: 'error'});
    });
  }

  render() {
    if (this.loading) {
      return (
        <Host style={{minHeight: '300px'}}>
          <verdocs-loader />
        </Host>
      );
    }

    return (
      <Host>
        <div class="header">
          <div class="filter">
            <verdocs-text-input
              id="verdocs-filter-name"
              value={this.name}
              autocomplete="off"
              placeholder="Filter by Name..."
              onInput={(e: any) => {
                this.name = e.target.value;
              }}
            />
          </div>

          {/*<QuickFilter label="View" queryParameter="view" filters={ViewFilters} />*/}
          {/*{this.view === 'all' && <QuickFilter label="Status" queryParameter="status" filters={StatusFilters} />}*/}
          {/*{this.view === 'all' && <QuickFilter label="Sort By" queryParameter="sort" filters={SortFilters} defaultValue="created_at" />}*/}

          <div class="flex flex-row gap-3 items-center">
            <div class="filter">
              <verdocs-text-input
                id="verdocs-filter-containing"
                value={this.containing}
                autocomplete="off"
                placeholder="Fields Containing..."
                onInput={(e: any) => {
                  this.containing = e.target.value;
                }}
              />
            </div>
          </div>

          <div class="flex flex-1" />

          {this.selectedEnvelopes.length > 0 && <verdocs-button label={`Download (${this.selectedEnvelopes.length})`} onClick={() => this.handleDownload()} />}
        </div>

        {this.envelopes.map(envelope => {
          const recipientsWithActions = getRecipientsWithActions(envelope);
          const userCanCancel = userCanCancelEnvelope(this.endpoint.session, envelope);
          const userRole = recipientsWithActions.find(recipient => recipient.email === this.endpoint.session?.email || '');
          const userCanFinish = userRole && userCanCancel && userCanAct(this.endpoint.session?.email || '', recipientsWithActions);

          return (
            <div class="envelope" key={envelope.id} onClick={() => this.viewEnvelope?.emit({endpoint: this.endpoint, envelope})}>
              <div class="inner">
                <verdocs-checkbox
                  checked={this.selectedEnvelopes.findIndex(e => e.id === envelope.id) !== -1}
                  onClick={e => e.stopPropagation()} // So this doesn't trigger navigation
                  onInput={(e: any) => {
                    if (e.target.checked) {
                      this.selectedEnvelopes = [...this.selectedEnvelopes, envelope];
                    } else {
                      this.selectedEnvelopes = this.selectedEnvelopes.filter(e => e.id !== envelope.id);
                    }
                  }}
                />

                <div class="vert-spacer" />

                <span innerHTML={DocumentIcon} />

                <div class="envelope-name">
                  {envelope.name}:&nbsp; <div class="envelope-recipients">{envelope.recipients.map(r => r.full_name).join(', ')}</div>
                </div>

                <div class="vert-spacer" />

                <verdocs-status-indicator envelope={envelope} style={{width: '125px'}} />

                <div class="vert-spacer" />

                <div class="last-modified">{new Date(envelope.updated_at).toLocaleString()}</div>

                <div class="vert-spacer" />

                <verdocs-dropdown
                  options={[
                    {label: 'View Envelope', id: 'view'},
                    {label: 'Finish Envelope', id: 'finish', disabled: !userCanFinish},
                    {label: 'Download', id: 'download'},
                    {label: 'Cancel', id: 'cancel', disabled: !userCanCancel},
                  ]}
                  onOptionSelected={e => {
                    switch (e.detail.id) {
                      case 'view':
                        this.viewEnvelope?.emit({endpoint: this.endpoint, envelope});
                        break;
                      case 'finish':
                        this.finishLater?.emit({endpoint: this.endpoint, envelope});
                        break;
                      case 'download':
                        this.downloadEnvelope(envelope);
                        break;
                      case 'cancel':
                        if (window.confirm('Are you sure you want to cancel this envelope?')) {
                          cancelEnvelope(this.endpoint, envelope.id)
                            .then(r => {
                              console.log('Cancel result', r);
                              VerdocsToast('Envelope canceled');
                            })
                            .catch(e => {
                              console.log('cxl error', e);
                              VerdocsToast('Unable to cancel envelope: ' + e.messabge, {style: 'error'});
                            });
                        }
                        break;
                    }
                  }}
                />
              </div>
            </div>
          );
        })}

        {!this.envelopes.length ? (
          <div class="mt-4 border-2 px-20 py-20 text-center">No matching envelopes found. Please adjust your filters and try again.</div>
        ) : (
          <div></div>
          // <Pagination page={this.page} total={this.count} onSelectPage={setPage} />
        )}
      </Host>
    );
  }
}
