import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {IRole} from '@verdocs/js-sdk/Templates/Types';
import {isValidEmail, isValidPhone} from '@verdocs/js-sdk/Templates/Validators';
import {Component, Prop, State, h, Event, EventEmitter, Host, Method} from '@stencil/core';
import TemplateStore from '../../../utils/templateStore';
import {loadTemplate} from '../../../utils/Templates';
import {getRoleIndex} from '../../../utils/utils';
import {SDKError} from '../../../utils/errors';
import {IContactSearchEvent} from '../../elements/verdocs-contact-picker/verdocs-contact-picker';

const editIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>';

const startIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"></path></svg>';

const stepIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>';

const doneIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>';

type TAnnotatedRole = IRole & {id: string};

/**
 * Display a form to collect recipient information for a new Envelope. If used anonymously, the specified `templateId` must be public.
 * Because most applications have custom workflow requirements to trigger after sending an Envelope, this component does not actually
 * perform that operation. Parent applications should listen for the `onSend` event, and can pass the contents of `event.detail`
 * directly to the `createEnvelope()` call in JS-SDK.
 *
 * Host applications should ensure the template is "sendable" before displaying this component. To be sendable, a template must have
 * at least one document attached, at least one participant defined, and at least one field assigned to every "signer" participant.
 */
@Component({
  tag: 'verdocs-send',
  styleUrl: 'verdocs-send.scss',
  shadow: false,
})
export class VerdocsSend {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The ID of the template to create the document from.
   */
  @Prop() templateId: string | null = null;

  /**
   * The user completed the form and clicked send.
   */
  @Event({composed: true}) send: EventEmitter<{roles: IRole[]; name: string; template_id: string}>;

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

  @State() rolesAtLevel: Record<number, TAnnotatedRole[]> = {};

  @State() showPickerForId = '';

  @State() sessionContacts = [];

  @State() rolesCompleted: Record<string, TAnnotatedRole> = {};

  @Method() async reset() {
    this.rolesCompleted = {};
  }

  levels: number[] = [];

  async componentWillLoad() {
    const loadSessionResult = this.endpoint.loadSession();

    if (!this.templateId) {
      console.log(`[SEND] Missing required template ID ${this.templateId}`);
      return;
    }

    try {
      console.log(`[SEND] Loading template ${this.templateId}`);
      await loadTemplate(this.endpoint, this.templateId, true);

      if (!TemplateStore.template?.is_sendable) {
        console.warn(`[SEND] Template is not sendable`, this.templateId);
      }

      if (TemplateStore.template?.roles) {
        const rolesAtLevel: Record<number, TAnnotatedRole[]> = {};

        this.rolesCompleted = {};

        TemplateStore.template.roles.forEach(role => {
          const level = role.sequence - 1;
          rolesAtLevel[level] ||= [];
          const id = `r-${level}-${rolesAtLevel[level].length}`;
          rolesAtLevel[level].push({...role, id});
        });

        this.rolesAtLevel = rolesAtLevel;
        this.levels = Object.keys(rolesAtLevel).map(levelStr => +levelStr);
        this.levels.sort((a, b) => a - b);
      }
    } catch (e) {
      console.log('[SEND] Error loading template', e);
      this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));
    }

    if (loadSessionResult.session?.profile) {
      this.sessionContacts.push({
        id: loadSessionResult.session.profile.id,
        name: `${loadSessionResult.session.profile.first_name} ${loadSessionResult.session.profile.last_name}`,
        email: loadSessionResult.session.profile.email,
        phone: loadSessionResult.session.profile.phone,
      });
    }
  }

  getLevelIcon(level: number) {
    if (level < 0) {
      return <div class="level-icon" innerHTML={startIcon} />;
    } else if (level >= this.levels.length) {
      return <div class="level-icon" innerHTML={doneIcon} />;
    } else {
      return <div class="level-icon" innerHTML={stepIcon} />;
    }
  }

  handleSelectContact(e: any, role: TAnnotatedRole) {
    e.preventDefault();
    e.detail; // IContactSelectEvent
    this.rolesCompleted[role.id] = {...role, ...e.detail};
    this.showPickerForId = '';
  }

  handleClickRole(e: any, role: TAnnotatedRole) {
    e.stopPropagation();
    this.showPickerForId = role.id;
  }

  handleSend(e) {
    e.stopPropagation();
    this.send?.emit({roles: Object.values(this.rolesCompleted), name: TemplateStore.template.name, template_id: this.templateId});
  }

  handleCancel(e) {
    e.stopPropagation();
    this.exit?.emit();
  }

  render() {
    const roleNames = (TemplateStore.template?.roles || []).map(role => role.name) || [];
    const rolesAssigned = Object.values(this.rolesCompleted).filter(recipient => isValidEmail(recipient.email) || isValidPhone(recipient.phone));
    const allRolesAssigned = rolesAssigned.length >= roleNames.length;

    return (
      <Host class={{sendable: TemplateStore.template?.is_sendable}}>
        <div class="recipients">
          <div class="left-line" />
          <div class={`level level-start`}>
            {this.getLevelIcon(-1)}
            <div class="complete">Send Envelope</div>
          </div>

          {this.levels.map(level => (
            <div class={`level level-${level}`}>
              {this.getLevelIcon(level)}

              {this.rolesAtLevel[level].map(role => {
                const unknown = !role.email;
                return unknown ? (
                  <div class="recipient" style={{backgroundColor: getRGBA(getRoleIndex(roleNames, role.name))}} onClick={e => this.handleClickRole(e, role)}>
                    {this.rolesCompleted[role.id]?.full_name ?? role.name}
                    <div class="icon" innerHTML={editIcon} />
                    {this.showPickerForId === role.id && (
                      <verdocs-contact-picker
                        onExit={() => (this.showPickerForId = '')}
                        onNext={e => this.handleSelectContact(e, role)}
                        contactSuggestions={this.sessionContacts}
                        templateRole={this.rolesCompleted[role.id] ?? role}
                        onSearchContacts={e => this.searchContacts?.emit(e.detail)}
                      />
                    )}
                  </div>
                ) : (
                  <div class="recipient" style={{borderColor: getRGBA(getRoleIndex(roleNames, role.name))}} onClick={e => this.handleClickRole(e, role)}>
                    {this.rolesCompleted[role.id]?.full_name ?? role.full_name}
                    <div class="icon" innerHTML={editIcon} />
                    {this.showPickerForId === role.id && (
                      <verdocs-contact-picker
                        onExit={() => (this.showPickerForId = '')}
                        onNext={e => this.handleSelectContact(e, role)}
                        contactSuggestions={this.sessionContacts}
                        templateRole={this.rolesCompleted[role.id] ?? role}
                        onSearchContacts={e => this.searchContacts?.emit(e.detail)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div class={`level level-done`}>
            {this.getLevelIcon(this.levels.length)}
            <div class="complete">Signing Complete</div>
          </div>
        </div>

        <div class="buttons">
          <verdocs-button label="Cancel" size="small" variant="outline" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="Send" size="small" disabled={!allRolesAssigned} onClick={e => this.handleSend(e)} />
        </div>
      </Host>
    );
  }
}
