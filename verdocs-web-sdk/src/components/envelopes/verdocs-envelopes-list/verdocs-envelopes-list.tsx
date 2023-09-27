import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Envelopes} from '@verdocs/js-sdk/Envelopes';
import {integerSequence} from '@verdocs/js-sdk/Utils/Primitives';
import {IEnvelopeSummary, TEnvelopeStatus} from '@verdocs/js-sdk/Envelopes/Types';
import {cancelEnvelope, IListEnvelopesParams} from '@verdocs/js-sdk/Envelopes/Envelopes';
import {Component, Prop, Host, h, State, Event, EventEmitter, Watch} from '@stencil/core';
import {getRecipientsWithActions, userCanAct, userCanCancelEnvelope} from '@verdocs/js-sdk/Envelopes/Permissions';
import {IFilterOption} from '../../controls/verdocs-quick-filter/verdocs-quick-filter';
import {saveEnvelopesAsZip} from '../../../utils/utils';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const DocumentIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>`;

const ViewFilters: IFilterOption[] = [
  {value: 'all', label: 'All'},
  {value: 'inbox', label: 'Inbox'},
  {value: 'sent', label: 'Sent'},
  {value: 'completed', label: 'Completed'},
  {value: 'action', label: 'Action Required'},
  {value: 'waiting', label: 'Waiting on Others'},
];

const StatusFilters: IFilterOption[] = [
  {value: 'all', label: 'All'},
  {value: 'pending', label: 'Pending'},
  {value: 'in progress', label: 'In Progress'},
  {value: 'complete', label: 'Completed'},
  {value: 'declined', label: 'Declined'},
  {value: 'canceled', label: 'Canceled'},
];

const SortFilters: IFilterOption[] = [
  {value: 'created_at', label: 'Created'},
  {value: 'updated_at', label: 'Updated'},
  {value: 'canceled_at', label: 'Canceled'},
  {value: 'envelope_name', label: 'Name'},
  {value: 'envelope_status', label: 'Status'},
];

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
   * The filtered view to display. "completed" will show envelopes that have been submitted. "action" will
   * show envelopes where the user is a recipient and the envelope is not completed. "waiting" will show
   * only envelopes where the user is the sender and the envelope is not completed.
   */
  @Prop({reflect: true, mutable: true}) view?: 'all' | 'inbox' | 'sent' | 'completed' | 'action' | 'waiting' = undefined;

  /**
   * The status value to filter by
   */
  @Prop({reflect: true, mutable: true}) status: TEnvelopeStatus | 'all' = 'all';

  /**
   * The sort field to use
   */
  @Prop({reflect: true, mutable: true}) sort: 'name' | 'created_at' | 'updated_at' | 'canceled_at' | 'status' = 'created_at';

  /**
   * If set, filter envelopes by the specified string.
   */
  @Prop({reflect: true, mutable: true}) match: string = '';

  /**
   * If set, filter envelopes by the specified "containing" value.
   */
  // @Prop({reflect: true, mutable: true}) containing: string = '';

  /**
   * Whether or not pagination should be enabled.
   */
  @Prop() showPagination = true;

  /**
   * The number of rows to display per page.
   */
  @Prop() rowsPerPage = 10;

  /**
   * The initial page number to select. Pagination is internally controlled but may be overriden by the
   * host applicaiton.
   */
  @Prop() selectedPage = 0;

  /**
   * Event fired when the user changes their view. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeView: EventEmitter<'all' | 'inbox' | 'sent' | 'completed' | 'action' | 'waiting'>;

  /**
   * Event fired when the user changes their status filter. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeStatus: EventEmitter<TEnvelopeStatus | 'all'>;

  /**
   * Event fired when the user changes their sort order. Host applications can use this to save the user's preferences.
   */
  @Event({composed: true}) changeSort: EventEmitter<'name' | 'created_at' | 'updated_at' | 'canceled_at' | 'status'>;

  /**
   * Event fired when the user changes the match filter. This is fired for every inputChange event (every character
   * typed). This event is provided for balance with the other events, but host applications should generally not
   * save this value. Users might appreciate applications remembering their sorting or filtering preferences, but
   * probably not their search terms.
   */
  @Event({composed: true}) changeMatch: EventEmitter<string>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user clicks an activity entry. Typically the host application will use this to navigate
   * to the envelope detail view.
   */
  @Event({composed: true}) viewEnvelope: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelopeSummary}>;

  /**
   * Event fired when the user clicks to finish the envelope.
   */
  @Event({composed: true}) finishEnvelope: EventEmitter<{endpoint: VerdocsEndpoint; envelope: IEnvelopeSummary}>;

  @State() count = 0;
  @State() initiallyLoaded = false;
  @State() loading = true;
  @State() selectedEnvelopes: IEnvelopeSummary[] = [];
  @State() envelopes: IEnvelopeSummary[] = [];

  @Watch('view')
  handleViewUpdated() {
    return this.queryEnvelopes();
  }

  @Watch('status')
  handleStatusUpdated() {
    return this.queryEnvelopes();
  }

  @Watch('sort')
  handleSortUpdated() {
    return this.queryEnvelopes();
  }

  @Watch('match')
  handleMatchUpdated() {
    return this.queryEnvelopes();
  }

  // @Watch('containing')
  // handleContainingUpdated() {
  //   return this.queryEnvelopes();
  // }

  @Watch('selectedPage')
  handlePageUpdated() {
    return this.queryEnvelopes();
  }

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[ENVELOPES] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    await this.queryEnvelopes();
    this.initiallyLoaded = true;
  }

  async queryEnvelopes() {
    try {
      this.loading = true;
      let queryParams: IListEnvelopesParams = {
        page: this.selectedPage,
        sort: this.sort,
        rows: this.rowsPerPage,
      };

      switch (this.view) {
        case 'all':
          queryParams = {
            ...queryParams,
            sort: this.sort,
            direction: this.sort === 'name' ? 'asc' : 'desc',
            status: (this.status === 'all' ? ['pending', 'in progress', 'complete', 'declined', 'canceled'] : [this.status]) as TEnvelopeStatus[],
          };
          break;

        case 'inbox':
          queryParams = {
            ...queryParams,
            is_recipient: true,
            sort: 'updated_at',
            recipient_status: ['invited', 'declined', 'opened', 'signed', 'submitted', 'canceled'],
          };
          break;

        case 'sent':
          queryParams = {
            ...queryParams,
            is_owner: true,
            sort: 'updated_at',
          };
          break;

        case 'action':
          queryParams = {
            ...queryParams,
            sort: 'updated_at',
            is_recipient: true,
            status: ['pending', 'in progress'],
            recipient_status: ['invited', 'opened', 'signed'],
          };
          break;

        case 'waiting':
          queryParams = {
            ...queryParams,
            is_owner: true,
            sort: 'updated_at',
            direction: 'desc',
            status: ['pending', 'in progress'],
          };
          break;

        case 'completed':
          queryParams = {
            ...queryParams,
            sort: 'updated_at',
            direction: 'desc',
            status: ['complete'],
          };
          break;

        default:
          queryParams = {
            ...queryParams,
            sort: 'updated_at',
            direction: 'desc',
            status: (this.status === 'all' ? ['pending', 'in progress', 'complete', 'declined', 'canceled'] : [this.status]) as TEnvelopeStatus[],
          };
      }

      // These filters should only be applied in "View All" mode. Otherwise the user could have set them to something
      // then changed the view e.g. to Inbox and the filter could break the view (e.g. View:Inbox, Status:Declined
      // would never return anything).
      if (this.view === 'all') {
        if (this.status !== 'all') {
          queryParams.status = [this.status as TEnvelopeStatus];
        }
      }

      if (this.sort !== 'updated_at') {
        queryParams.sort = this.sort;
        queryParams.direction = this.sort === 'name' ? 'asc' : 'desc';
      }

      if (this.match.trim()) {
        queryParams.match = this.match.trim();
      }

      // if (this.containing.trim()) {
      //   queryParams.field_value = this.containing.trim();
      // }

      const response = await Envelopes.listEnvelopes(this.endpoint, queryParams);
      this.envelopes = response.records;
      this.count = response.total;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      console.log('[ENVELOPES] Error listing envelopes', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleDownload() {
    saveEnvelopesAsZip(this.endpoint, this.selectedEnvelopes)
      .then(() => {
        this.selectedEnvelopes = [];
      })
      .catch(e => {
        console.log('[ENVELOPES] Download error', e);
        VerdocsToast('Download error: ' + e.message, {style: 'error'});
      });
  }

  downloadEnvelope(envelope: IEnvelopeSummary) {
    saveEnvelopesAsZip(this.endpoint, [envelope]).catch(e => {
      console.log('[ENVELOPES] Download error', e);
      VerdocsToast('Download error: ' + e.message, {style: 'error'});
    });
  }

  render() {
    return (
      <Host>
        <div class="header">
          <div class="filter">
            <verdocs-text-input
              id="verdocs-filter-name"
              value={this.match}
              clearable={true}
              autocomplete="off"
              placeholder="Filter by Name, Recipient, or Field..."
              onFocusout={(e: any) => {
                // We don't locally filter envelopes because there are too many fields to match against efficiently.
                this.match = e.target.value.trim();
                this.changeMatch?.emit(this.match);
              }}
            />
          </div>

          <verdocs-quick-filter
            label="View"
            value={this.view}
            options={ViewFilters}
            onOptionSelected={e => {
              this.view = e.detail.value as any;
            }}
          />

          {this.view === 'all' && (
            <verdocs-quick-filter
              label="Status"
              value={this.status}
              options={StatusFilters}
              onOptionSelected={e => {
                this.status = e.detail.value as any;
              }}
            />
          )}

          {this.view === 'all' && (
            <verdocs-quick-filter
              label="Sort By"
              value={this.sort}
              options={SortFilters}
              onOptionSelected={e => {
                this.sort = e.detail.value as any;
              }}
            />
          )}

          {/*<div class="containing">*/}
          {/*  <div class="filter">*/}
          {/*    <verdocs-text-input*/}
          {/*      id="verdocs-filter-containing"*/}
          {/*      value={this.containing}*/}
          {/*      autocomplete="off"*/}
          {/*      placeholder="Fields Containing..."*/}
          {/*      onInput={(e: any) => {*/}
          {/*        this.containing = e.target.value;*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {this.loading && <verdocs-spinner mode="dark" size={24} />}

          <div style={{display: 'flex', flex: '1'}} />

          {this.selectedEnvelopes.length > 0 && <verdocs-button label={`Download (${this.selectedEnvelopes.length})`} onClick={() => this.handleDownload()} />}
        </div>

        {this.envelopes.map(envelope => {
          const recipientsWithActions = getRecipientsWithActions(envelope);
          const userCanCancel = userCanCancelEnvelope(this.endpoint.session, envelope);
          const userRole = recipientsWithActions.find(recipient => recipient.email === this.endpoint.session?.email || '');
          const userCanFinish = userRole && userCanCancel && userCanAct(this.endpoint.session?.email || '', recipientsWithActions);

          const menuOptions = [
            {label: 'View Envelope', id: 'view'},
            {label: 'Finish Envelope', id: 'finish', disabled: !userCanFinish},
            {label: 'Download', id: 'download'},
            {label: 'Cancel', id: 'cancel', disabled: !userCanCancel},
          ];

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
                <span innerHTML={DocumentIcon} class="envelope-icon" />

                <div class="envelope-name">
                  {envelope.name}:&nbsp; <div class="envelope-recipients">{envelope.recipients.map(r => r.full_name).join(', ')}</div>
                </div>

                <div class="vert-spacer" />
                <verdocs-status-indicator envelope={envelope} style={{width: '125px'}} />

                <div class="vert-spacer" />
                <div class="last-modified">{new Date(envelope.updated_at).toLocaleString()}</div>

                <div class="vert-spacer" />
                <verdocs-dropdown
                  options={menuOptions}
                  onOptionSelected={e => {
                    switch (e.detail.id) {
                      case 'view':
                        this.viewEnvelope?.emit({endpoint: this.endpoint, envelope});
                        break;
                      case 'finish':
                        this.finishEnvelope?.emit({endpoint: this.endpoint, envelope});
                        break;
                      case 'download':
                        this.downloadEnvelope(envelope);
                        break;
                      case 'cancel':
                        if (window.confirm('Are you sure you want to cancel this envelope?')) {
                          cancelEnvelope(this.endpoint, envelope.id)
                            .then(() => VerdocsToast('Envelope canceled'))
                            .catch(e => VerdocsToast('Unable to cancel envelope: ' + e.messabge, {style: 'error'}));
                          this.queryEnvelopes().catch(() => {});
                        }
                        break;
                    }
                  }}
                />
              </div>
            </div>
          );
        })}

        {!this.initiallyLoaded && (
          <div style={{width: '100%'}}>
            {integerSequence(0, this.rowsPerPage).map(() => (
              <div class="envelope-placeholder" />
            ))}
          </div>
        )}

        {this.initiallyLoaded && !this.envelopes.length && <div class="empty-text">No matching envelopes found. Please adjust your filters and try again.</div>}

        {this.initiallyLoaded && this.envelopes.length && this.showPagination ? (
          <div style={{marginTop: '20px'}}>
            <verdocs-pagination
              selectedPage={this.selectedPage}
              perPage={this.rowsPerPage}
              itemCount={this.count}
              onSelectPage={e => {
                this.selectedPage = e.detail.selectedPage;
              }}
            />
          </div>
        ) : (
          <div />
        )}
      </Host>
    );
  }
}
