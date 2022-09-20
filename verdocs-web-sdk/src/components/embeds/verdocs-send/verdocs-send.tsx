import {Host} from '@stencil/core';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';
import {Component, Prop, State, h} from '@stencil/core';
import {getTemplate} from '@verdocs/js-sdk/Templates/Templates';
import {IRole, ITemplate} from '@verdocs/js-sdk/Templates/Types';
import {getRoleIndex} from '../../../utils/utils';

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
 * Display a document sending experience.
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

  @State() template: ITemplate | null = null;

  @State() pdfUrl = null;

  @State() containerId = `verdocs-send-${Math.random().toString(36).substring(2, 11)}`;

  @State() rolesAtLevel: Record<number, TAnnotatedRole[]> = {};

  @State() showPickerForId = '';

  @State() sessionContacts = [];

  @State() recipientsAssigned: Record<string, TAnnotatedRole> = {};

  levels: number[] = [];

  async componentWillLoad() {
    this.sessionContacts = [];
    try {
      const result = await this.endpoint.loadSession();

      if (result.session?.profile) {
        this.sessionContacts.push({
          id: result.session.profile.id,
          name: `${result.session.profile.first_name} ${result.session.profile.last_name}`,
          email: result.session.profile.email,
          phone: result.session.profile.phone,
        });
      }
    } catch (e) {
      console.log('Error loading session', e);
    }
  }

  async componentDidLoad() {
    console.log('[SEND] Showing template', this.templateId);

    try {
      console.log(`[SEND] Loading template ${this.templateId}`);
      const template = await getTemplate(this.endpoint, this.templateId);

      console.log('[SEND] Got template', template);
      this.template = template;

      if (template?.roles) {
        const rolesAtLevel: Record<number, TAnnotatedRole[]> = {};

        template.roles.forEach(role => {
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
      console.log('[SEND] Error getting template', e);
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
    this.recipientsAssigned[role.id] = {...role, ...e.detail};
    this.showPickerForId = '';
  }

  handleClickRole(e: any, role: TAnnotatedRole) {
    e.stopPropagation();
    this.showPickerForId = role.id;
  }

  render() {
    const roleNames = this.template?.roles?.map(role => role.name) || [];

    return (
      <Host class={{}}>
        <div class="left-line" />

        <div class={`level level-start`}>
          {this.getLevelIcon(-1)}
          <div class="complete">Send Document</div>
        </div>

        {this.levels.map(level => (
          <div class={`level level-${level}}`}>
            {this.getLevelIcon(level)}

            {this.rolesAtLevel[level].map(role => (
              <div class="recipient" style={{backgroundColor: getRGBA(getRoleIndex(roleNames, role.name))}} onClick={e => this.handleClickRole(e, role)}>
                {this.recipientsAssigned[role.id]?.full_name ?? role.name}
                <div class="icon" innerHTML={editIcon} />
                {this.showPickerForId === role.id && (
                  <verdocs-contact-picker
                    onCancel={() => (this.showPickerForId = '')}
                    contactSuggestions={this.sessionContacts}
                    templateRole={this.recipientsAssigned[role.id] ?? role}
                    onSearchContacts={e => console.log('Search', e.detail)}
                    onContactSelected={e => this.handleSelectContact(e, role)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <div class={`level level-done`}>
          {this.getLevelIcon(this.levels.length)}
          <div class="complete">Document Complete</div>
        </div>
      </Host>
    );
  }
}
