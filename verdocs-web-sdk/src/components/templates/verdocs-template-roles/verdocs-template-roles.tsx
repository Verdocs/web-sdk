import Sortable from 'sortablejs';
import {Component, h, Element, Event, EventEmitter, Host, Prop, State} from '@stencil/core';
import {arrangeTemplateRoles, createTemplateRole, formatFullName, getTemplate, IRole, ITemplate, renumberRoles, VerdocsEndpoint} from '@verdocs/js-sdk';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#00000089"><path d="m8.021 17.917-.313-2.5q-.27-.125-.625-.334-.354-.208-.625-.395l-2.312.979-1.979-3.438 1.979-1.5q-.021-.167-.031-.364-.011-.198-.011-.365 0-.146.011-.344.01-.198.031-.385l-1.979-1.5 1.979-3.417 2.312.958q.271-.187.615-.385t.635-.344l.313-2.5h3.958l.313 2.5q.312.167.625.344.312.177.604.385l2.333-.958 1.979 3.417-1.979 1.521q.021.187.021.364V10q0 .146-.01.333-.011.188-.011.396l1.958 1.5-1.979 3.438-2.312-.979q-.292.208-.615.395-.323.188-.614.334l-.313 2.5Zm1.937-5.355q1.063 0 1.813-.75t.75-1.812q0-1.062-.75-1.812t-1.813-.75q-1.041 0-1.802.75-.76.75-.76 1.812t.76 1.812q.761.75 1.802.75Zm0-1.333q-.5 0-.864-.364-.365-.365-.365-.865t.365-.865q.364-.364.864-.364t.865.364q.365.365.365.865t-.365.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.187q.605-.167 1.136-.49.531-.323 1.031-.802l2.021.875.854-1.375-1.792-1.354q.105-.333.136-.635.031-.303.031-.615 0-.292-.031-.573-.031-.281-.115-.635l1.792-1.396-.834-1.375-2.062.875q-.438-.438-1.021-.781-.583-.344-1.125-.49l-.271-2.208H9.167l-.271 2.208q-.584.146-1.125.458-.542.313-1.042.792l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.479.458 1.021.771.542.312 1.146.479Z"/></svg>';

const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

const iconSigner =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Zm-3.725-.625-.6-.575 1.175 1.175Z"/></svg>';

const iconApprover = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>`;

const iconCC = `<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>`;

/**
 * Display an edit form that allows the user to adjust a template's roles and workflow.
 */
@Component({
  tag: 'verdocs-template-roles',
  styleUrl: 'verdocs-template-roles.scss',
  shadow: false,
})
export class VerdocsTemplateRoles {
  private templateListenerId = null;

  @Element()
  el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The template ID to edit.
   */
  @Prop() templateId: string = '';

  /**
   * Event fired when the user clicks to proceed.
   */
  @Event({composed: true}) next: EventEmitter;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the template is updated in any way. May be used for tasks such as cache invalidation or reporting to other systems.
   */
  @Event({composed: true}) rolesUpdated: EventEmitter<{endpoint: VerdocsEndpoint; templateId: string; event: 'added' | 'deleted' | 'updated'; roles: IRole[]}>;

  @State() showingRoleDialog: string | null = null;
  @State() sender = null;

  @State() dragging = false;
  @State() loading = true;
  @State() template: ITemplate | null = null;

  // Stencil doesn't rerun componentWillLoad when an element is reattached, so we listen again here.
  connectedCallback() {
    if (this.template && !this.templateListenerId) {
      this.listenToTemplate();
    }
  }

  disconnectedCallback() {
    this.unlistenToTemplate();
    this.cleanupSortables();
  }

  async listenToTemplate() {
    console.log('[ROLES] Loading template', this.templateId);
    this.unlistenToTemplate();
    this.templateListenerId = Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      false,
      (template: ITemplate) => {
        console.log('[ROLES] Template Updated', template);
        this.template = template;
        this.loading = false;
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  async componentWillLoad() {
    try {
      this.endpoint.loadSession();

      if (!this.templateId) {
        console.log(`[ROLES] Missing required template ID ${this.templateId}`);
        return;
      }

      if (!this.endpoint.session) {
        console.log('[ROLES] Unable to start builder session, must be authenticated');
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[ROLES] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  sortableRefs: Sortable[] = [];

  cleanupSortables() {
    this.sortableRefs.forEach(sr => sr.destroy());
    this.sortableRefs.length = 0;
  }

  componentDidRender() {
    this.cleanupSortables();

    // Existing sequence numbers
    const sequenceNumbers = this.getSequenceNumbers();
    (sequenceNumbers || []).forEach(sequence => {
      const el = document.getElementById(`verdocs-roles-sequence-${sequence}`);
      if (el) {
        const sortable = new Sortable(el, {
          group: 'roles',
          animation: 150,
          dragoverBubble: true,
          filter: '.no-drag',
          onEnd: this.handleMoveEnd.bind(this),
          onChoose: () => (this.dragging = true),
          onUnchoose: () => (this.dragging = false),
        });
        this.sortableRefs.push(sortable);
      }
    });

    const el = document.getElementById(`verdocs-roles-sequence-add-target`);
    if (el) {
      console.log('[ROLES] Applying sortable to add-sequence slot');
      const sortable = new Sortable(el, {
        group: 'roles',
        animation: 150,
        dragoverBubble: true,
        filter: '.no-drag',
        onEnd: this.handleMoveEnd.bind(this),
        onChoose: () => (this.dragging = true),
        onUnchoose: () => (this.dragging = false),
      });
      this.sortableRefs.push(sortable);
    }
  }

  handleMoveEnd(evt) {
    const fromSeq = +evt.from.dataset.sequence;
    const toSeq = +evt.to.dataset.sequence;
    const fromIndex = +evt.oldIndex + 1;
    const toIndex = +evt.newIndex + 1;

    console.log(`Move from ${fromSeq}:${fromIndex} to ${toSeq}:${toIndex}`, evt.item);

    const sortableRoles: Record<string, IRole[]> = {};
    const sequenceNumbers = this.getSequenceNumbers();
    sequenceNumbers.forEach(sequence => {
      const ras = this.getRolesAtSequence(sequence);

      sortableRoles[String(sequence)] = JSON.parse(JSON.stringify(ras));
    });

    // We might be adding a new sequence number now. Make sure we have an array to drop
    // the record into.
    sortableRoles[sequenceNumbers[sequenceNumbers.length - 1] + 1] = [];

    const role = sortableRoles[fromSeq].splice(fromIndex - 1, 1)[0];
    sortableRoles[toSeq] ||= [];
    sortableRoles[toSeq].splice(toIndex - 1, 0, role);

    const moves: {name: string; sequence: number; order: number}[] = [];
    Object.entries(sortableRoles).forEach(([targetSeq, roles]) => {
      roles.forEach((role, index) => {
        if (role && (role.sequence !== +targetSeq || role.order !== index + 1)) {
          moves.push({name: role.name, sequence: +targetSeq, order: index + 1});
        }
      });
    });

    // Sortable already moved the element. We put it back so the render from the updated template places it.
    evt.item.remove();
    evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex] ?? null);
    if (moves.length < 1) {
      return;
    }

    // The api renumbers steps after every change, so we show its result before it replies and then keep its copy
    const moved = (this.template?.roles || []).map(role => ({...role, ...moves.find(move => move.name === role.name)}));
    const movedNames = moves.map(move => move.name);
    Store.updateTemplate(this.templateId, {...this.template, roles: renumberRoles(moved, movedNames)});
    return arrangeTemplateRoles(this.endpoint, this.templateId, moves)
      .then(roles => Store.updateTemplate(this.templateId, {...this.template, roles}))
      .catch(e => {
        console.log('[ROLES] Error arranging roles', e);
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
        return Store.getTemplate(this.endpoint, this.templateId, true);
      });
  }

  handleCancel() {
    this.exit?.emit();
  }

  handleSubmit() {
    this.next?.emit();
  }

  getSortedRoles() {
    // NOTE: This mutates the source array but that's OK because everything that touches
    // it will want the same thing done.
    return (this.template?.roles || []).sort((a, b) => {
      return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
    });
  }

  getSequenceNumbers() {
    // TODO: This is cleaner with a Set but we found a regression in some target environments where
    //  this breaks down. Reverting to an older technique while we diagnose it.
    const sequences: Record<number, boolean> = {};
    this.getSortedRoles().forEach(role => {
      sequences[role.sequence] = true;
    });
    console.log('[ROLES] Sequences', sequences);
    return Object.keys(sequences)
      .map(s => +s)
      .sort((a, b) => a - b);
    // const sequenceNumbers = (this.template?.roles || []).map(role => role.sequence);
    // const deduped = [...new Set(sequenceNumbers)];
    // deduped.sort((a, b) => a - b);
    // return deduped;
  }

  getRoleNames() {
    const roles = this.getSortedRoles();
    return roles.map(role => role.name);
  }

  getRolesAtSequence(sequence: number) {
    // Entries can be undefined when deleted because Stencil has no remove() operator yet for stores.
    // See https://github.com/ionic-team/stencil-store/issues/23
    return (this.template?.roles || []).filter(role => role && role.sequence === sequence);
  }

  // The api renumbers the steps when a role is deleted, so we reload to pick up its numbers
  async renumberTemplateRoles() {
    await Store.getTemplate(this.endpoint, this.templateId, true);
    this.rolesUpdated?.emit({event: 'updated', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
  }

  // Look for name conflicts, because they're UGC and can be anything, regardless of order.
  getNextRoleName() {
    let name = '';
    let nextNumber = (this.template?.roles || []).length;
    do {
      nextNumber++;
      name = `Recipient ${nextNumber}`;
    } while (!name || (this.template?.roles || []).some(role => role && role.name === name));

    return name;
  }

  callCreateRole(name: string, sequence: number, order: number) {
    console.log('[ROLES] Will create role', {name, sequence, order});
    createTemplateRole(this.endpoint, this.templateId, {
      template_id: this.templateId,
      name,
      sequence,
      message: '',
      order,
      full_name: null,
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      type: 'signer',
      delegator: false,
      name_locked: false,
      // auth_method: null,
    } as any)
      .then(async role => {
        console.log('[ROLES] Created role', role);
        // const newTemplate = JSON.parse(JSON.stringify(this.template));
        // newTemplate.roles.push(role);
        // TODO: Verify this immediately triggers a self-update
        console.log('Updating template in data store');
        await Store.getTemplate(this.endpoint, this.templateId, true);
        // Store.updateTemplate(this.templateId, newTemplate);
        // This will re-sort the roles and renumbers them via server calls if necessary
        // await this.renumberTemplateRoles();
        this.rolesUpdated?.emit({event: 'added', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
      })
      .catch(e => {
        console.log('[ROLES] Error creating role', e);
      });
  }

  handleAddRole(e: any, sequence: number) {
    e.stopPropagation();
    const order = this.getRolesAtSequence(sequence).length + 1;
    const name = this.getNextRoleName();
    this.callCreateRole(name, sequence, order);
  }

  handleAddStep(e: any, sequence: number) {
    e.stopPropagation();

    const order = 1;
    const name = this.getNextRoleName();
    this.callCreateRole(name, sequence, order);
  }

  render() {
    if (!this.endpoint.session) {
      return (
        <Host>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    if (this.loading || !this.template) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    const roleNames = this.getRoleNames();
    const sequences = this.getSequenceNumbers();
    const nextSequence = sequences && sequences.length > 0 ? (sequences[sequences.length - 1] || 0) + 1 : 1;

    console.log('[ROLES] Rendering', {roleNames, sequences, nextSequence});

    return (
      <Host class={{dragging: this.dragging}}>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <h5>Roles and Workflow</h5>

          <div class="roles">
            {sequences.map((sequence, index) => (
              <div class="sequence">
                <div class="sequence-label no-drag">{index + 1}.</div>

                <div class="sequence-roles" id={`verdocs-roles-sequence-${sequence}`} data-sequence={sequence}>
                  {this.getRolesAtSequence(sequence).map(role => {
                    const unknown = !role.email || !role.first_name || !role.last_name;
                    return unknown ? (
                      <div class="role" data-rolename={role.name} data-sequence={sequence} data-order={role.order}>
                        <div class="role-name">{role.name}</div>
                        <div class="icons">
                          <div class="gear-button" innerHTML={settingsIcon} onClick={() => (this.showingRoleDialog = role.name)} aria-role="button" />
                          <span class="type-icon" innerHTML={role.type === 'signer' ? iconSigner : role.type === 'cc' ? iconCC : iconApprover} />
                        </div>
                      </div>
                    ) : (
                      <div class="role" data-rolename={role.name} data-sequence={sequence} data-order={role.order}>
                        <div class="role-name">{formatFullName(role)}</div>
                        <div class="icons">
                          <div class="gear-button" innerHTML={settingsIcon} onClick={() => (this.showingRoleDialog = role.name)} aria-role="button" />
                          <span class="type-icon" innerHTML={role.type === 'signer' ? iconSigner : role.type === 'cc' ? iconCC : iconApprover} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button class="add-role no-drag" onClick={e => this.handleAddRole(e, sequence)}>
                  + Add Role
                </button>
              </div>
            ))}

            <div class="sequence add-sequence">
              <div class="sequence-label no-drag">{sequences.length + 1}.</div>

              <div class="sequence-roles" id={`verdocs-roles-sequence-add-target`} data-sequence={nextSequence} />

              <button class="add-role no-drag" onClick={e => this.handleAddRole(e, nextSequence)}>
                + Add Role
              </button>
            </div>
          </div>

          {roleNames.length < 1 && (
            <div class="empty">
              You must add at least one Role before proceeding.
              <br /> Click the <span innerHTML={plusIcon} /> Add button above to get started.
            </div>
          )}

          <div class="buttons">
            <div class="flex-fill" />

            <verdocs-button variant="outline" label="Cancel" size="small" onClick={() => this.handleCancel()} />
            <verdocs-button label="OK" size="small" onClick={() => this.handleSubmit()} disabled={roleNames.length < 1} />
          </div>
        </form>

        {this.showingRoleDialog && (
          <verdocs-menu-panel onClose={() => (this.showingRoleDialog = null)}>
            <verdocs-template-role-properties
              endpoint={this.endpoint}
              templateId={this.templateId}
              roleName={this.showingRoleDialog}
              onClose={() => {
                document.getElementById('verdocs-menu-panel-overlay')?.remove();
                this.showingRoleDialog = null;
              }}
              onDelete={async () => {
                this.showingRoleDialog = null;
                // This will re-sort the roles and renumbers them via server calls if necessary
                await this.renumberTemplateRoles();
                this.rolesUpdated?.emit({event: 'deleted', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
              }}
            />
          </verdocs-menu-panel>
        )}
      </Host>
    );
  }
}
