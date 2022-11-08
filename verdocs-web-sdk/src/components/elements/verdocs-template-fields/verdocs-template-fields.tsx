import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IRole} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';

// const messageIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>';
//
// const delegateIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AssignmentIndIcon" tabindex="-1" title="AssignmentInd"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></svg>';
//
// const placeholderIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AccountCircleIcon" tabindex="-1" title="AccountCircle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"></path></svg>';

export interface IContactSearchEvent {
  // The text the user has entered in the search field
  query: string;
}

export interface IContactSelectEvent {
  full_name: string;
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
  tag: 'verdocs-template-fields',
  styleUrl: 'verdocs-template-fields.scss',
  shadow: false,
})
export class VerdocsTemplateFields {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * The role that this contact will be assigned to.
   */
  @Prop() templateRole: IRole | null = null;

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
   * Event fired when the user cancels the dialog.
   */
  @Event({composed: true}) cancel: EventEmitter;

  /**
   * Event fired when the user changes the type.
   */
  @Event({composed: true}) contactSelected: EventEmitter<IContactSelectEvent>;

  @State() name: string;
  @State() email: string;
  @State() phone: string;
  @State() message: string;
  @State() showSuggestions: boolean = false;
  @State() showMessage: boolean = false;
  @State() delegator: boolean = false;

  componentWillLoad() {
    if (this.templateRole) {
      this.name = this.templateRole.full_name || '';
      this.email = this.templateRole.email || '';
      this.phone = this.templateRole.phone || '';
      this.delegator = this.templateRole.delegator || false;
      this.message = this.templateRole.message || '';
      this.showMessage = this.message !== '';
    }
  }

  handleNameChange(e: any) {
    this.name = e.target.value;
    this.searchContacts?.emit({query: this.name});
  }

  handleEmailChange(e: any) {
    this.email = e.target.value;
  }

  handlePhoneChange(e: any) {
    this.phone = e.target.value;
  }

  handleMessageChange(e: any) {
    this.message = e.target.value;
  }

  handleCancel(e) {
    e.stopPropagation();
    this.showSuggestions = false;
    this.cancel?.emit();
  }

  handleSubmit(e) {
    e.stopPropagation();

    this.showSuggestions = false;
    this.contactSelected?.emit({
      full_name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      delegator: this.delegator,
    });
  }

  handleSelectSuggestion(e: any, suggestion: IEmailContact | IPhoneContact) {
    e.stopPropagation();

    this.name = suggestion.name;
    this.email = suggestion.email;
    this.phone = suggestion.phone;
    this.showSuggestions = false;
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} onClick={e => e.stopPropagation()} autocomplete="off">
      </form>
    );
  }
}
