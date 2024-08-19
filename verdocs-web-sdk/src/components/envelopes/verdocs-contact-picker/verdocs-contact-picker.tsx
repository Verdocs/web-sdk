import {IRecipient, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';
import {convertToE164} from '../../../utils/utils';

const messageIcon =
  '<svg focusable="false" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>';

// const delegateIcon =
//   '<svg focusable="false" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></svg>';

const kbaIcon =
  '<svg focusable="false" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z" clip-rule="evenodd" /></svg>';

const placeholderIcon =
  '<svg focusable="false" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"></path></svg>';

export interface IContactSearchEvent {
  // The text the user has entered in the search field
  query: string;
}

export interface IContactSelectEvent {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  delegator: boolean;
}

export interface IEmailContact {
  // Optional but recommended. An internal identifier used to identify the contact in the calling system.
  id?: any;

  // The user's avatar. If not set, a placeholder will be shown. To hide avatars entirely, use CSS to set
  // `verdocs-contact-picker .avatar { display: none; }`
  avatar?: string;

  // The recipient's name, as it should be displayed to the user.
  name: string;

  // The recipient's first name, as it should be displayed to the user.
  first_name: string;

  // The recipient's last name, as it should be displayed to the user.
  last_name: string;

  // The email address for the contact.
  email: string;

  // An optional phone number for the contact. This number must be able SMS messages. If both email and phone are provided,
  // notifications will be sent to both locations.
  phone?: string;

  [key: string]: any;
}

export interface IPhoneContact {
  // Optional but recommended. An internal identifier used to identify the contact in the calling system.
  id?: any;

  // The user's avatar. If not set, a placeholder will be shown. To hide avatars entirely, use CSS to set
  // `verdocs-contact-picker .avatar { display: none; }`
  avatar?: string;

  // The recipient's name, as it should be displayed to the user.
  name: string;

  // The recipient's first name, as it should be displayed to the user.
  first_name: string;

  // The recipient's last name, as it should be displayed to the user.
  last_name: string;

  // The email address for the contact.
  email?: string;

  // An optional phone number for the contact. This number must be able SMS messages. If both email and phone are provided,
  // notifications will be sent to both locations.
  phone: string;

  [key: string]: any;
}

/**
 * Displays a contact picker suitable for filling out Recipient objects when sending Documents.
 *
 * This picker can also be integrated with a backend to provide contact list / suggestion / address-book style behavior. As the
 * user interacts with the component, the text entered in the name field is sent back to the parent via the `searchContacts` event.
 * The parent can use that text as a query string to call a backend to obtain appropriate contacts to show. This list may also be
 * hard-coded ahead of time to provide the user with smart suggestions on initial display, such as "Recently Used" contacts, or
 * to always display the user's own contact record.
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
  @Prop() contactSuggestions: (IEmailContact | IPhoneContact)[] = [];

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
  @State() message: string;
  @State() showSuggestions: boolean = false;
  @State() showMessage: boolean = false;
  @State() delegator: boolean = false;
  @State() showKba: boolean = false;
  @State() kbaMethod: string = '';
  @State() pinCode: string = '';

  @State() nameFieldId = `verdocs-contact-picker-name-${Math.random().toString(36).substring(2, 11)}`;
  @State() firstNameFieldId = `verdocs-contact-picker-firstname-${Math.random().toString(36).substring(2, 11)}`;
  @State() lastNameFieldId = `verdocs-contact-picker-lastname-${Math.random().toString(36).substring(2, 11)}`;
  @State() emailFieldId = `verdocs-contact-picker-email-${Math.random().toString(36).substring(2, 11)}`;
  @State() phoneFieldId = `verdocs-contact-picker-phone-${Math.random().toString(36).substring(2, 11)}`;

  componentWillLoad() {
    if (this.templateRole) {
      // TODO: For backwards compatibility, may be removed once templateRole no longer has a full_name
      const nameComponents = (this.templateRole.full_name || '').split(' ');
      const firstName = this.templateRole.first_name || nameComponents.shift() || '';
      const lastName = this.templateRole.last_name || nameComponents.join(' ') || '';
      this.first_name = firstName;
      this.last_name = lastName;

      this.email = this.templateRole.email || '';
      this.phone = this.templateRole.phone || '';
      this.delegator = this.templateRole.delegator || false;
      this.message = this.templateRole.message || '';
      this.showMessage = this.message !== '';
      this.kbaMethod = this.templateRole.kba_method || '';
      this.showKba = !!this.kbaMethod;
      // TODO
      this.pinCode = '';
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

  handleEmailChange(e: any) {
    this.email = e.target.value;
  }

  handlePhoneChange(e: any) {
    this.phone = convertToE164(e.target.value);
  }

  handleMessageChange(e: any) {
    this.message = e.target.value;
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
    });
  }

  handleSelectSuggestion(e: any, suggestion: IEmailContact | IPhoneContact) {
    e.stopPropagation();

    console.log('Selected', suggestion);
    this.first_name = suggestion.first_name;
    this.last_name = suggestion.last_name;
    this.email = suggestion.email;
    this.phone = suggestion.phone;
    this.showSuggestions = false;
  }

  // The reason for the random names/IDs is to disable browser autocomplete. We set the autocomplete tags but many browsers ignore them
  // and show a duplicate autocomplete picker on top of our own.
  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
        <div class="row">
          <label htmlFor={this.nameFieldId}>Name:</label>
          <div class="names-row">
            <input
              id={this.firstNameFieldId}
              name={this.firstNameFieldId}
              type="text"
              data-lpignore="true"
              autocomplete="blocked"
              value={this.first_name}
              placeholder="First Name..."
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
              placeholder="Last Name..."
              onFocus={() => (this.showSuggestions = this.contactSuggestions?.length > 0)}
              onInput={e => this.handleLastNameChange(e)}
            />
          </div>

          {this.showSuggestions && (
            <div class="dropdown">
              {this.contactSuggestions.map(suggestion => (
                <div key={suggestion.id ?? suggestion.name} class="suggestion" onClick={e => this.handleSelectSuggestion(e, suggestion)}>
                  {suggestion.avatar ? <img alt="Avatar" class="avatar" src={suggestion.avatar} /> : <div class="avatar" innerHTML={placeholderIcon} />}
                  <div class="details">
                    <div class="name">{suggestion.name}</div>
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
            placeholder="Email Address..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={e => this.handleEmailChange(e)}
          />
        </div>

        <div class="row">
          <label htmlFor={this.phoneFieldId}>Phone:</label>
          <input
            id={this.phoneFieldId}
            name={this.phoneFieldId}
            type="text"
            data-lpignore="true"
            autoComplete="blocked"
            value={this.phone}
            placeholder="Phone Number..."
            onFocus={() => (this.showSuggestions = false)}
            onInput={e => this.handlePhoneChange(e)}
          />
        </div>

        {this.showKba && (
          <div class="row">
            <div class="label-with-icon">
              <label>KBA:</label>
              <verdocs-help-icon text="Knowledge-Based Authentication adds additional authentication for this user either via a simple PIN code or full address validation. NOTE: There may be a fee for using this feature." />
            </div>
            <verdocs-select-input
              value={this.kbaMethod}
              onInput={(e: any) => (this.kbaMethod = e.target.value)}
              options={[
                {label: 'None', value: ''},
                {label: 'PIN Code', value: 'pin'},
                {label: 'Full Verification', value: 'kba'},
              ]}
            />
            {this.kbaMethod === 'pin' && (
              <input
                id="verdocs-pin-code"
                name="verdocs-pin-code"
                type="text"
                data-lpignore="true"
                autocomplete="blocked"
                value={this.pinCode}
                placeholder="KBA PIN Code..."
                onFocus={() => (this.showSuggestions = false)}
                onInput={e => this.handleMessageChange(e)}
              />
            )}
          </div>
        )}

        {this.showMessage && (
          <div class="row">
            <label htmlFor="verdocs-contact-picker-message">Message:</label>
            <input
              id="verdocs-contact-picker-message"
              name="verdocs-contact-picker-message"
              type="text"
              data-lpignore="true"
              autocomplete="blocked"
              value={this.message}
              placeholder="Invitation Message..."
              onFocus={() => (this.showSuggestions = false)}
              onInput={e => this.handleMessageChange(e)}
            />
          </div>
        )}

        <div class="buttons">
          <verdocs-toggle-button
            icon={kbaIcon}
            size="small"
            active={this.showKba}
            onToggle={e => {
              this.showKba = e.detail.active;
              if (!e.detail.active) {
                this.pinCode = '';
                this.kbaMethod = '';
              }
              this.showSuggestions = false;
            }}
          />
          <verdocs-toggle-button
            icon={messageIcon}
            size="small"
            active={this.showMessage}
            onToggle={e => {
              this.showMessage = e.detail.active;
              this.showSuggestions = false;
            }}
          />
          {/*<verdocs-toggle-button*/}
          {/*  icon={delegateIcon}*/}
          {/*  size="small"*/}
          {/*  active={this.delegator}*/}
          {/*  onToggle={e => {*/}
          {/*    this.delegator = e.detail.active;*/}
          {/*    this.showSuggestions = false;*/}
          {/*  }}*/}
          {/*/>*/}

          <div class="flex-fill" />

          <verdocs-button variant="outline" label="Cancel" size="small" onClick={e => this.handleCancel(e)} />
          <verdocs-button label="OK" size="small" onClick={e => this.handleSubmit(e)} />
        </div>
      </form>
    );
  }
}
