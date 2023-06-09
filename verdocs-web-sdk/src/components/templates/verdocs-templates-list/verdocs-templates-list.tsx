import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Templates} from '@verdocs/js-sdk/Templates';
import {canPerformTemplateAction} from '@verdocs/js-sdk/Templates/Actions';
import {userCanCreateTemplate} from '@verdocs/js-sdk/Templates/Permissions';
import {ITemplate, ITemplateSummaryEntry} from '@verdocs/js-sdk/Templates/Types';
import {Component, Prop, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {IGetTemplateSummaryParams, IGetTemplateSummarySortBy} from '@verdocs/js-sdk/Templates/Templates';
import {IFilterOption} from '../../controls/verdocs-quick-filter/verdocs-quick-filter';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {formatDistance} from 'date-fns';

const TemplateIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`;
const GlobeAltIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>`;
const LockClosedIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`;
const BuildingOfficeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>`;
const CalendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>`;
const EnvelopeIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>`;

const SharingFilters: IFilterOption[] = [
  {value: 'all', label: 'All'},
  {value: 'personal', label: 'Personal'},
  {value: 'shared', label: 'Shared'},
  {value: 'public', label: 'Public'},
];

const StarredFilters: IFilterOption[] = [
  {value: 'all', label: 'All'},
  {value: 'starred', label: 'Starred'},
  {value: 'unstarred', label: 'Not Starred'},
];

const SortOptions: IFilterOption[] = [
  {value: 'name', label: 'Name'},
  {value: 'created_at', label: 'Created'},
  {value: 'updated_at', label: 'Last Updated'},
  {value: 'last_used_at', label: 'Last Used'},
  {value: 'counter', label: 'Most Used'},
  {value: 'star_counter', label: 'Most Starred'},
];

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
   * The sharing settings to filter by.
   */
  @Prop({reflect: true, mutable: true}) sharing?: 'all' | 'personal' | 'shared' | 'public' = 'all';

  /**
   * The starred settings to filter by.
   */
  @Prop({reflect: true, mutable: true}) starred: 'all' | 'starred' | 'unstarred' = 'all';

  /**
   * The sort order to display.
   */
  @Prop({reflect: true, mutable: true}) sort: IGetTemplateSummarySortBy = 'updated_at';

  /**
   * If set, filter templates by the specified name.
   */
  @Prop({reflect: true, mutable: true}) name: string = '';

  /**
   * The initial page number to select. Pagination is internally controlled but may be overriden by the
   * host applicaiton.
   */
  @Prop({reflect: true, mutable: true}) selectedPage = 0;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user clicks a template to view it. Typically the host application will use this to navigate
   * to the template preview. This is also fired when the user selects "Preview/Send" fropm the dropdown menu.
   */
  @Event({composed: true}) viewTemplate: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  @Event({composed: true}) editTemplate: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  /**
   * Event fired when the user chooses the Delete option from the dropdown menu. When this is fired, the template
   * will already have been deleted. The host application should remove it from the list or refresh the list.
   */
  @Event({composed: true}) templateDeleted: EventEmitter<{endpoint: VerdocsEndpoint; template: ITemplate}>;

  @State() count = 0;
  @State() loading = true;
  @State() confirmDelete: ITemplateSummaryEntry | null = null;
  @State() templates: ITemplateSummaryEntry[] = [];

  async componentWillLoad() {
    this.endpoint.loadSession();

    if (!this.endpoint.session) {
      console.log('[TEMPLATES] Must be authenticated');
      return;
    }

    return this.queryTemplates();
  }

  async queryTemplates() {
    try {
      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[TEMPLATES] Must be authenticated');
        return;
      }

      let queryParams: IGetTemplateSummaryParams = {
        page: this.selectedPage,
        ascending: this.sort === 'name' || this.sort === 'star_counter',
        sort_by: this.sort,
      };

      if (this.sharing !== 'all') {
        queryParams.is_personal = this.sharing === 'personal';
        queryParams.is_public = this.sharing === 'public';
      }

      if (this.starred !== 'all') {
        queryParams.is_starred = this.starred === 'starred';
      }

      if (this.name.trim() !== '') {
        queryParams.name = this.name.trim();
      }
      console.log('qp', queryParams, this.name);

      const response = await Templates.getSummary(this.endpoint, queryParams);
      console.log('[TEMPLATES] Got templates', response);
      this.templates = response.result;
      this.count = response.total;
      this.loading = false;
    } catch (e) {
      console.log('[TEMPLATES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  handleOptionSelected = (option: string, template: ITemplateSummaryEntry) => {
    if (option === 'createdoc') {
      this.viewTemplate?.emit({endpoint: this.endpoint, template: template});
    } else if (option === 'createlink') {
      VerdocsToast('This feature is coming soon!');
    } else if (option === 'signnow') {
      VerdocsToast('This feature is coming soon!');
    } else if (option === 'submitted') {
      VerdocsToast('This feature is coming soon!');
    } else if (option === 'link') {
      VerdocsToast('This feature is coming soon!');
    } else if (option === 'edit') {
      this.editTemplate?.emit({endpoint: this.endpoint, template: template});
    } else if (option === 'delete') {
      this.confirmDelete = template;
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

  deleteTemplate(template: ITemplateSummaryEntry) {
    this.confirmDelete = null;
    Templates.deleteTemplate(this.endpoint, template.id)
      .then(() => {
        console.log('[TEMPLATES] Deleted template', template);
        this.templateDeleted?.emit({endpoint: this.endpoint, template: template});
        return this.queryTemplates();
      })
      .catch(e => {
        console.log('[TEMPLATES] Error deleting template', template);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
      });
  }

  render() {
    return (
      <Host>
        <div class="header">
          <div class="filter">
            <verdocs-text-input
              id="verdocs-filter-name"
              value={this.name}
              autocomplete="off"
              placeholder="Filter by Name..."
              onFocusout={(e: any) => {
                this.name = e.target.value;
                return this.queryTemplates();
              }}
            />
          </div>

          <verdocs-quick-filter
            label="Sharing"
            value={this.sharing}
            options={SharingFilters}
            onOptionSelected={e => {
              this.sharing = e.detail.value as any;
              return this.queryTemplates();
            }}
          />

          <verdocs-quick-filter
            label="Starred"
            value={this.starred}
            options={StarredFilters}
            onOptionSelected={e => {
              this.starred = e.detail.value as any;
              return this.queryTemplates();
            }}
          />

          <verdocs-quick-filter
            label="Sort By"
            value={this.sort}
            options={SortOptions}
            onOptionSelected={e => {
              this.sort = e.detail.value as any;
              return this.queryTemplates();
            }}
          />
          {this.loading && <verdocs-spinner mode="dark" size={24} />}
          <div style={{display: 'flex', flex: '1'}} />
        </div>

        {this.templates.map(summary => {
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
            <div
              class="template"
              onClick={() => {
                this.viewTemplate?.emit({endpoint: this.endpoint, template: summary});
              }}
            >
              <div class="inner">
                <verdocs-template-star template={summary} endpoint={this.endpoint} />

                <div class="spacer icon-spacer" />
                <span innerHTML={TemplateIcon} />
                <div class="name">{summary.name}</div>

                <div class="spacer usage-spacer" />
                <div class="usage">
                  <span innerHTML={EnvelopeIcon} />
                  {summary.counter || '--'}
                </div>

                <div class="spacer last-used-spacer" />
                <div class="last-used">
                  <span innerHTML={CalendarIcon} />
                  <span style={{marginRight: '5px'}}>Last Used:</span>
                  {summary.last_used_at ? formatDistance(new Date(summary.last_used_at), new Date()) : 'Never'}
                </div>

                <div class="spacer ownership-spacer" />
                {summary.is_public && (
                  <div class="ownership">
                    <span innerHTML={GlobeAltIcon} /> Public
                  </div>
                )}
                {!summary.is_public && !summary.is_personal && (
                  <div class="ownership">
                    <span innerHTML={LockClosedIcon} /> Private
                  </div>
                )}
                {!summary.is_public && summary.is_personal && (
                  <div class="ownership">
                    <span innerHTML={BuildingOfficeIcon} /> Shared
                  </div>
                )}

                <verdocs-dropdown options={MENU_OPTIONS} onOptionSelected={e => this.handleOptionSelected(e.detail.id, summary)} />
              </div>
            </div>
          );
        })}

        {!this.templates.length ? (
          <div class="empty-text">No matching templates found. Please adjust your filters and try again.</div>
        ) : (
          <div style={{marginTop: '10px'}}>
            <verdocs-pagination
              selectedPage={this.selectedPage}
              perPage={10}
              itemCount={this.count}
              onSelectPage={e => {
                this.selectedPage = e.detail.selectedPage;
                return this.queryTemplates();
              }}
            />
          </div>
        )}

        {this.confirmDelete && (
          <verdocs-ok-dialog
            heading="Delete this Template?"
            message="This operation cannot be undone."
            onNext={() => this.deleteTemplate(this.confirmDelete)}
            onExit={() => (this.confirmDelete = null)}
            showCancel={true}
          />
        )}
      </Host>
    );
  }
}
