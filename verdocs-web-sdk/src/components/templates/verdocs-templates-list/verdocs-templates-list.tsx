import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Templates} from '@verdocs/js-sdk/Templates';
import {ITemplate, ITemplateSummaryEntry} from '@verdocs/js-sdk/Templates/Types';
import {userCanCreateTemplate} from '@verdocs/js-sdk/Templates/Permissions';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {IGetTemplateSummaryParams, IGetTemplateSummarySortBy} from '@verdocs/js-sdk/Templates/Templates';
// import {getRecipientsWithActions, userCanAct, userCanCancelEnvelope} from '@verdocs/js-sdk/Envelopes/Permissions';
// import {saveEnvelopesAsZip} from '../../../utils/utils';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {canPerformTemplateAction} from '@verdocs/js-sdk/Templates/Actions';

const TemplateIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`;

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
  tag: 'verdocs-templates-list',
  styleUrl: 'verdocs-templates-list.scss',
})
export class VerdocsTemplatesList {
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
  // @Prop({reflect: true}) status: TEnvelopeStatus | 'all' = 'all';

  /**
   * The sort field to use
   */
  // @Prop({reflect: true}) sortBy: 'created_at' | 'updated_at' | 'envelope_name' | 'canceled_at' | 'envelope_status' = 'updated_at';

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
  @Event({composed: true}) viewEnvelope: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user clicks to finish signing later. Typically the host application should redirect
   * the user to another page.
   */
  @Event({composed: true}) finishLater: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

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
  @State() sharing = 'all';
  @State() starred = 'all';
  @State() sort: IGetTemplateSummarySortBy = 'updated_at';
  @State() selectedTemplates: ITemplateSummaryEntry[] = [];
  @State() templates: ITemplateSummaryEntry[] = [];

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[ENVELOPES] Must be authenticated');
        return;
      }

      let queryParams: IGetTemplateSummaryParams = {
        page: this.page,
        ascending: this.sort === 'name' || this.sort === 'star_counter',
        sort_by: this.sort,
      };

      if (this.sharing !== 'all') {
        queryParams.is_personal = this.sharing === 'personal';
        queryParams.is_public = this.sharing === 'public';
      }

      if (this.starred !== 'all') {
        // TODO: Update the js-sdk type
        queryParams['is_starred'] = this.starred === 'starred';
      }

      if (this.name.trim() !== '') {
        queryParams.name = this.name.trim();
      }

      const response = await Templates.getSummary(this.endpoint, queryParams);
      console.log('[TEMPLATES] Got envelopes', response);
      this.templates = response.result;
      this.count = response.total;
      this.loading = false;
    } catch (e) {
      console.log('[ENVELOPES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }
  handleOptionSelected = (id: string, summary: ITemplateSummaryEntry) => {
    console.log('option selected', id, summary);
    if (id === 'createdoc') {
      // Create a document from this template
      // navigate(URLS.TEMPLATE_DETAIL.build(summary.id, 'preview'));
      // navigate('/' + URLS.SEND(summary.id));
    } else if (id === 'createlink') {
      // Create a link to this template
      VerdocsToast('Link creation is coming soon!');
    } else if (id === 'signnow') {
      // Create a document and start signing it now
      // TODO: Need to complete this
      // navigate(URLS.TEMPLATE_DETAIL.build(summary.id, 'edit'));
      //     if (this.canSendEnvelope && this.canSignNow) {
      //       const roles = JSON.parse(JSON.stringify(this.template.roles));
      //       if (this.numberOfUnknownRoles === 1) {
      //         const emptyRoleIndex = findIndex(roles, (role) => !role['email']);
      //         if (emptyRoleIndex > -1) {
      //           roles[emptyRoleIndex].email = this.currentProfile.email;
      //           roles[emptyRoleIndex].full_name = this.currentProfile.first_name + ' ' + this.currentProfile.last_name;
      //         }
      //       }
      //       const body = {
      //         template_id: this.template.id,
      //         roles: roles,
      //       };
      //       this.envelopeService.sendInvite(body).subscribe(
      //         (envelope) => {
      //           this.goToEnvelopeView(envelope);
      //         },
      //         (err) => {
      //           console.error({
      //             message: 'Failed to create Envelope',
      //             detail: err,
      //           });
      //           if (err && err.error && err.error.code && err.error.code === 'E000020') {
      //             const userId = this.vTokenObject.getProfileID();
      //             this._redirectUrl = `${environment.rAccount_frontend_url}/rAccount/user/${userId}/billing`;
      //             const plansDialog = this.dialog.open(PlansDialog, {
      //               panelClass: 'confirmation',
      //             });
      //             plansDialog.componentInstance.type = 'free';
      //             plansDialog.componentInstance.redirectUrl = this._redirectUrl;
      //           }
      //         },
      //       );
      //     }
    } else if (id === 'submitted') {
      // Submitted Data
      // navigate(URLS.SUBMITTED_DATA.build(summary.id));
    } else if (id === 'link') {
      // Create a signable link to the template
      // setPreviewTemplateLink(summary);
    } else if (id === 'edit') {
      // Edit the template
      // navigate(URLS.TEMPLATE_DETAIL.build(summary.id, 'edit'));
    } else if (id === 'delete') {
      // Delete the template
      // setConfirmDeleteTemplateId(summary.id);
    }
  };

  canCreate() {
    return userCanCreateTemplate(this.endpoint.session);
  }

  canDelete(summary: ITemplateSummaryEntry) {
    return canPerformTemplateAction(this.endpoint.session, 'delete', summary);
  }
  canEdit(summary: ITemplateSummaryEntry) {
    return canPerformTemplateAction(this.endpoint.session, 'write', summary);
  }

  canPreview(summary: ITemplateSummaryEntry) {
    const hasPermission = canPerformTemplateAction(this.endpoint.session, 'read', summary);
    // let canPreview;
    // const signers = filter(template.roles, {type: 'signer'});
    // canPreview = signers && signers.length > 0;
    // for (const signer of signers) {
    //   canPreview = signer['fields'] && signer['fields'].length > 0;
    // }
    // return hasPermission && canPreview;
    return hasPermission;
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
          {/*{this.selectedTemplates.length > 0 && <verdocs-button label={`Download (${this.selectedTemplates.length})`} onClick={() => this.handleDownload()} />}*/}
        </div>

        {this.templates.slice(0, this.items || 100).map(summary => {
          const MENU_OPTIONS = [
            //  [disabled]="!canSendEnvelope"
            {label: 'Preview / Send', id: 'createdoc', disabled: !this.canPreview(summary)},
            //  [disabled]="!(canSendEnvelope && canHaveLiveView)"
            {label: 'Create Link', id: 'createlink', disabled: true},
            // [disabled]="!(canSendEnvelope && canSignNow)"
            {label: 'Sign Now', id: 'signnow', disabled: true},
            // (click)="gotoEnvelope()"
            {label: ''},
            {label: 'Submissions', id: 'submitted'},
            {label: ''},
            {label: 'Get Preview Link', id: 'link', disabled: !this.canPreview(summary)},
            {label: 'Edit', id: 'edit', disabled: !this.canEdit(summary)},
            {label: 'Delete', id: 'delete', disabled: !this.canDelete(summary)},
          ];

          return (
            <div class="template" onClick={() => {}}>
              {/*<div class="template" onClick={() => navigate(`/template/${summary.id}`)}>*/}
              {/*<TemplateStar summary={summary} />*/}
              {/*<Spacer className="hide-small" />*/}

              <span innerHTML={TemplateIcon} />
              <div class="name">{summary.name}</div>

              <div class="spacer" />

              {/*<TemplateUsage summary={summary} />*/}
              {/*<div class="spacer" />*/}

              {/*{windowWidth > 1300 && (*/}
              {/*  <>*/}
              {/*    <TemplateLastUsed summary={summary} />*/}
              {/*    <div class="spacer" />*/}
              {/*  </>*/}
              {/*)}*/}

              {/*{windowWidth > 900 && (*/}
              {/*  <>*/}
              {/*    <TemplateOwnership summary={summary} />*/}
              {/*    <div class="spacer" />*/}
              {/*  </>*/}
              {/*)}*/}

              <div style={{marginTop: '12px'}}>
                <verdocs-dropdown options={MENU_OPTIONS} onOptionSelected={e => this.handleOptionSelected(e.detail.id, summary)} />
              </div>
            </div>
            //
            // <div class="envelope" key={envelope.id} onClick={() => this.viewEnvelope?.emit({endpoint: this.endpoint, envelope})}>
            //   <div class="inner">
            //     <verdocs-checkbox
            //       checked={this.selectedEnvelopes.findIndex(e => e.id === envelope.id) !== -1}
            //       onClick={e => e.stopPropagation()} // So this doesn't trigger navigation
            //       onInput={(e: any) => {
            //         if (e.target.checked) {
            //           this.selectedEnvelopes = [...this.selectedEnvelopes, envelope];
            //         } else {
            //           this.selectedEnvelopes = this.selectedEnvelopes.filter(e => e.id !== envelope.id);
            //         }
            //       }}
            //     />
            //
            //     <div class="vert-spacer" />
            //
            //     <span innerHTML={DocumentIcon} />
            //
            //     <div class="envelope-name">
            //       {envelope.name}:&nbsp; <div class="envelope-recipients">{envelope.recipients.map(r => r.full_name).join(', ')}</div>
            //     </div>
            //
            //     <div class="vert-spacer" />
            //
            //     <verdocs-status-indicator envelope={envelope} style={{width: '125px'}} />
            //
            //     <div class="vert-spacer" />
            //
            //     <div class="last-modified">{new Date(envelope.updated_at).toLocaleString()}</div>
            //
            //     <div class="vert-spacer" />
            //
            //     <verdocs-dropdown
            //       options={[
            //         {label: 'View Envelope', id: 'view'},
            //         {label: 'Finish Envelope', id: 'finish', disabled: !userCanFinish},
            //         {label: 'Download', id: 'download'},
            //         {label: 'Cancel', id: 'cancel', disabled: !userCanCancel},
            //       ]}
            //       onOptionSelected={e => {
            //         switch (e.detail.id) {
            //           case 'view':
            //             this.viewEnvelope?.emit({endpoint: this.endpoint, envelope});
            //             break;
            //           case 'finish':
            //             this.finishLater?.emit({endpoint: this.endpoint, envelope});
            //             break;
            //           case 'download':
            //             this.downloadEnvelope(envelope);
            //             break;
            //           case 'cancel':
            //             if (window.confirm('Are you sure you want to cancel this envelope?')) {
            //               cancelEnvelope(this.endpoint, envelope.id)
            //                 .then(r => {
            //                   console.log('Cancel result', r);
            //                   VerdocsToast('Envelope canceled');
            //                 })
            //                 .catch(e => {
            //                   console.log('cxl error', e);
            //                   VerdocsToast('Unable to cancel envelope: ' + e.messabge, {style: 'error'});
            //                 });
            //             }
            //             break;
            //         }
            //       }}
            //     />
            //   </div>
            // </div>
          );
        })}

        {!this.templates.length ? (
          <div class="mt-4 border-2 px-20 py-20 text-center">No matching templates found. Please adjust your filters and try again.</div>
        ) : (
          <div></div>
          // <Pagination page={this.page} total={this.count} onSelectPage={setPage} />
        )}
      </Host>
    );
  }
}
