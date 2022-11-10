import interact from 'interactjs';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {IRole, TemplateSenderTypes} from '@verdocs/js-sdk/Templates/Types';
import {Component, h, Event, EventEmitter, Prop, State} from '@stencil/core';
import {getRGBA} from '@verdocs/js-sdk/Utils/Colors';

const senderLabels: Record<TemplateSenderTypes, string> = {
  [TemplateSenderTypes.EVERYONE]: 'Everyone',
  [TemplateSenderTypes.EVERYONE_AS_CREATOR]: 'Everyone as Me',
  [TemplateSenderTypes.ORGANIZATION_MEMBER]: 'Organization member',
  [TemplateSenderTypes.ORGANIZATION_MEMBER_AS_CREATOR]: 'Organization Member as Me',
  [TemplateSenderTypes.CREATOR]: 'Me',
};

// const messageIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>';
//
// const delegateIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AssignmentIndIcon" tabindex="-1" title="AssignmentInd"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></svg>';
//
// const placeholderIcon =
//   '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AccountCircleIcon" tabindex="-1" title="AccountCircle"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"></path></svg>';

const settingsIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m8.021 17.917-.313-2.5q-.27-.125-.625-.334-.354-.208-.625-.395l-2.312.979-1.979-3.438 1.979-1.5q-.021-.167-.031-.364-.011-.198-.011-.365 0-.146.011-.344.01-.198.031-.385l-1.979-1.5 1.979-3.417 2.312.958q.271-.187.615-.385t.635-.344l.313-2.5h3.958l.313 2.5q.312.167.625.344.312.177.604.385l2.333-.958 1.979 3.417-1.979 1.521q.021.187.021.364V10q0 .146-.01.333-.011.188-.011.396l1.958 1.5-1.979 3.438-2.312-.979q-.292.208-.615.395-.323.188-.614.334l-.313 2.5Zm1.937-5.355q1.063 0 1.813-.75t.75-1.812q0-1.062-.75-1.812t-1.813-.75q-1.041 0-1.802.75-.76.75-.76 1.812t.76 1.812q.761.75 1.802.75Zm0-1.333q-.5 0-.864-.364-.365-.365-.365-.865t.365-.865q.364-.364.864-.364t.865.364q.365.365.365.865t-.365.865q-.365.364-.865.364ZM10.021 10Zm-.854 6.583h1.666l.25-2.187q.605-.167 1.136-.49.531-.323 1.031-.802l2.021.875.854-1.375-1.792-1.354q.105-.333.136-.635.031-.303.031-.615 0-.292-.031-.573-.031-.281-.115-.635l1.792-1.396-.834-1.375-2.062.875q-.438-.438-1.021-.781-.583-.344-1.125-.49l-.271-2.208H9.167l-.271 2.208q-.584.146-1.125.458-.542.313-1.042.792l-2.021-.854-.833 1.375 1.75 1.354q-.083.333-.125.646-.042.312-.042.604t.042.594q.042.302.125.635l-1.75 1.375.833 1.375 2.021-.854q.479.458 1.021.771.542.312 1.146.479Z"/></svg>';

// const adjustIcon =
//   '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 14.5q1.05 0 1.775-.725.725-.725.725-1.775 0-1.05-.725-1.775Q13.05 9.5 12 9.5q-1.05 0-1.775.725Q9.5 10.95 9.5 12q0 1.05.725 1.775.725.725 1.775.725Zm0 7q-1.975 0-3.712-.75Q6.55 20 5.275 18.725T3.25 15.712Q2.5 13.975 2.5 12t.75-3.713Q4 6.55 5.275 5.275T8.288 3.25Q10.025 2.5 12 2.5t3.713.75q1.737.75 3.012 2.025t2.025 3.012q.75 1.738.75 3.713t-.75 3.712q-.75 1.738-2.025 3.013t-3.012 2.025q-1.738.75-3.713.75Zm0-1.5q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"/></svg>';

const startIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm10 6c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"></path></svg>';

const stepIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>';

const doneIcon =
  '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" tabindex="-1"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>';

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
  tag: 'verdocs-template-recipients',
  styleUrl: 'verdocs-template-recipients.scss',
  shadow: false,
})
export class VerdocsTemplateRecipients {
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
  @State() sender: TemplateSenderTypes = TemplateSenderTypes.CREATOR;
  @State() showingSenderDialog = false;

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

  componentDidRender() {
    interact.dynamicDrop(true);
    interact('.recipient').draggable({
      listeners: {
        start(event) {
          console.log('drag start', event.type, event.target);
        },
        move(event) {
          const oldX = +(event.target.getAttribute('posX') || 0);
          const oldY = +(event.target.getAttribute('posY') || 0);
          const newX = event.dx + oldX;
          const newY = event.dy + oldY;
          event.target.setAttribute('posX', newX);
          event.target.setAttribute('posy', newY);
          event.target.style.transform = `translate(${newX}px, ${newY}px)`;
        },
        end(event) {
          console.log('end', event);
          event.target.setAttribute('posX', 0);
          event.target.setAttribute('posy', 0);
          event.target.style.transform = `translate(0px, 0px)`;
        },
      },
    });

    interact('.dropzone').dropzone({
      overlap: 0.05,
      ondrop: event => {
        console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
      },
      ondropactivate: e => {
        console.log('drop activated');
        e.target.classList.add('visible');
      },
      ondropdeactivate: e => {
        e.target.classList.remove('visible');
      },
      ondragenter: e => {
        console.log('drag enter', e);
        e.target.classList.add('active');
      },
      ondragleave: e => {
        console.log('drag leave', e);
        e.target.classList.remove('active');
      },
    });
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
        <h5>Participant Order</h5>

        <div class="participants">
          <div class="left-line" />
          <div class="row">
            <div class="icon" innerHTML={startIcon} />
            <div class="sender">
              <span class="label">Sender:</span> {senderLabels[this.sender]}{' '}
              <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
            </div>
          </div>

          <div class="row">
            <div class="icon" innerHTML={stepIcon} />
            <div class="dropzone" />
            <div class="recipient recipient-1" style={{backgroundColor: getRGBA(0)}}>
              Recipient 1 <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
            </div>
            <div class="dropzone" />
            <div class="recipient recipient-2" style={{backgroundColor: getRGBA(1)}}>
              Recipient 2 <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
            </div>
            <div class="dropzone" />
          </div>

          <div class="row">
            <div class="icon" innerHTML={stepIcon} />
            <div class="dropzone" />
            <div class="recipient recipient-3" style={{backgroundColor: getRGBA(2)}}>
              Recipient 2 <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
            </div>
            <div class="dropzone" />
            <div class="recipient recipient-4" style={{backgroundColor: getRGBA(3)}}>
              Recipient 2 <div class="settings-button" innerHTML={settingsIcon} onClick={() => (this.showingSenderDialog = true)} aria-role="button" />
            </div>
            <div class="dropzone" />
          </div>

          <div class="row">
            <div class="icon" innerHTML={doneIcon} />
            <div class="complete">Verdoc Complete</div>
          </div>
        </div>

        <div class="buttons">
          <div class="flex-fill" />

          <verdocs-button variant="outline" label="Cancel" size="small" onPress={e => this.handleCancel(e)} />
          <verdocs-button label="OK" size="small" onPress={e => this.handleSubmit(e)} />
        </div>

        {/* We do it this way instead of setting open so the widget resets each time it's displayed, in case the user opens/changes/cancels */}
        {this.showingSenderDialog && (
          <verdocs-template-sender-dialog
            open={true}
            value={this.sender}
            onCancel={() => (this.showingSenderDialog = false)}
            onDone={e => {
              this.showingSenderDialog = false;
              this.sender = e.detail.sender;
            }}
          />
        )}
      </form>
    );
  }
}
