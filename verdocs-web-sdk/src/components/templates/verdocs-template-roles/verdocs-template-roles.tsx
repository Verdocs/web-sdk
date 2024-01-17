import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {createRole, updateRole} from '@verdocs/js-sdk/Templates/Roles';
import {IRole, TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Element, Event, EventEmitter, Fragment, Host, Prop, State} from '@stencil/core';
import {getRoleIndex, getTemplateRoleStore, TTemplateRoleStore, updateStoreRole} from '../../../utils/TemplateRoleStore';
import {getTemplateStore, TTemplateStore} from '../../../utils/TemplateStore';
import {SDKError} from '../../../utils/errors';

const senderLabels: Record<TemplateSenderTypes, string> = {
  [TemplateSenderTypes.EVERYONE]: 'Everyone',
  [TemplateSenderTypes.EVERYONE_AS_CREATOR]: 'Everyone as Me',
  [TemplateSenderTypes.ORGANIZATION_MEMBER]: 'Organization member',
  [TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR]: 'Organization Member as Me',
  [TemplateSenderTypes.CREATOR]: 'Me',
};

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#00000089"><path d="m8.021 17.917-.313-2.5q-.27-.125-.625-.334-.354-.208-.625-.395l-2.312.979-1.979-3.438 1.979-1.5q-.021-.167-.031-.364-.011-.198-.011-.365 0-.146.011-.344.01-.198.031-.385l-1.979-1.5 1.979-3.417 2.312.958q.271-.187.615-.385t.635-.344l.313-2.5h3.958l.313 2.5q.312.167.625.344.312.177.604.385l2.333-.958 1.979 3.417-1.979 1.521q.021.187.021.364V10q0 .146-.01.333-.011.188-.011.396l1.958 1.5-1.979 3.438-2.312-.979q-.292.208-.615.395-.323.188-.614.334l-.313 2.5Zm1.937-5.355q1.063 0 1.813-.75t.75-1.812q0-1.062-.75-1.812t-1.813-.75q-1.041 0-1.802.75-.76.75-.76 1.812t.76 1.812q.761.75 1.802.75Zm0-1.333q-.5 0-.864-.364-.365-.365-.365-.865t.365-.865q.364-.364.864-.364t.865.364q.365.365.365.865t-.365.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.187q.605-.167 1.136-.49.531-.323 1.031-.802l2.021.875.854-1.375-1.792-1.354q.105-.333.136-.635.031-.303.031-.615 0-.292-.031-.573-.031-.281-.115-.635l1.792-1.396-.834-1.375-2.062.875q-.438-.438-1.021-.781-.583-.344-1.125-.49l-.271-2.208H9.167l-.271 2.208q-.584.146-1.125.458-.542.313-1.042.792l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.479.458 1.021.771.542.312 1.146.479Z"/></svg>';

const startIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="#00000089"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"></path></svg>';

const stepIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="#00000089"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>';

const doneIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="#00000089"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>';

const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

const iconSigner =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m9.225 21.225 4.65-4.65h8.45v4.65Zm-5.35-2.2H5.05l8.5-8.5-1.175-1.175-8.5 8.5Zm14.25-9.95L13.8 4.8l1.325-1.325q.625-.65 1.525-.663.9-.012 1.6.663l1.225 1.175q.675.675.663 1.562-.013.888-.663 1.513ZM16.7 10.55 6 21.225H1.675V16.9L12.35 6.225Zm-3.725-.625-.6-.575 1.175 1.175Z"/></svg>';

const iconApprover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" /></svg>`;

const iconCC = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>`;

/**
 * Displays an edit form that allows the user to adjust a template's roles and workflow.
 */
@Component({
  tag: 'verdocs-template-roles',
  styleUrl: 'verdocs-template-roles.scss',
  shadow: false,
})
export class VerdocsTemplateRoles {
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
  @State() showingSenderDialog = false;
  @State() sender = null;
  @State() loading = true;

  templateStore: TTemplateStore | null = null;
  roleStore: TTemplateRoleStore | null = null;

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

      await getTemplateStore(this.endpoint, this.templateId, false)
        .then(ts => {
          this.templateStore = ts;
          this.roleStore = getTemplateRoleStore(this.templateId);
          this.roleStore.onChange('roles', roles => {
            console.log('[ROLES] Roles changed', {roles});
            this.rolesUpdated?.emit({event: 'updated', endpoint: this.endpoint, templateId: this.templateId, roles});
            this.loading = false;
          });
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log('[FIELDS] Error with preview session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  componentDidRender() {
    interact.dynamicDrop(true);
    interact('.recipient').draggable({
      listeners: {
        start: function handleStart(e) {
          e.target.classList.add('dragging');
          this.el.classList.add('dragging');
        }.bind(this),
        move: function handleMove(e) {
          const oldX = +(e.target.getAttribute('dX') || 0);
          const oldY = +(e.target.getAttribute('dY') || 0);
          const sequence = +(e.target.dataset['sequence'] || 0);
          const order = +(e.target.dataset['order'] || 0);
          const newX = e.dx + oldX;
          const newY = e.dy + oldY;
          e.target.setAttribute('dX', newX);
          e.target.setAttribute('dY', newY);
          const rect = e.target.getBoundingClientRect();
          // Note: I never did figure out exactly why this is, but if we don't offset the transform
          // the dragged item is offset from the mouse cursor quite a bit.
          console.log('w', rect.width);
          e.target.style.transform = `translate(${newX + rect.width - (order + 1)}px, ${newY - rect.height * sequence}px)`;
        }.bind(this),
        end: function handleEnd(e) {
          e.target.classList.remove('dragging');
          this.el.classList.remove('dragging');
          // console.log('end', event);
          e.target.removeAttribute('dX');
          e.target.removeAttribute('dY');
          e.target.style.transform = null;
        }.bind(this),
      },
    });

    interact('.dropzone').dropzone({
      overlap: 0.05,
      ondrop: async function onDrop(event) {
        console.log('dropped', event.target.classList);
        event.target.classList.remove('active');

        const roleName = event.relatedTarget.dataset.rolename;
        const targetSequence = +event.target.dataset.sequence;
        const targetOrder = +event.target.dataset.order;
        updateStoreRole(this.roleStore, roleName, {sequence: targetSequence, order: targetOrder});
        await this.renumberTemplateRoles();

        console.log('[ROLES] Updated roles', this.getSortedRoles());
        this.rolesUpdated?.emit({event: 'updated', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
      }.bind(this),
      ondropactivate: e => {
        e.target.classList.add('visible');
      },
      ondropdeactivate: e => {
        e.target.classList.remove('visible');
      },
      ondragenter: e => {
        e.target.classList.add('active');
      },
      ondragleave: e => {
        e.target.classList.remove('active');
      },
    });
  }

  handleCancel() {
    this.exit?.emit();
  }

  handleSubmit() {
    this.next?.emit();
  }

  getSortedRoles() {
    return this.roleStore.state.roles.sort((a, b) => {
      return a.sequence === b.sequence ? a.order - b.order : a.sequence - b.sequence;
    });
  }

  getSequenceNumbers() {
    const sequences = [];
    this.getSortedRoles().forEach(role => {
      if (!sequences.includes(role.sequence)) {
        sequences.push(role.sequence);
      }
    });
    return sequences.sort((a, b) => a - b);
  }

  getRoleNames() {
    const roles = this.getSortedRoles();
    return roles.map(role => role.name);
  }

  getRolesAtSequence(sequence: number) {
    // Entries can be undefined when deleted because Stencil has no remove() operator yet for stores.
    // See https://github.com/ionic-team/stencil-store/issues/23
    return this.roleStore.state.roles.filter(role => role && role.sequence === sequence);
  }

  // When the user drags a role around, we handle placement "between" items by assigning it a half-order number
  // e.g. 1.5 to place it between items 1 and 2, 0.5 to place it at the beginning, or last+0.5 to place it at the end.
  // Then we re-sort the list of roles and renumber them.
  renumberTemplateRoles() {
    console.log('Renumbering roles', this.getSequenceNumbers(), JSON.stringify(this.roleStore.state));
    // Avoid dupe renumber attempts
    const renumbered = [];

    // If the user dragged an entry from below a row to above it, we end up here like [1,0]. Make sure it's [0,1] for the next operation.
    const renumberRequests = [];
    this.getSequenceNumbers().forEach((originalSequence, newSequenceIndex) => {
      this.getRolesAtSequence(originalSequence).forEach((role, newOrderIndex) => {
        if (!renumbered.includes(role.name)) {
          role.sequence = newSequenceIndex + 1;
          role.order = newOrderIndex + 1;
          renumbered.push(role.name);
          renumberRequests.push(updateRole(this.endpoint, this.templateId, role.name, {sequence: role.sequence, order: role.order}));
        }
      });
    });

    return Promise.all(renumberRequests);
  }

  // Look for name conflicts, because they're UGC and can be anything, regardless of order.
  getNextRoleName() {
    console.log('Getting next role name', JSON.stringify(this.roleStore.state));
    let name = '';
    let nextNumber = Object.keys(this.roleStore.state).length - 1;
    do {
      nextNumber++;
      name = `Recipient ${nextNumber}`;
    } while (!name || this.roleStore.state.roles.some(role => role && role.name === name));

    return name;
  }

  callCreateRole(name: string, sequence: number, order: number) {
    console.log('[ROLES] Will create role', {name, sequence, order});
    createRole(this.endpoint, this.templateId, {
      template_id: this.templateId,
      name,
      sequence,
      order,
      full_name: '',
      email: '',
      phone: '',
      type: 'signer',
      delegator: false,
    })
      .then(async r => {
        console.log('[ROLES] Created role', r);
        this.roleStore.set('roles', [...this.roleStore.state.roles, r]);
        await this.renumberTemplateRoles();
        this.rolesUpdated?.emit({event: 'added', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
      })
      .catch(e => {
        console.log('[ROLES] Error creating role', e);
      });
  }

  handleAddRole(e, sequence: number) {
    e.stopPropagation();
    const order = this.getRolesAtSequence(sequence).length + 1;
    const name = this.getNextRoleName();
    this.callCreateRole(name, sequence, order);
  }

  handleAddStep(e, sequence: number) {
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

    if (this.loading || !this.templateStore?.state.isLoaded) {
      return (
        <Host class="loading">
          <verdocs-loader />
        </Host>
      );
    }

    console.log('Rendering roles', this.roleStore.get('roles'));
    const roleNames = this.getRoleNames();
    const sequences = this.getSequenceNumbers();
    console.log('Rendering', roleNames, sequences);

    return (
      <Host>
        <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
          <h5>Roles and Workflow</h5>

          <div class="participants">
            <div class="left-line" />
            <div class="row">
              <div class="icon" innerHTML={startIcon} />
              <div class="row-roles">
                <div class="sender">
                  <span class="label">Sender:</span> {senderLabels[this.templateStore?.state?.sender]}{' '}
                  <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
                </div>
              </div>
            </div>

            <div class="row add-sequence" data-sequence={0}>
              <div class="icon" innerHTML={plusIcon} />
              <div class="row-roles">
                <div class="dropzone" data-sequence={0} data-order={1}>
                  Add Step
                </div>
              </div>
            </div>

            {sequences.map(sequence => (
              <Fragment>
                <div class="row">
                  <div class="icon" innerHTML={stepIcon} />
                  <div class="row-roles">
                    {/* The "start of sequence" drop zone */}
                    <div class="dropzone" data-order={0.5} data-sequence={sequence} />

                    {this.getRolesAtSequence(sequence).map(role => {
                      const unknown = !role.email;
                      return unknown ? (
                        <Fragment>
                          <div
                            class="recipient"
                            style={{backgroundColor: getRGBA(getRoleIndex(this.roleStore, role.name))}}
                            data-rolename={role.name}
                            data-sequence={sequence}
                            data-order={role.order}
                          >
                            <span class="type-icon" innerHTML={role.type === 'signer' ? iconSigner : role.type === 'cc' ? iconCC : iconApprover} />
                            {role.name} <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingRoleDialog = role.name)} aria-role="button" />
                          </div>

                          {/* The "after this recipient" drop zone */}
                          <div class="dropzone" data-order={role.order + 0.5} data-sequence={sequence} />
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div
                            class="recipient"
                            style={{borderColor: getRGBA(getRoleIndex(this.roleStore, role.name))}}
                            data-rolename={role.name}
                            data-sequence={sequence}
                            data-order={role.order}
                          >
                            <span class="type-icon" innerHTML={role.type === 'signer' ? iconSigner : role.type === 'cc' ? iconCC : iconApprover} />
                            {role.full_name} <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingRoleDialog = role.name)} aria-role="button" />
                          </div>

                          {/* The "after this recipient" drop zone */}
                          <div class="dropzone" data-order={role.order + 0.5} data-sequence={sequence} />
                        </Fragment>
                      );
                    })}

                    <button class="add-role" innerHTML={plusIcon} onClick={e => this.handleAddRole(e, sequence)} />
                  </div>
                </div>

                {sequences.length > 0 && (
                  <div class="row add-sequence" data-sequence={sequence}>
                    <div class="row-roles">
                      <div class="icon" innerHTML={plusIcon} />
                      <div class="dropzone" data-sequence={sequence + 1} data-order={1}>
                        Add Step
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            <div class="row" data-sequence={sequences.length + 1}>
              <div class="row-roles">
                <div class="icon" innerHTML={plusIcon} />
                <button class="add-step" innerHTML={plusIcon} onClick={e => this.handleAddStep(e, sequences.length + 1)} />
              </div>
            </div>

            <div class="row">
              <div class="icon" innerHTML={doneIcon} />
              <div class="row-roles">
                <div class="complete">Document Complete</div>
              </div>
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

        {/* We do it this way instead of setting open so the widget resets each time it's displayed, in case the user opens/changes/cancels */}
        {this.showingRoleDialog && (
          <verdocs-template-role-properties
            endpoint={this.endpoint}
            templateId={this.templateId}
            roleName={this.showingRoleDialog}
            onClose={() => {
              this.showingRoleDialog = null;
            }}
            onDelete={async () => {
              this.showingRoleDialog = null;
              await this.renumberTemplateRoles();
              this.rolesUpdated?.emit({event: 'deleted', endpoint: this.endpoint, templateId: this.templateId, roles: this.getSortedRoles()});
            }}
          />
        )}

        {this.showingSenderDialog && <verdocs-template-sender endpoint={this.endpoint} templateId={this.templateId} onClose={() => (this.showingSenderDialog = false)} />}
      </Host>
    );
  }
}
