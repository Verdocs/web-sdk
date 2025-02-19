import {Component, h, Event, EventEmitter, Fragment, Prop, State} from '@stencil/core';
import {formatFullName, getActiveEntitlements, IEntitlement, IProfile, IRecipient, isValidEmail, TEntitlement, TRecipientAuthMethod, VerdocsEndpoint} from '@verdocs/js-sdk';
import {getFeatureFlags, IFeatureFlags} from '../../../utils/Unleash';
import {convertToE164} from '../../../utils/utils';

const addrBookIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-user"><path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/></svg>`;

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
  @State() auth_methods: TRecipientAuthMethod[] = [];
  @State() passcode: string = '';

  @State() firstNameFieldId = `verdocs-contact-picker-firstname-${Math.random().toString(36).substring(2, 11)}`;
  @State() lastNameFieldId = `verdocs-contact-picker-lastname-${Math.random().toString(36).substring(2, 11)}`;
  @State() emailFieldId = `verdocs-contact-picker-email-${Math.random().toString(36).substring(2, 11)}`;
  @State() phoneFieldId = `verdocs-contact-picker-phone-${Math.random().toString(36).substring(2, 11)}`;

  @State() featureFlags: IFeatureFlags = null;
  @State() activeEntitlements: Partial<Record<TEntitlement, IEntitlement>> = {};

  componentWillLoad() {
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
      this.delegator = this.templateRole.delegator || false;
      this.message = this.templateRole.message || '';
      this.showMessage = this.message !== '';
      this.auth_methods = this.templateRole.auth_methods || [];
      this.passcode = this.templateRole.passcode || '';
      // TODO: Allow template roles to have zip codes predefined?
    }

    getActiveEntitlements(this.endpoint)
      .then(r => {
        this.activeEntitlements = r;
        console.log('[CONTACT PICKER] Loaded entitlements', r);
      })
      .catch(e => console.log('[CONTACT PICKER] Error loading entitlements, some features may be disabled.', e));

    getFeatureFlags()
      .then(flags => {
        this.featureFlags = flags;
        console.log('[CONTACT PICKER] Loaded feature flags', flags);
      })
      .catch(e => {
        console.log('[CONTACT PICKER] Unable to fetch feature flags, some features may be disabled.', e);
      });
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

  // The reason for the random names/IDs is to disable browser autocomplete. We set the autocomplete tags but many browsers ignore them
  // and show a duplicate autocomplete picker on top of our own.
  render() {
    // const hasBasics = this.first_name && this.last_name && (isValidEmail(this.email) || isValidPhone(this.phone));
    const hasBasics = this.first_name && this.last_name && isValidEmail(this.email);
    const hasAuthRequirements =
      !this.auth_methods.length ||
      (this.auth_methods.includes('passcode') && !!this.passcode) ||
      (this.auth_methods.includes('kba') && !!this.first_name && !!this.last_name) ||
      (this.auth_methods.includes('email') && !!this.email) ||
      (this.auth_methods.includes('sms') && !!this.phone);
    const canSubmit = hasBasics && hasAuthRequirements;
    const globalSMS = this.featureFlags?.toggles?.find(t => t.name === 'sms')?.enabled === true;

    const verificationOptions = [];

    if (this.featureFlags?.toggles?.find(t => t.name === 'passcode-verification')?.enabled === true) {
      verificationOptions.push({label: 'Passcode', value: 'passcode'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'email-verification')?.enabled === true) {
      verificationOptions.push({label: 'Email', value: 'email'});
    }

    if (globalSMS && this.featureFlags?.toggles?.find(t => t.name === 'sms-verification')?.enabled === true && !!this.activeEntitlements.sms_auth) {
      verificationOptions.push({label: 'SMS (One-Time Code)', value: 'sms'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'kba-verification')?.enabled === true && !!this.activeEntitlements.kba_auth) {
      verificationOptions.push({label: 'Knowledge-Based (KBA)', value: 'kba'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'id-verification')?.enabled === true && !!this.activeEntitlements.id_auth) {
      verificationOptions.push({label: 'ID Check', value: 'id'});
    }

    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <div class="row">
          <label htmlFor={this.firstNameFieldId}>Name:</label>
          <div class="names-row">
            <input
              id={this.firstNameFieldId}
              name={this.firstNameFieldId}
              type="text"
              data-lpignore="true"
              autocomplete="blocked"
              aria-autocomplete="none"
              value={this.first_name}
              placeholder="First..."
              onBlur={() => {
                this.showSuggestions = false;
              }}
              onFocus={() => {
                // Give the blur event a chance to hide it first if going between first/last
                setTimeout(() => {
                  this.showSuggestions = this.contactSuggestions?.length > 0;
                }, 100);
              }}
              onInput={e => this.handleFirstNameChange(e)}
            />
            <input
              id={this.lastNameFieldId}
              name={this.lastNameFieldId}
              type="text"
              data-lpignore="true"
              autocomplete="blocked"
              aria-autocomplete="none"
              value={this.last_name}
              placeholder="Last..."
              onBlur={() => {
                this.showSuggestions = false;
              }}
              onFocus={() => {
                // Give the blur event a chance to hide it first if going between first/last
                setTimeout(() => {
                  this.showSuggestions = this.contactSuggestions?.length > 0;
                }, 100);
              }}
              onInput={e => this.handleLastNameChange(e)}
            />
          </div>

          {this.showSuggestions && (
            <div class="dropdown">
              {this.contactSuggestions
                .filter(suggestion => !this.first_name || suggestion.first_name.toLowerCase().includes(this.first_name.toLowerCase()))
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

        <div class="row">
          <label htmlFor={this.emailFieldId}>Email:</label>
          <input
            id={this.emailFieldId}
            name={this.emailFieldId}
            type="text"
            data-lpignore="true"
            autoComplete="blocked"
            aria-autocomplete="none"
            value={this.email}
            placeholder="Invite/verify via email..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={(e: any) => (this.email = e.target.value)}
          />
        </div>

        {/* TODO: Check entitlement for SMS invites */}
        {globalSMS && (
          <div class="row">
            <label htmlFor={this.phoneFieldId}>Phone:</label>
            <input
              id={this.phoneFieldId}
              name={this.phoneFieldId}
              type="text"
              data-lpignore="true"
              autoComplete="blocked"
              aria-autocomplete="none"
              value={this.phone}
              placeholder="Invite/verify via SMS..."
              onFocus={() => (this.showSuggestions = false)}
              onInput={(e: any) => {
                this.phone = convertToE164(e.target.value);
              }}
            />
          </div>
        )}

        <Fragment>
          <div class="kba-row">
            <label>Recipient Verification:</label>
            <verdocs-multiselect
              label=""
              placeholder="None"
              options={verificationOptions}
              selectedOptions={this.auth_methods}
              onSelectionChanged={(e: any) => {
                console.log('selectedOptions changed', e.detail);
              }}
            />
          </div>

          {this.auth_methods.includes('passcode') && (
            <div class="row pin-code">
              <label htmlFor={this.phoneFieldId}>Passcode:</label>
              <input
                id="verdocs-passcode"
                name="verdocs-passcode"
                type="text"
                data-lpignore="true"
                autocomplete="blocked"
                aria-autocomplete="none"
                value={this.passcode}
                placeholder="4-8 digits recommended..."
                onFocus={() => (this.showSuggestions = false)}
                onInput={(e: any) => (this.passcode = e.target.value)}
              />
            </div>
          )}
        </Fragment>

        <div class="row message">
          <label htmlFor="verdocs-contact-picker-message">Message:</label>
          <textarea
            id="verdocs-contact-picker-message"
            name="verdocs-contact-picker-message"
            data-lpignore="true"
            autocomplete="blocked"
            placeholder="Optional message to include in invitation..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={(e: any) => (this.message = e.target.value)}
          >
            {this.message}
          </textarea>
        </div>

        <div class="buttons">
          <div class="flex-fill" />

          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="OK" size="small" disabled={!canSubmit} onClick={!canSubmit ? () => {} : e => this.handleSubmit(e)} />
        </div>
      </form>
    );
  }
}
