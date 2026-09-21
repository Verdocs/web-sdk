import {Component, Element, h, Event, EventEmitter, Listen, Prop, State} from '@stencil/core';
import {formatFullName, getActiveEntitlements, IEntitlement, IProfile, IRecipient, isValidEmail, TEntitlement, TRecipientAuthMethod, VerdocsEndpoint} from '@verdocs/js-sdk';
import {updateScrollFade} from '../../../utils/ScrollFade';
import {convertToE164} from '../../../utils/utils';

const addrBookIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-user"><path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/></svg>`;

const lockIcon = `<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

type TSigningOption = 'none' | 'delegator' | 'name_locked';

export interface IContactSearchEvent {
  query: string;
}

export interface IContactSelectEvent {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  delegator: boolean;
  name_locked: boolean;
  auth_methods: TRecipientAuthMethod[];
  passcode: string;
  address: string;
  zip: string;
}

export type TPickerContact = Partial<IProfile>;

/**
 * Display a contact picker suitable for filling out Recipient objects when sending Envelopes.
 *
 * This picker can also be integrated with a backend to provide contact list / suggestion / address-book style behavior. As the
 * user interacts with the component, the text entered in the name fields is sent back to the parent via the `searchContacts` event.
 * The parent can use that text as a query string to call a backend to obtain appropriate contacts to show. This list may also be
 * hard-coded ahead of time to provide the user with smart suggestions on initial display, such as "Recently Used" contacts, or
 * to always display the user's own contact record.
 *
 * ```ts
 * <verdocs-contact-picker
 *   templateRole={role}
 *   contactSuggestions={[]}
 *   onNext={e => console.log('Contact completed', e.detail)}
 *   />
 * ```
 */
@Component({
  tag: 'verdocs-contact-picker',
  styleUrl: 'verdocs-contact-picker.scss',
  shadow: false,
})
export class VerdocsContactPicker {
  @Element() el: HTMLElement;

  private namesRowEl: HTMLElement;
  private suggestionsEl: HTMLElement;

  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The role that this contact will be assigned to.
   */
  @Prop() templateRole: Partial<IRecipient> | null = null;

  /**
   * If set, suggestions will be displayed in a drop-down list to the user. It is recommended that the number
   * of suggestions be limited to the 5 best matching records.
   */
  @Prop() contactSuggestions: TPickerContact[] = [];

  /**
   * Whether to show a Cancel button beside Done.
   */
  @Prop() showCancel = true;

  /**
   * Event fired when the user enters text in the search field. The calling application may use this to update
   * the `contactSuggestions` property.
   */
  @Event({composed: true}) searchContacts: EventEmitter<IContactSearchEvent>;

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) next: EventEmitter<IContactSelectEvent>;

  @State() first_name: string;
  @State() last_name: string;
  @State() email: string;
  @State() phone: string;
  @State() zip: string;
  @State() address: string;
  @State() message: string;
  @State() showSuggestions: boolean = false;
  @State() showMessage: boolean = false;
  @State() delegator: boolean = false;
  @State() name_locked: boolean = false;
  @State() auth_methods: TRecipientAuthMethod[] = [];
  @State() passcode: string = '';

  @State() firstNameFieldId = `verdocs-contact-picker-firstname-${Math.random().toString(36).substring(2, 11)}`;
  @State() lastNameFieldId = `verdocs-contact-picker-lastname-${Math.random().toString(36).substring(2, 11)}`;
  @State() emailFieldId = `verdocs-contact-picker-email-${Math.random().toString(36).substring(2, 11)}`;
  @State() phoneFieldId = `verdocs-contact-picker-phone-${Math.random().toString(36).substring(2, 11)}`;

  @State() activeEntitlements: Partial<Record<TEntitlement, IEntitlement>> = {};
  @State() authMethodsLoading: boolean = true;

  async componentWillLoad() {
    this.endpoint.loadSession();

    if (this.templateRole) {
      const fullName = formatFullName(this.templateRole);
      const nameComponents = fullName.split(' ');
      const firstName = this.templateRole.first_name || nameComponents.shift() || '';
      const lastName = this.templateRole.last_name || nameComponents.join(' ') || '';
      this.first_name = firstName;
      this.last_name = lastName;

      this.email = this.templateRole.email || '';
      this.phone = this.templateRole.phone || '';
      // delegator and name_locked are mutually exclusive; delegator takes precedence if both are somehow set
      this.delegator = this.templateRole.delegator || false;
      this.name_locked = this.delegator ? false : this.templateRole.name_locked || false;
      this.message = this.templateRole.message || '';
      this.showMessage = this.message !== '';
      this.auth_methods = this.templateRole.auth_methods || [];
      this.passcode = this.templateRole.passcode || '';
    }

    // Entitlements only gate optional methods like KBA. We need error handling here in case the getActiveEntitlements
    // call fails or we stay loading forever.
    this.activeEntitlements = await getActiveEntitlements(this.endpoint).catch(e => {
      console.warn('[CONTACT PICKER] Unable to load entitlements, continuing with base auth methods only', e);
      return {} as Partial<Record<TEntitlement, IEntitlement>>;
    });

    this.authMethodsLoading = false;
    console.log('[CONTACT PICKER] Loaded entitlements', this.activeEntitlements);
  }

  // Make sure the suggestion list doesn't break the scroll region
  componentDidRender() {
    const body = this.el.querySelector('.form-body') as HTMLElement | null;
    updateScrollFade(body);
    if (this.suggestionsEl && this.namesRowEl && body) {
      this.suggestionsEl.style.top = `${this.namesRowEl.offsetTop + this.namesRowEl.offsetHeight - body.scrollTop + 4}px`;
    }
  }

  @Listen('click', {target: 'document'})
  handleDocumentClick(e: MouseEvent) {
    if (this.showSuggestions && !this.el.contains(e.target as Node)) {
      this.showSuggestions = false;
    }
  }

  handleFirstNameChange(e: any) {
    this.first_name = e.target.value;
    this.searchContacts?.emit({query: this.first_name});
  }

  handleLastNameChange(e: any) {
    this.last_name = e.target.value;
    this.searchContacts?.emit({query: this.last_name});
  }

  handleCancel(e: any) {
    e.stopPropagation();
    this.showSuggestions = false;
    this.exit?.emit();
  }

  handleSubmit(e: any) {
    e.stopPropagation();

    this.showSuggestions = false;
    this.next?.emit({
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      delegator: this.delegator,
      name_locked: this.name_locked,
      auth_methods: this.auth_methods,
      passcode: this.passcode,
      address: this.address,
      zip: this.zip,
    });
  }

  handleSelectSuggestion(e: any, suggestion: TPickerContact) {
    e.stopPropagation();

    this.first_name = suggestion.first_name;
    this.last_name = suggestion.last_name;
    this.email = suggestion.email;
    this.phone = suggestion.phone;
    this.showSuggestions = false;
  }

  toggleAuthMethod(method: TRecipientAuthMethod) {
    if (this.auth_methods.includes(method)) {
      this.auth_methods = this.auth_methods.filter(selected => selected !== method);
    } else {
      this.auth_methods = [...this.auth_methods, method];
    }
  }

  // TODO: Decide whether we want to keep these mutually-exclusive
  setSigningOption(option: TSigningOption) {
    this.delegator = option === 'delegator';
    this.name_locked = option === 'name_locked';
  }

  renderPill(label: string, selected: boolean, onClick: () => void, opts: {locked?: boolean; title?: string} = {}) {
    return (
      <button
        type="button"
        class={{pill: true, selected, locked: !!opts.locked}}
        aria-pressed={selected ? 'true' : 'false'}
        disabled={opts.locked && !selected}
        title={opts.title}
        onClick={onClick}
      >
        {opts.locked && <span class="pill-icon" innerHTML={lockIcon} />}
        {label}
      </button>
    );
  }

  // The reason for the random names/IDs is to disable browser autocomplete. We set the autocomplete tags but many browsers ignore them
  // and show a duplicate autocomplete picker on top of our own.
  render() {
    const hasBasics = this.first_name && this.last_name && isValidEmail(this.email);

    const hasAuthRequirements = this.auth_methods.every(method => {
      switch (method) {
        case 'passcode':
          return !!this.passcode;
        case 'kba':
          return !!this.first_name && !!this.last_name;
        case 'email':
          return !!this.email;
        case 'sms':
          return !!this.phone;
        default:
          return true;
      }
    });

    const canSubmit = hasBasics && hasAuthRequirements;
    const hasSMSAuth = !!this.activeEntitlements.sms_auth;

    // TODO: We show non-entitled options disabled so folks know what's possible. We could alternatively hide them.
    const verificationOptions: {label: string; value: TRecipientAuthMethod; locked?: boolean}[] = [
      {label: 'Email OTP', value: 'email'},
      {label: 'Passcode', value: 'passcode'},
      {label: 'SMS OTP', value: 'sms', locked: !hasSMSAuth},
      {label: 'KBA', value: 'kba', locked: !this.activeEntitlements.kba_auth},
      {label: 'ID check', value: 'id', locked: !this.activeEntitlements.id_auth},
    ];

    const signingOption: TSigningOption = this.delegator ? 'delegator' : this.name_locked ? 'name_locked' : 'none';

    return (
      <form onSubmit={e => e.preventDefault()} autocomplete="off">
        <div class="form-body-wrap">
          <div
            class="form-body"
            onScroll={(e: any) => {
              updateScrollFade(e.target);
              this.showSuggestions = false;
            }}
          >
            <div class="row names" ref={el => (this.namesRowEl = el)}>
              <div class="field">
                <label htmlFor={this.firstNameFieldId}>First name</label>
                <input
                  id={this.firstNameFieldId}
                  name={this.firstNameFieldId}
                  type="text"
                  data-lpignore="true"
                  autocomplete="blocked"
                  aria-autocomplete="none"
                  value={this.first_name}
                  onFocus={() => {
                    // Give the blur event a chance to hide it first if going between first/last
                    setTimeout(() => {
                      this.showSuggestions = this.contactSuggestions?.length > 0;
                    }, 100);
                  }}
                  onInput={e => this.handleFirstNameChange(e)}
                />
              </div>
              <div class="field">
                <label htmlFor={this.lastNameFieldId}>Last name</label>
                <input
                  id={this.lastNameFieldId}
                  name={this.lastNameFieldId}
                  type="text"
                  data-lpignore="true"
                  autocomplete="blocked"
                  aria-autocomplete="none"
                  value={this.last_name}
                  onFocus={() => {
                    // Give the blur event a chance to hide it first if going between first/last
                    setTimeout(() => {
                      this.showSuggestions = this.contactSuggestions?.length > 0;
                    }, 100);
                  }}
                  onInput={e => this.handleLastNameChange(e)}
                />
              </div>
            </div>

            <div class="field">
              <label htmlFor={this.emailFieldId}>Email</label>
              <input
                id={this.emailFieldId}
                name={this.emailFieldId}
                type="text"
                data-lpignore="true"
                autoComplete="blocked"
                aria-autocomplete="none"
                value={this.email}
                onFocus={() => (this.showSuggestions = false)}
                onInput={(e: any) => (this.email = e.target.value)}
              />
            </div>

            {hasSMSAuth && (
              <div class="field">
                <label htmlFor={this.phoneFieldId}>
                  Phone <span class="optional">(optional)</span>
                </label>
                <input
                  id={this.phoneFieldId}
                  name={this.phoneFieldId}
                  type="text"
                  data-lpignore="true"
                  autoComplete="blocked"
                  aria-autocomplete="none"
                  value={this.phone}
                  placeholder="+1 (555) 000-0000"
                  onFocus={() => (this.showSuggestions = false)}
                  onInput={(e: any) => {
                    this.phone = convertToE164(e.target.value);
                  }}
                />
              </div>
            )}

            <div class="group">
              <div class="group-label">Verification</div>
              {this.authMethodsLoading ? (
                <verdocs-spinner size={10} mode="dark" />
              ) : (
                <div class="pills">
                  {verificationOptions.map(option =>
                    this.renderPill(option.label, this.auth_methods.includes(option.value), () => this.toggleAuthMethod(option.value), {
                      locked: option.locked,
                      title: option.locked ? 'Please contact sales@verdocs.com to enable this feature.' : undefined,
                    }),
                  )}
                </div>
              )}

              {this.auth_methods.includes('passcode') && (
                <div class="passcode">
                  <input
                    id="verdocs-passcode"
                    name="verdocs-passcode"
                    type="text"
                    data-lpignore="true"
                    autocomplete="blocked"
                    aria-autocomplete="none"
                    aria-label="Passcode"
                    value={this.passcode}
                    placeholder="4-8 digits"
                    onFocus={() => (this.showSuggestions = false)}
                    onInput={(e: any) => (this.passcode = e.target.value)}
                  />
                  <span class="passcode-hint">PIN or passcode shared separately with the recipient ahead of time</span>
                </div>
              )}
            </div>

            <div class="group">
              <div class="group-label">Signing options</div>
              <div class="pills">
                {this.renderPill('None', signingOption === 'none', () => this.setSigningOption('none'))}
                {this.renderPill('May delegate', signingOption === 'delegator', () => this.setSigningOption('delegator'))}
                {this.renderPill('Name locked', signingOption === 'name_locked', () => this.setSigningOption('name_locked'))}
              </div>
            </div>

            <div class="field">
              <label htmlFor="verdocs-contact-picker-message">
                Message <span class="optional">(optional)</span>
              </label>
              <textarea
                id="verdocs-contact-picker-message"
                name="verdocs-contact-picker-message"
                data-lpignore="true"
                autocomplete="blocked"
                placeholder="Add a message to the invitation"
                onFocus={() => (this.showSuggestions = false)}
                onInput={(e: any) => (this.message = e.target.value)}
              >
                {this.message}
              </textarea>
            </div>
          </div>
          <div class="scroll-fade" />
          {this.showSuggestions && (
            <div class="suggestions" role="listbox" ref={el => (this.suggestionsEl = el)}>
              {this.contactSuggestions
                .filter(suggestion => !this.first_name || suggestion.first_name?.toLowerCase().includes(this.first_name.toLowerCase()))
                .map(suggestion => (
                  <div key={suggestion.id ?? suggestion.email} class="suggestion" onClick={e => this.handleSelectSuggestion(e, suggestion)}>
                    {suggestion.picture ? <img alt="Avatar" class="avatar" src={suggestion.picture} /> : <div class="avatar" innerHTML={addrBookIcon} />}
                    <div class="details">
                      <div class="name">{formatFullName(suggestion)}</div>
                      {suggestion.email && <div class="destination">{suggestion.email}</div>}
                      {suggestion.phone && <div class="destination">{suggestion.phone}</div>}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div class="buttons">
          {this.showCancel && <verdocs-button label="Cancel" variant="text" size="small" onClick={e => this.handleCancel(e)} />}
          <verdocs-button label="Done" size="small" disabled={!canSubmit} onClick={!canSubmit ? () => {} : e => this.handleSubmit(e)} />
        </div>
      </form>
    );
  }
}
