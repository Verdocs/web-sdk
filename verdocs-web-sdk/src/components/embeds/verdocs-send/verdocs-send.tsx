import {Component, Prop, State, h, Event, EventEmitter, Host, Method, Watch} from '@stencil/core';
import {createEnvelope, formatFullName, getTemplate, getOrganizationContacts, getRGBA, isValidEmail, VerdocsEndpoint} from '@verdocs/js-sdk';
import type {ICreateEnvelopeFromTemplateRequest, ICreateEnvelopeRecipient, IEnvelope, IRecipient, ITemplate} from '@verdocs/js-sdk';
import {IContactSearchEvent} from '../../envelopes/verdocs-contact-picker/verdocs-contact-picker';
import {getRoleIndex, getRoleNames} from '../../../utils/Templates';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const editIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>';

const startIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"></path></svg>';

const stepIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>';

const doneIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>';

/**
 * Display a form to send a template to one or more recipients in an envelope for signing.
 * Host applications should ensure the template is "sendable" before displaying this component.
 * To be sendable, a template must have at least one document attached, at least one participant
 * defined, and at least one field assigned to every "signer" participant. This component will
 * hide itself if the template is not sendable.
 *
 * ```ts
 * <verdocs-send
 *   templateId={templateId}
 *   onBeforeSend={({ detail })) => { console.log('Sending... Show a spinner...', detail) }
 *   onSend={({ detail }) => { console.log('Sent! Hide the spinner...', detail) }
 *   onExit={(e) => { console.log('Send cancelled.', detail) }
 *   onSdkError={({ detail }) => { console.log('SDK error', detail) }
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-send',
  styleUrl: 'verdocs-send.scss',
  shadow: false,
})
export class VerdocsSend {
  private templateListenerId = null;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop({reflect: true}) templateId: string | null = null;

  /**
   * The environment the control is being called from, e.g. 'web'. This has an impact on how certain
   * operations such as email communications are handled to ensure users receive the correct URLs for
   * their invitations. Setting this to unknown values may produce unexpected/incorrect behaviors.
   * If environment is not known, do this set this property.
   */
  @Prop() environment: string = '';

  /**
   * The user is sending an envelope the form and clicked send.
   */
  @Event({composed: true}) beforeSend: EventEmitter<{recipients: ICreateEnvelopeRecipient[]; name: string; template_id: string; template: ITemplate}>;

  /**
   * The user completed the form and clicked send.
   */
  @Event({composed: true}) send: EventEmitter<{recipients: ICreateEnvelopeRecipient[]; name: string; template_id: string; envelope_id: string; envelope: IEnvelope}>;

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
   * Event fired when the user enters text in a search field. The parent application may use this to update
   * the `contactSuggestions` property.
   */
  @Event({composed: true}) searchContacts: EventEmitter<IContactSearchEvent>;

  @State() containerId = `verdocs-send-${Math.random().toString(36).substring(2, 11)}`;
  @State() showPickerForId = '';
  @State() sessionContacts = [];
  @State() sending = false;
  @State() rolesCompleted: Record<string, Partial<IRecipient>> = {};

  @State() loading = true;
  @State() template: ITemplate | null = null;

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  async listenToTemplate() {
    console.log('[SEND] Loading template', this.templateId);
    this.unlistenToTemplate();
    Store.subscribe(
      'templates',
      this.templateId,
      () => getTemplate(this.endpoint, this.templateId),
      true,
      (template: ITemplate) => {
        console.log('[SEND] Got new template', template);
        this.template = template;
        this.loading = false;
        this.rolesCompleted = {};
        this.recomputeRolesCompleted();
      },
    );
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  @Method() async reset() {
    this.rolesCompleted = {};
  }

  @Watch('templateId')
  onTemplateIdChanged(newTemplateId: string) {
    console.log('[SEND] Template ID changed', newTemplateId);
    this.listenToTemplate();
  }

  async componentWillLoad() {
    try {
      this.endpoint.onSessionChanged((_endpoint, _session, profile) => {
        if (!profile) {
          return;
        }

        const me = {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
        };

        if (profile) {
          this.sessionContacts = [me];

          getOrganizationContacts(this.endpoint)
            .then(contacts => {
              console.log('[SEND] Got contacts', contacts);
              this.sessionContacts = [...contacts, me];
            })
            .catch(e => {
              console.log('[SEND] Error getting contacts', e);
            });
        }
      });

      this.endpoint.loadSession();

      if (!this.endpoint.session) {
        console.log('[SEND] Unable to start Send operation, must be authenticated');
        return;
      }

      if (!this.templateId) {
        console.log(`[SEND] Missing required template ID ${this.templateId}`);
        return;
      }

      this.listenToTemplate();
    } catch (e) {
      console.log('[SEND] Error with send session', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }
  }

  recomputeRolesCompleted() {
    this.rolesCompleted = {};

    const rolesAtLevel: Record<number, Partial<IRecipient>[]> = {};
    (this.template?.roles || []).forEach(role => {
      const level = role.sequence - 1;
      rolesAtLevel[level] ||= [];
      const id = `r-${level}-${rolesAtLevel[level].length}`;
      rolesAtLevel[level].push({...role, id, role_name: role.name, first_name: role.first_name, last_name: role.last_name});

      // if (role.first_name && (isValidEmail(role.email) || isValidPhone(role.phone))) {
      if (role.first_name && isValidEmail(role.email)) {
        this.rolesCompleted[id] = {...role, id, role_name: role.name, first_name: role.first_name, last_name: role.last_name};
      }
    });
  }

  getSequenceNumbers() {
    // This is cleaner with a Set but we found a regression in some target environments where
    // this breaks down. Reverting to an older technique while we diagnose it.
    const sequences: Record<number, boolean> = {};
    (this.template?.roles || []).forEach(role => {
      sequences[role.sequence] = true;
    });
    return Object.keys(sequences)
      .map(s => +s)
      .sort((a, b) => a - b);
  }

  getRolesAtLevel(level: number) {
    const rolesAtLevel = (this.template?.roles || [])
      .filter(role => role.sequence === level)
      .map((role, index) => ({
        ...role,
        id: `r-${level}-${index}`,
        role_name: role.name,
        first_name: role.first_name,
        last_name: role.last_name,
      }));
    return rolesAtLevel as Partial<IRecipient>[];
  }

  getLevelIcon(level: 'start' | 'end' | 'sequence') {
    if (level === 'start') {
      return <div class="level-icon" innerHTML={startIcon} />;
    } else if (level === 'end') {
      return <div class="level-icon" innerHTML={doneIcon} />;
    } else {
      return <div class="level-icon" innerHTML={stepIcon} />;
    }
  }

  handleSelectContact(e: any, role: Partial<IRecipient>) {
    console.log('hsc', e.detail, role);
    e.preventDefault();
    this.rolesCompleted[role.id] = {...role, ...e.detail};
    this.showPickerForId = '';
  }

  handleClickRole(e: any, role: Partial<IRecipient>) {
    e.stopPropagation();
    this.showPickerForId = role.id;
  }

  handleSend(e: any) {
    if (this.sending) {
      console.log('[SEND] Skipping duplicate send', e);
      return;
    }

    console.log('[SEND] Sending', e);
    e.preventDefault();
    e.stopPropagation();

    this.sending = true;

    const details: ICreateEnvelopeFromTemplateRequest = {
      template_id: this.templateId,
      name: this.template?.name || 'New Envelope',
      environment: this.environment,
      initial_reminder: 0,
      followup_reminders: 0,
      recipients: Object.values(this.rolesCompleted) as ICreateEnvelopeRecipient[],
      // TODO: Pre-filled fields support
      fields: [],
    };

    const beforeSendResult = this.beforeSend.emit({...details, name: details.name!, template: this.template});
    if (beforeSendResult.defaultPrevented) {
      console.log('[SEND] Send cancelled by parent', details);
      this.sending = false;
      return;
    }

    console.log('[SEND] Creating envelope', details);
    createEnvelope(this.endpoint, details)
      .then(r => {
        console.log('[SEND] Send envelope', r);
        this.reset().catch((e: any) => console.log('Unknown Error', e));
        this.sending = false;
        this.send?.emit({...details, name: details.name!, envelope_id: r.id, envelope: r});
      })
      .catch(e => {
        console.log('[SEND] Send error', e);
        VerdocsToast(e.response?.data?.error || 'Error creating envelope, please try again later.');
        this.sending = false;
        this.sdkError?.emit(e);
      });
  }

  handleCancel(e: any) {
    e.stopPropagation();
    this.exit?.emit();
  }

  render() {
    if (this.loading) {
      return (
        <Host>
          <verdocs-loader />
        </Host>
      );
    }

    if (!this.endpoint.session) {
      return (
        <Host style={{display: 'flex'}}>
          <verdocs-component-error message="You must be authenticated to use this module." />
        </Host>
      );
    }

    const levels = this.getSequenceNumbers();
    const rolesAssigned = Object.values(this.rolesCompleted).filter(recipient => isValidEmail(recipient.email) && recipient.first_name && recipient.last_name);
    const allRolesAssigned = rolesAssigned.length >= getRoleNames(this.template).length;

    return (
      <Host class={{sendable: this.template?.is_sendable}}>
        <div class="recipients">
          <div class="left-line" />
          <div class={`level level-start`}>
            {this.getLevelIcon('start')}
            <div class="complete">Send Envelope</div>
          </div>

          {levels.map(level => (
            <div class={`level level-${level}`}>
              {this.getLevelIcon('sequence')}

              {this.getRolesAtLevel(level).map(role => {
                const unknown = !role.email || !role.first_name || !role.last_name;
                const roleName = this.rolesCompleted[role.id]?.first_name ? formatFullName(this.rolesCompleted[role.id]) : unknown ? role.role_name : formatFullName(role);
                const elId = `verdocs-send-recipient-${role.role_name}`;
                const roleIndex = getRoleIndex(this.template, role.role_name);
                const rgba = getRGBA(roleIndex);
                const completed = rolesAssigned.findIndex(r => r.role_name === role.role_name) > -1;

                const style = {
                  backgroundColor: rgba,
                  border: completed ? '2px solid #55bc81' : '2px solid #dddddd',
                };

                return unknown ? (
                  <div class="recipient" data-ri={roleIndex} data-rn={role.role_name} style={style} onClick={e => this.handleClickRole(e, role)} id={elId}>
                    {roleName}
                    <div class="icon" innerHTML={editIcon} />
                    {this.showPickerForId === role.id && (
                      <verdocs-portal anchor={elId} onClickAway={() => (this.showPickerForId = '')}>
                        <verdocs-contact-picker
                          onExit={() => (this.showPickerForId = '')}
                          onNext={e => this.handleSelectContact(e, role)}
                          contactSuggestions={this.sessionContacts}
                          templateRole={this.rolesCompleted[role.id] ?? role}
                          onSearchContacts={e => this.searchContacts?.emit(e.detail)}
                        />
                      </verdocs-portal>
                    )}
                  </div>
                ) : (
                  <div class="recipient" data-ri={roleIndex} data-rn={role.role_name} style={style} onClick={e => this.handleClickRole(e, role)} id={elId}>
                    {/*<div class="recipient" data-ri={roleIndex} data-rn={role.role_name} style={{borderColor: rgba}} onClick={e => this.handleClickRole(e, role)} id={elId}>*/}
                    {roleName}
                    <div class="icon" innerHTML={editIcon} />
                    {this.showPickerForId === role.id && (
                      <verdocs-portal anchor={elId} onClickAway={() => (this.showPickerForId = '')}>
                        <verdocs-contact-picker
                          onExit={() => (this.showPickerForId = '')}
                          onNext={e => this.handleSelectContact(e, role)}
                          contactSuggestions={this.sessionContacts}
                          templateRole={(this.rolesCompleted[role.id] ?? role) as IRecipient}
                          onSearchContacts={e => this.searchContacts?.emit(e.detail)}
                        />
                      </verdocs-portal>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div class={`level level-done`}>
            {this.getLevelIcon('end')}
            <div class="complete">Signing Complete</div>
          </div>
        </div>

        <div class="buttons">
          <verdocs-button label="Cancel" size="small" variant="outline" onClick={e => this.handleCancel(e)} disabled={this.sending} />
          <verdocs-button label="Send" size="small" disabled={!allRolesAssigned || this.sending} onClick={e => this.handleSend(e)} />
          {this.sending && <verdocs-spinner />}
        </div>
      </Host>
    );
  }
}
