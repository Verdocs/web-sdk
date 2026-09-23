import type {IBrand, IOrganization, TRecipientAuthMethod} from '@verdocs/js-sdk';
import {Component, Element, Prop, State, h, Event, EventEmitter, Host, Method, Watch} from '@stencil/core';
import type {ICreateEnvelopeFromTemplateRequest, ICreateEnvelopeRecipientFromTemplate, IEnvelope, IRecipient, ITemplate} from '@verdocs/js-sdk';
import {createEnvelope, formatFullName, getBrands, getOrganization, getTemplate, getOrganizationContacts, getRGBA, isValidEmail, VerdocsEndpoint} from '@verdocs/js-sdk';
import {IContactSearchEvent} from '../../envelopes/verdocs-contact-picker/verdocs-contact-picker';
import {DefaultEndpoint, getWebAppUrl} from '../../../utils/Environment';
import {getRoleIndex, getRoleNames} from '../../../utils/Templates';
import {updateScrollFade} from '../../../utils/ScrollFade';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {Store} from '../../../utils/Datastore';

const chevronRightIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';

const chevronLeftIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';

const warningIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>';

const infoIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';

const externalLinkIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M10 14 21 3M21 14v7H3V3h7"/></svg>';

const VERDOCS_LOGO_URL = 'https://app.verdocs.com/assets/blue-logo.svg';

// Swipe mechanics for mobile users in detail views
const SWIPE_START_FRACTION = 0.25;
const SWIPE_MIN_DISTANCE = 60;
const SWIPE_MAX_DURATION = 500;

// Expiration controls. The API is less strict, but Web users prefer a simpler setup so we just range-limit it 1..120 here.
const MIN_EXPIRY_DAYS = 1;
const MAX_EXPIRY_DAYS = 120;
const DEFAULT_EXPIRY_DAYS = 120;

const AUTH_METHOD_LABELS: Record<TRecipientAuthMethod, string> = {
  email: 'Email',
  passcode: 'Passcode',
  sms: 'SMS',
  kba: 'KBA',
  id: 'ID check',
};

type TSendView = 'main' | 'recipient' | 'brand' | 'expires' | 'notifications' | 'sender';

export interface ISendEventDetail extends ICreateEnvelopeFromTemplateRequest {
  name: string;
  template_id: string;
  recipients: ICreateEnvelopeRecipientFromTemplate[];
  template: ITemplate;
}

export interface ISentEventDetail extends ICreateEnvelopeFromTemplateRequest {
  name: string;
  template_id: string;
  recipients: ICreateEnvelopeRecipientFromTemplate[];
  envelope_id: string;
  envelope: IEnvelope;
}

/**
 * Display a form to send a template to one or more recipients in an envelope for signing.
 * Host applications should ensure the template is "sendable" before displaying this component.
 * To be sendable, a template must have at least one document attached, at least one participant
 * defined, and at least one field assigned to every "signer" participant. This component will
 * hide itself if the template is not sendable.
 *
 * ```ts
 * <verdocs-send
 *   templateId={TEMPLATE_ID}
 *   onBeforeSend={({ detail })) => { console.log('Sending... Show a spinner...', detail) }
 *   onSend={({ detail }) => { console.log('Sent! Hide the spinner...', detail) }
 *   onExit={({ detail }) => { console.log('Send cancelled.', detail) }
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

  @Element() el: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = DefaultEndpoint;

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
   * Whether to show the cancel button. It may be useful to disable this in environments where
   * the embed is shown in a non-wizard flow with its own navigation for the user to exit.
   */
  @Prop() showCancel = true;

  /**
   * Preselect a brand by key, overriding the organization default.
   */
  @Prop({mutable: true}) brandKey = '';

  /**
   * The user is sending an envelope the form and clicked send.
   */
  @Event({composed: true}) beforeSend: EventEmitter<ISendEventDetail>;

  /**
   * The user completed the form and clicked send.
   */
  @Event({composed: true}) send: EventEmitter<ISentEventDetail>;

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

  private swipeStart: {x: number; y: number; time: number} | null = null;
  private swallowNextClick = false;
  private loadedOrganizationId = '';

  @State() containerId = `verdocs-send-${Math.random().toString(36).substring(2, 11)}`;
  @State() view: TSendView = 'main';
  @State() editingRoleId = '';
  @State() sessionContacts: {id: string; first_name: string; last_name: string; email: string; phone: string}[] = [];
  @State() sending = false;
  @State() brands: IBrand[] = [];
  @State() organization: IOrganization | null = null;
  @State() expiresInDays = '';
  @State() noContact = false;
  @State() senderDefaults = {name: '', email: ''};
  @State() senderName = '';
  @State() senderEmail = '';
  @State() rolesCompleted: Record<string, Partial<IRecipient>> = {};

  @State() loading = true;
  @State() template: ITemplate | null = null;

  disconnectedCallback() {
    this.unlistenToTemplate();
  }

  componentDidLoad() {
    this.el.addEventListener(
      'click',
      e => {
        if (this.swallowNextClick) {
          this.swallowNextClick = false;
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true,
    );
  }

  // Make off-canvas controls leave the tab order
  componentDidRender() {
    updateScrollFade(this.el.querySelector('.detail-body'));
    this.el.querySelector('.main-pane')?.toggleAttribute('inert', this.view !== 'main');
    this.el.querySelector('.detail-pane')?.toggleAttribute('inert', this.view === 'main');
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
        this.view = 'main';
        this.editingRoleId = '';
        this.recomputeRolesCompleted();
        this.loadBrands();
      },
    );
  }

  loadBrands() {
    const organizationId = this.template?.organization_id;
    if (!organizationId || organizationId === this.loadedOrganizationId) {
      return;
    }

    const changedOrganization = !!this.loadedOrganizationId;
    this.loadedOrganizationId = organizationId;
    this.brands = [];
    this.organization = null;
    if (changedOrganization) {
      this.brandKey = '';
    }

    const stillCurrent = () => this.template?.organization_id === organizationId;

    getBrands(this.endpoint, organizationId)
      .then(brands => {
        if (stillCurrent()) {
          this.brands = brands || [];
        }
      })
      .catch(e => console.log('[SEND] Unable to load brands', e));

    getOrganization(this.endpoint, organizationId)
      .then(organization => {
        if (stillCurrent()) {
          this.organization = organization;
        }
      })
      .catch(e => console.log('[SEND] Unable to load organization', e));
  }

  handleExpiryInput(e: any) {
    const digits = (e.target.value || '').replace(/[^0-9]/g, '');
    this.expiresInDays = digits ? String(Math.min(Math.max(Number(digits), MIN_EXPIRY_DAYS), MAX_EXPIRY_DAYS)) : '';
    e.target.value = this.expiresInDays;
  }

  effectiveExpiryDays(): number {
    const days = Number(this.expiresInDays);
    return days >= MIN_EXPIRY_DAYS ? days : DEFAULT_EXPIRY_DAYS;
  }

  expiresAt(): Date {
    return new Date(Date.now() + this.effectiveExpiryDays() * 24 * 60 * 60 * 1000);
  }

  unlistenToTemplate() {
    if (this.templateListenerId) {
      Store.store.delListener(this.templateListenerId);
      this.templateListenerId = null;
    }
  }

  @Method()
  async reset() {
    this.rolesCompleted = {};
    this.view = 'main';
    this.editingRoleId = '';
    this.brandKey = '';
    this.expiresInDays = '';
    this.noContact = false;
    this.senderName = '';
    this.senderEmail = '';
  }

  // The sender_name defaults to the custom sender identity if configued/active, the brand
  // next, and then the org name.
  brandSenderName() {
    const brand = this.brandKey ? this.brands.find(b => b.key === this.brandKey) : this.getDefaultBrand();
    return brand?.email_display_name || brand?.email_sender_name || this.organization?.name || '';
  }

  effectiveSenderName() {
    return this.senderName || this.brandSenderName();
  }

  effectiveSenderEmail() {
    return this.senderEmail || this.senderDefaults.email;
  }

  senderOverrides() {
    const name = this.senderName.trim();
    const email = this.senderEmail.trim();
    return {
      sender_name: name && name !== this.brandSenderName() ? name : undefined,
      sender_email: email && email !== this.senderDefaults.email ? email : undefined,
    };
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
          this.senderDefaults = {name: formatFullName(profile), email: profile.email || ''};
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
      const level = role.sequence;
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

  getRoleById(id: string): Partial<IRecipient> | null {
    for (const level of this.getSequenceNumbers()) {
      const match = this.getRolesAtLevel(level).find(role => role.id === id);
      if (match) {
        return match;
      }
    }

    return null;
  }

  // We only show options the sender switched on.
  getRecipientOptionLabels(recipient: Partial<IRecipient> | undefined): string[] {
    if (!recipient) {
      return [];
    }

    const labels = (recipient.auth_methods || []).filter(method => method !== 'email').map(method => AUTH_METHOD_LABELS[method] || method);
    if (recipient.delegator) {
      labels.push('May delegate');
    }

    if (recipient.name_locked) {
      labels.push('Name locked');
    }

    return labels;
  }

  getDefaultBrand(): IBrand | null {
    const defaultId = this.organization?.default_brand_id;
    return (defaultId && this.brands.find(brand => brand.id === defaultId)) || null;
  }

  getDefaultBrandLabel() {
    const name = this.getDefaultBrand()?.name;
    return `Default (${name || 'Verdocs'})`;
  }

  getSelectedBrandLabel() {
    if (!this.brandKey) {
      return this.getDefaultBrandLabel();
    }

    const brand = this.brands.find(b => b.key === this.brandKey);
    return brand?.name || brand?.key || this.brandKey;
  }

  showView(view: TSendView) {
    this.view = view;
  }

  handleSelectContact(e: any, role: Partial<IRecipient>) {
    e.preventDefault();
    this.rolesCompleted = {...this.rolesCompleted, [role.id]: {...role, ...e.detail}};
    this.editingRoleId = '';
    this.view = 'main';
  }

  handleClickRole(e: any, role: Partial<IRecipient>) {
    e.stopPropagation();
    this.editingRoleId = role.id;
    this.view = 'recipient';
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
    const localeData = Intl.DateTimeFormat().resolvedOptions();

    const details: ICreateEnvelopeFromTemplateRequest = {
      template_id: this.templateId,
      name: this.template?.name || 'New Envelope',
      environment: this.environment,
      initial_reminder: 0,
      followup_reminders: 0,
      recipients: Object.values(this.rolesCompleted) as ICreateEnvelopeRecipientFromTemplate[],
      timezone: localeData.timeZone,
      locale: localeData.locale,
      expires_at: this.expiresAt().toISOString(),
    };

    details.no_contact = this.noContact;
    const {sender_name, sender_email} = this.senderOverrides();
    if (sender_name) {
      details.sender_name = sender_name;
    }
    if (sender_email) {
      details.sender_email = sender_email;
    }
    if (this.brandKey) {
      details.brand_key = this.brandKey;
    }

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

  handleSwipeStart(e: PointerEvent) {
    this.swallowNextClick = false;
    const pane = e.currentTarget as HTMLElement;
    const rect = pane.getBoundingClientRect();
    const onTextEntry = !!(e.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable]');
    if (this.view === 'main' || onTextEntry || e.clientX - rect.left > rect.width * SWIPE_START_FRACTION) {
      this.swipeStart = null;
      return;
    }

    this.swipeStart = {x: e.clientX, y: e.clientY, time: Date.now()};
  }

  handleSwipeEnd(e: PointerEvent) {
    const start = this.swipeStart;
    this.swipeStart = null;
    if (!start) {
      return;
    }

    const dx = e.clientX - start.x;
    const dy = Math.abs(e.clientY - start.y);
    if (dx >= SWIPE_MIN_DISTANCE && dx > dy && Date.now() - start.time <= SWIPE_MAX_DURATION) {
      this.swallowNextClick = true;
      this.showView('main');
    }
  }

  renderDetailHeader(title: any) {
    return (
      <div class="detail-header">
        <button type="button" class="back" onClick={() => this.showView('main')}>
          <span class="icon" innerHTML={chevronLeftIcon} />
          Back
        </button>
        <div class="detail-title">{title}</div>
        <div class="detail-header-spacer" />
      </div>
    );
  }

  renderDetailBody(content: any) {
    return (
      <div class="detail-body-wrap">
        <div class="detail-body" onScroll={(e: any) => updateScrollFade(e.target)}>
          {content}
        </div>
        <div class="scroll-fade" />
      </div>
    );
  }

  renderDoneButton() {
    return (
      <div class="detail-footer">
        <verdocs-button label="Done" size="small" onClick={() => this.showView('main')} />
      </div>
    );
  }

  renderRecipientView() {
    const role = this.getRoleById(this.editingRoleId);
    if (!role) {
      return <div class="detail recipient-detail">{this.renderDetailHeader('Recipient')}</div>;
    }

    const roleIndex = getRoleIndex(this.template, role.role_name);
    return (
      <div class="detail recipient-detail">
        {this.renderDetailHeader([<span class="role-dot" style={{backgroundColor: getRGBA(roleIndex)}} />, role.role_name])}
        <verdocs-contact-picker
          key={role.id}
          showCancel={false}
          onExit={() => this.showView('main')}
          onNext={e => this.handleSelectContact(e, role)}
          contactSuggestions={this.sessionContacts}
          templateRole={(this.rolesCompleted[role.id] ?? role) as IRecipient}
          onSearchContacts={e => this.searchContacts?.emit(e.detail)}
        />
      </div>
    );
  }

  renderBrandSwatch(brand: IBrand | null, fallbackInitial: string) {
    const image = brand?.favicon_url || brand?.thumbnail_url || (brand ? null : VERDOCS_LOGO_URL);
    if (image) {
      return (
        <span class="swatch logo">
          <img src={image} alt="" />
        </span>
      );
    }

    return (
      <span class="swatch" style={{backgroundColor: brand?.primary_color || '#4c56cb'}}>
        {fallbackInitial.substring(0, 2).toUpperCase()}
      </span>
    );
  }

  renderBrandOption(key: string, label: string, sub: string, swatch: any) {
    return (
      <button type="button" class={{option: true, selected: this.brandKey === key}} onClick={() => (this.brandKey = key)}>
        <span class="radio" />
        {swatch}
        <span class="option-label">
          {label}
          <small>{sub}</small>
        </span>
      </button>
    );
  }

  renderBrandView() {
    const defaultBrand = this.getDefaultBrand();
    const others = this.brands.filter(brand => brand.id !== defaultBrand?.id).sort((a, b) => (a.name || a.key).localeCompare(b.name || b.key));
    const hasBrands = this.brands.length > 0;

    return (
      <div class="detail">
        {this.renderDetailHeader('Brand')}
        {this.renderDetailBody([
          <div class="option-list">
            {this.renderBrandOption('', this.getDefaultBrandLabel(), 'Organization default', this.renderBrandSwatch(defaultBrand, defaultBrand?.name || 'V'))}
            {others.length > 0 && <div class="option-divider" />}
            {others.map(brand => this.renderBrandOption(brand.key, brand.name || brand.key, brand.key, this.renderBrandSwatch(brand, brand.name || brand.key)))}
          </div>,
          !hasBrands && (
            <p class="hint">
              Configure the look and feel of the signing experience by{' '}
              <a href={`${getWebAppUrl(this.endpoint)}/settings/branding`} target="_blank" rel="noopener">
                Creating a Brand
                <span class="icon" innerHTML={externalLinkIcon} />
              </a>
              .
            </p>
          ),
        ])}
        {this.renderDoneButton()}
      </div>
    );
  }

  renderExpiresView() {
    const expiresAt = this.expiresAt();
    const when = `${expiresAt.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})} at ${expiresAt.toLocaleTimeString(undefined, {hour: 'numeric', minute: '2-digit'})}`;

    return (
      <div class="detail">
        {this.renderDetailHeader('Expiration')}
        {this.renderDetailBody([
          <div class="expires-field">
            <input
              type="text"
              inputMode="numeric"
              aria-label="Expires in (days)"
              placeholder={String(DEFAULT_EXPIRY_DAYS)}
              value={this.expiresInDays}
              disabled={this.sending}
              onInput={(e: any) => this.handleExpiryInput(e)}
            />
            <span class="suffix">days</span>
          </div>,
          <p class="hint">
            This envelope will expire on {when}. Expirations may be set from {MIN_EXPIRY_DAYS}-{MAX_EXPIRY_DAYS} days. If left blank, this will default to {DEFAULT_EXPIRY_DAYS}.
          </p>,
        ])}
        {this.renderDoneButton()}
      </div>
    );
  }

  renderSenderView() {
    const validEmail = !this.senderEmail.trim() || isValidEmail(this.senderEmail.trim());
    return (
      <div class="detail">
        {this.renderDetailHeader('Sender')}
        {this.renderDetailBody([
          <div class="sender-field">
            <label htmlFor={`${this.containerId}-sender-name`}>Name</label>
            <input
              id={`${this.containerId}-sender-name`}
              type="text"
              value={this.effectiveSenderName()}
              disabled={this.sending}
              onInput={(e: any) => (this.senderName = e.target.value)}
            />
          </div>,
          <div class="sender-field">
            <label htmlFor={`${this.containerId}-sender-email`}>Email</label>
            <input
              id={`${this.containerId}-sender-email`}
              type="email"
              value={this.effectiveSenderEmail()}
              disabled={this.sending}
              onInput={(e: any) => (this.senderEmail = e.target.value)}
            />
            {!validEmail && <div class="field-error">Enter a valid email address.</div>}
          </div>,
          <div class="notice">
            <span class="icon" innerHTML={infoIcon} />
            <div>
              The name is what recipients see as the sender, for example "Sentry &lt;notifications@verdocs.com&gt;", and starts as your brand's name. The email is where status
              updates about this envelope are sent and what the certificate shows as the sender. Delivery from your own address needs a custom sender set up under Settings.
            </div>
          </div>,
        ])}
        {this.renderDoneButton()}
      </div>
    );
  }

  renderNotificationsView() {
    return (
      <div class="detail">
        {this.renderDetailHeader('Notifications')}
        {this.renderDetailBody([
          <verdocs-checkbox size="small" label="Disable notifications" checked={this.noContact} onInput={(e: any) => (this.noContact = !!e.target.checked)} />,
          this.noContact && (
            <div class="warning">
              <span class="icon" innerHTML={warningIcon} />
              <div>
                Disabling notifications turns off invitations and reminders to recipients as well as status updates to you. You may obtain invite links in the recipient summary or
                via an API call. We strongly recommend enabling{' '}
                <a href={`${getWebAppUrl(this.endpoint)}/settings/webhooks`} target="_blank" rel="noopener">
                  Webhooks
                  <span class="icon" innerHTML={externalLinkIcon} />
                </a>{' '}
                to help automate this process.
              </div>
            </div>
          ),
        ])}
        {this.renderDoneButton()}
      </div>
    );
  }

  renderDetail() {
    switch (this.view) {
      case 'recipient':
        return this.renderRecipientView();
      case 'brand':
        return this.renderBrandView();
      case 'expires':
        return this.renderExpiresView();
      case 'notifications':
        return this.renderNotificationsView();
      case 'sender':
        return this.renderSenderView();
      default:
        return null;
    }
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
    const assignedEmails = rolesAssigned.map(r => r.email.toLowerCase());
    const hasDuplicateEmails = new Set(assignedEmails).size < assignedEmails.length;
    const expiresAt = this.expiresAt();
    const expiresShort = expiresAt.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});

    return (
      <Host class={{'sendable': this.template?.is_sendable, 'detail-open': this.view !== 'main'}}>
        <div class="track">
          <div class="pane main-pane" aria-hidden={this.view !== 'main' ? 'true' : 'false'}>
            <div class="section-title">Recipients</div>
            <div class="recipients">
              {levels.map(level => [
                levels.length > 1 && <div class="step">Step {level}</div>,
                this.getRolesAtLevel(level).map(role => {
                  const roleIndex = getRoleIndex(this.template, role.role_name);
                  const completed = this.rolesCompleted[role.id];
                  const assigned = completed && rolesAssigned.findIndex(r => r.role_name === role.role_name) > -1;
                  const optionLabels = this.getRecipientOptionLabels(completed);

                  return (
                    <button type="button" class="recipient" data-ri={roleIndex} data-rn={role.role_name} onClick={e => this.handleClickRole(e, role)}>
                      <span class="role-dot" style={{backgroundColor: getRGBA(roleIndex)}} />
                      <span class="who">
                        <span class="role-name">{role.role_name}</span>
                        {assigned ? (
                          <span class="who-detail">
                            {formatFullName(completed)} · {completed.email}
                          </span>
                        ) : (
                          <span class="who-detail configure">Configure recipient</span>
                        )}
                        {optionLabels.length > 0 && (
                          <span class="options">
                            {optionLabels.map(label => (
                              <span class="pill">{label}</span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span class="chevron" innerHTML={chevronRightIcon} />
                    </button>
                  );
                }),
              ])}
            </div>

            <div class="section-title delivery-title">Delivery</div>
            <div class="delivery">
              <button type="button" class="kv" onClick={() => this.showView('brand')} disabled={this.sending}>
                <span class="key">Brand</span>
                <span class="value">{this.getSelectedBrandLabel()}</span>
                <span class="chevron" innerHTML={chevronRightIcon} />
              </button>
              <button type="button" class="kv" onClick={() => this.showView('expires')} disabled={this.sending}>
                <span class="key">Expires</span>
                <span class="value">
                  {this.effectiveExpiryDays()} days <small>· {expiresShort}</small>
                </span>
                <span class="chevron" innerHTML={chevronRightIcon} />
              </button>
              <button type="button" class="kv" onClick={() => this.showView('sender')} disabled={this.sending}>
                <span class="key">Sender</span>
                <span class="value">
                  {this.effectiveSenderName() || this.effectiveSenderEmail()}
                  {this.effectiveSenderName() && this.effectiveSenderEmail() ? <small> · {this.effectiveSenderEmail()}</small> : null}
                </span>
                <span class="chevron" innerHTML={chevronRightIcon} />
              </button>
              <button type="button" class="kv" onClick={() => this.showView('notifications')} disabled={this.sending}>
                <span class="key">Notifications</span>
                <span class={{value: true, off: this.noContact}}>{this.noContact ? 'Off' : 'On'}</span>
                <span class="chevron" innerHTML={chevronRightIcon} />
              </button>
            </div>

            <div class="main-spacer" />

            <div class="buttons">
              {hasDuplicateEmails && <div class="error-message">Recipients cannot share the same email.</div>}
              {this.sending && <verdocs-spinner />}
              {this.showCancel && <verdocs-button label="Cancel" size="small" variant="outline" onClick={e => this.handleCancel(e)} disabled={this.sending} />}
              <verdocs-button label="Send" size="small" disabled={!allRolesAssigned || this.sending || hasDuplicateEmails} onClick={e => this.handleSend(e)} />
            </div>
          </div>

          <div
            class="pane detail-pane"
            aria-hidden={this.view === 'main' ? 'true' : 'false'}
            onPointerDown={e => this.handleSwipeStart(e)}
            onPointerUp={e => this.handleSwipeEnd(e)}
            onPointerCancel={() => (this.swipeStart = null)}
          >
            {this.renderDetail()}
          </div>
        </div>
      </Host>
    );
  }
}
