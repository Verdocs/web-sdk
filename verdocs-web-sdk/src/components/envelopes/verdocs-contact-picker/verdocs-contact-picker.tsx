import {Component, h, Event, EventEmitter, Fragment, Prop, State} from '@stencil/core';
import {formatFullName, getActiveEntitlements, IEntitlement, IProfile, IRecipient, isValidEmail, TEntitlement, TKBAMethod, VerdocsEndpoint} from '@verdocs/js-sdk';
import {getFeatureFlags, IFeatureFlags} from '../../../utils/Unleash';
import {convertToE164} from '../../../utils/utils';

// const messageIcon =
//   '<svg focusable="false" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>';

// const delegateIcon =
//   '<svg focusable="false" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></svg>';

// const kbaIcon =
//   '<svg focusable="false" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" /></svg>';

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
  kba_method: string;
  kba_pin: string;
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
  @State() showKba: boolean = true;
  @State() kba_method: TKBAMethod = '';
  @State() kba_pin: string = '';

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
      this.kba_method = this.templateRole.kba_method || '';
      this.kba_pin = this.templateRole.kba_pin || '';
      this.showKba = !!this.kba_method;
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
      kba_method: this.kba_method,
      kba_pin: this.kba_pin,
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
      !this.kba_method ||
      (this.kba_method === 'pin' && !!this.kba_pin) ||
      (this.kba_method === 'kba' && !!this.kba_pin) ||
      (this.kba_method === 'id' && !!this.kba_pin) ||
      (this.kba_method === 'sms' && !!this.kba_pin) ||
      (this.kba_method === 'pin' && !!this.kba_pin);
    // "pin" | "kba" | "id" | "sms" | "" | null
    const hasKbaRequirements =
      !this.kba_method ||
      // Passcode-based KBA requires a PIN
      (this.kba_method === 'pin' && this.kba_pin) ||
      // KBA has address/zip but they're optional
      this.kba_method === 'kba' ||
      // Fully ID-based KBA requires nothing else
      this.kba_method === 'id' ||
      // SMS requires a phone number
      (this.kba_method === 'sms' && this.phone);
    const canSubmit = hasBasics && hasKbaRequirements;

    const verificationOptions = [{label: 'None', value: ''}];

    if (!!this.activeEntitlements.passcode_auth) {
      verificationOptions.push({label: 'Passcode', value: 'pin'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'sms-verification')?.enabled === true && !!this.activeEntitlements.sms_auth) {
      verificationOptions.push({label: 'SMS (One-Time Code)', value: 'sms'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'kba-verification')?.enabled === true) {
      verificationOptions.push({label: 'Knowledge-Based (KBA)', value: 'kba'});
    }

    if (this.featureFlags?.toggles?.find(t => t.name === 'id-verification')?.enabled === true) {
      verificationOptions.push({label: 'ID Check', value: 'id'});
      verificationOptions.push({label: 'KBA + ID Check', value: 'kba_id'});
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
              value={this.first_name}
              placeholder="First..."
              onFocus={() => (this.showSuggestions = this.contactSuggestions?.length > 0)}
              onInput={e => this.handleFirstNameChange(e)}
            />
            <input
              id={this.lastNameFieldId}
              name={this.lastNameFieldId}
              type="text"
              data-lpignore="true"
              autocomplete="blocked"
              value={this.last_name}
              placeholder="Last..."
              onFocus={() => (this.showSuggestions = false)}
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
            value={this.email}
            placeholder="Invite via email..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={(e: any) => (this.email = e.target.value)}
          />
        </div>

        {/* TODO: Check entitlement for SMS invites */}
        {/*{smsEnabled && this.kba_method === 'sms' && (*/}
        <div class="row">
          <label htmlFor={this.phoneFieldId}>Phone:</label>
          <input
            id={this.phoneFieldId}
            name={this.phoneFieldId}
            type="text"
            data-lpignore="true"
            autoComplete="blocked"
            value={this.phone}
            placeholder="Invite via SMS..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={(e: any) => {
              this.phone = convertToE164(e.target.value);
            }}
          />
        </div>
        {/*)}*/}

        <Fragment>
          <div class="kba-row">
            <label>Recipient Verification:</label>
            <verdocs-select-input
              value={this.kba_method}
              onInput={(e: any) => {
                this.kba_method = e.target.value;
                this.zip = '';
                this.address = '';
                this.kba_pin = '';
              }}
              options={verificationOptions}
            />
          </div>

          {this.kba_method === 'sms' && (
            <div class="row">
              <label htmlFor={this.phoneFieldId}>Phone:</label>
              <input
                id={this.phoneFieldId}
                name={this.phoneFieldId}
                type="text"
                data-lpignore="true"
                autoComplete="blocked"
                value={this.phone}
                placeholder="Verify via SMS one-time code..."
                onFocus={() => (this.showSuggestions = false)}
                onInput={(e: any) => {
                  this.phone = convertToE164(e.target.value);
                }}
              />
            </div>
          )}

          {this.kba_method === 'pin' && (
            <div class="row pin-code">
              <label htmlFor={this.phoneFieldId}>Passcode:</label>
              <input
                id="verdocs-pin-code"
                name="verdocs-pin-code"
                type="text"
                data-lpignore="true"
                autocomplete="blocked"
                value={this.kba_pin}
                placeholder="4-8 digits recommended..."
                onFocus={() => (this.showSuggestions = false)}
                onInput={(e: any) => (this.kba_pin = e.target.value)}
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
