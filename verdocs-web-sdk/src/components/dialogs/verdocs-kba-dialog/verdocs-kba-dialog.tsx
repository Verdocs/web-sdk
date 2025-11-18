import IMask from 'imask';
import {IRecipient} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Fragment, State} from '@stencil/core';

const States = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

const STATE_OPTIONS = Object.entries(States).map(([abbr, name]) => ({value: abbr, label: name}));

const QuestionIcon = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.95313 0 0 8.95313 0 20C0 31.0469 8.95313 40 20 40C31.0469 40 40 31.0469 40 20C40 8.95313 31.0469 0 20 0ZM20 36.25C11.0391 36.25 3.75 28.9602 3.75 20C3.75 11.0398 11.0391 3.75 20 3.75C28.9609 3.75 36.25 11.0398 36.25 20C36.25 28.9602 28.9609 36.25 20 36.25Z" fill="white"/><path d="M20 26.25C18.5938 26.25 17.5 27.3438 17.5 28.75C17.5 30.1562 18.5234 31.25 20 31.25C21.3359 31.25 22.5 30.1562 22.5 28.75C22.5 27.3438 21.3359 26.25 20 26.25ZM22.5859 10H18.5938C15.5469 10 13.125 12.4219 13.125 15.4688C13.125 16.4844 13.9844 17.3438 15 17.3438C16.0156 17.3438 16.875 16.4844 16.875 15.4688C16.875 14.5312 17.5859 13.75 18.5234 13.75H22.5156C23.5234 13.75 24.375 14.5312 24.375 15.4688C24.375 16.0938 24.0625 16.5703 23.5156 16.8828L19.0625 19.6094C18.4375 20 18.125 20.625 18.125 21.25V22.5C18.125 23.5156 18.9844 24.375 20 24.375C21.0156 24.375 21.875 23.5156 21.875 22.5V22.3438L25.3984 20.1562C27.0391 19.1406 28.0547 17.3438 28.0547 15.4688C28.125 12.4219 25.7031 10 22.5859 10Z" fill="#E7E7E7"/></svg>`;

/**
 * Prompt the user to confirm their identity with a PIN or a series of questions.
 */
@Component({
  tag: 'verdocs-kba-dialog',
  styleUrl: 'verdocs-kba-dialog.scss',
})
export class VerdocsKbaDialog {
  // private picker: AirDatepicker<HTMLElement> | null = null;

  /**
   * Which step this confirmation is for, in a multi-step process. Ignored if `steps` is < 2.
   */
  @Prop() step: number = 1;

  /**
   * How many steps exist in a multi-step process. Set to 1 for a single-step process (hides the indicator).
   */
  @Prop() steps: number = 3;

  /**
   * If set, a help/instructions box will be displayed with this title
   */
  @Prop() helptitle: string = 'Previous Addresses';

  /**
   * If set, a help/instructions box will be displayed with this text
   */
  @Prop() helptext: string = 'Please select the address below that you have most recently lived at.';

  /**
   * The type of dialog to display. Three modes are supported.
   */
  @Prop() mode: 'text' | 'choice' | 'identity' = 'choice';

  /**
   * For text input challenges, the label to display next to the input field.
   */
  @Prop() label: string = 'PIN';

  /**
   * For text input challenges, the placeholder to display inside the input field.
   */
  @Prop() placeholder: string = 'Enter your PIN...';

  /**
   * For identity confirmation, the current recipient details.
   */
  @Prop() recipient: IRecipient | null = null;

  /**
   * For choice challenges, a set of choices to choose from. 6 choices is recommended to fit most screen sizes.
   */
  @Prop() choices: string[] = ['553 Arbor Dr', '18 Lacey Ln', '23A Ball Ct', '2375 Cavallo Blvd', '23-1 RR-7', '151 Boulder Rd'];

  /**
   * Event fired when the step is cancelled. This is called exit to avoid conflicts with the JS-reserved "cancel" event name.
   */
  @Event({composed: true}) exit: EventEmitter;

  /**
   * Event fired when the dialog is closed. The event data will contain the value selected,
   * or the new recipient details if the mode is 'identity'.
   */
  @Event({composed: true}) pinEntered: EventEmitter<string | IRecipient>;

  /**
   * Event fired when the dialog is closed. The event data will contain the value selected,
   * or the new recipient details if the mode is 'identity'.
   */
  @Event({composed: true}) next: EventEmitter<string | IRecipient | string[]>;

  @State() agreed = false;
  @State() response = '';
  @State() updatedRecipient: IRecipient = null;
  @State() dobContainerId = `verdocs-date-input-${Math.random().toString(36).substring(2, 11)}`;

  componentWillLoad() {
    this.updatedRecipient = {...(this.recipient || {})} as IRecipient;
  }

  // NOTE: This gets called again on every input, maybe do it on willUpdate?
  componentDidRender() {
    // TODO: Review min/max settings
    IMask(document.getElementById(this.dobContainerId), {
      mask: Date,
      min: new Date(1920, 0, 1),
      max: new Date(Date.now() - 86400 * 18 * 365 * 1000), // 18 years old
      lazy: false,
      pattern: 'm/d/Y',
      // See https://github.com/uNmAnNeR/imaskjs/issues/739
      format: function (date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return [month, day, year].join('/');
      },
      // define str -> date convertion
      parse: function (str) {
        const yearMonthDay = str.split('/');
        return new Date(yearMonthDay[2], yearMonthDay[0] - 1, yearMonthDay[1]);
      },
    });
  }

  handleCancel() {
    this.exit.emit();
  }

  // We need a separate event handler for clicking the background because it can receive events "through" other child components
  handleDismiss(e: any) {
    if (e.target.class === 'background-overlay') {
      e.preventDefault();
      this.handleCancel();
    }
  }

  handleDone() {
    this.next.emit(this.response);
    this.response = '';
  }

  handleConfirmID() {
    console.log('Confirm ID', this.updatedRecipient);
    this.next.emit(this.updatedRecipient);
  }

  render() {
    if (this.mode === 'choice') {
      return (
        <verdocs-dialog>
          <div slot="heading" class="heading">
            <div class="icon">
              <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_34208_4881)">
                  <path
                    d="M3.125 0.75C1.88398 0.75 0.875 1.75898 0.875 3V16.5C0.875 17.741 1.88398 18.75 3.125 18.75H12.125C13.366 18.75 14.375 17.741 14.375 16.5V15.8215C14.2801 15.8602 14.1852 15.8918 14.0867 15.9164L11.9738 16.4437C11.8684 16.4684 11.7629 16.4859 11.6574 16.493C11.6258 16.4965 11.5941 16.5 11.5625 16.5H9.3125C9.09805 16.5 8.90469 16.3805 8.80977 16.1906L8.50039 15.5684C8.44062 15.4488 8.32109 15.375 8.19102 15.375C8.06094 15.375 7.93789 15.4488 7.88164 15.5684L7.57227 16.1906C7.47031 16.398 7.24883 16.5211 7.02031 16.5C6.7918 16.4789 6.59492 16.3207 6.53164 16.1027L5.9375 14.1445L5.59297 15.2977C5.37852 16.0113 4.72109 16.5 3.97578 16.5H3.6875C3.37812 16.5 3.125 16.2469 3.125 15.9375C3.125 15.6281 3.37812 15.375 3.6875 15.375H3.97578C4.22539 15.375 4.44336 15.2133 4.51367 14.9742L5.0375 13.234C5.15703 12.8367 5.52266 12.5625 5.9375 12.5625C6.35234 12.5625 6.71797 12.8367 6.8375 13.234L7.24531 14.591C7.50547 14.373 7.83594 14.25 8.1875 14.25C8.74648 14.25 9.25625 14.5664 9.50586 15.0656L9.66055 15.375H9.97344C9.86445 15.0656 9.84336 14.7281 9.92422 14.3977L10.4516 12.2848C10.55 11.8875 10.7539 11.5289 11.0422 11.2406L14.375 7.90781V6.375H9.875C9.25273 6.375 8.75 5.87227 8.75 5.25V0.75H3.125ZM9.875 0.75V5.25H14.375L9.875 0.75ZM20.2039 5.66133C19.6555 5.11289 18.766 5.11289 18.2141 5.66133L17.1805 6.69492L19.6766 9.19102L20.7102 8.15742C21.2586 7.60898 21.2586 6.71953 20.7102 6.16758L20.2039 5.66133ZM11.8402 12.0352C11.6961 12.1793 11.5941 12.3586 11.5449 12.559L11.0176 14.6719C10.9684 14.8652 11.0246 15.0656 11.1652 15.2063C11.3059 15.3469 11.5062 15.4031 11.6996 15.3539L13.8125 14.8266C14.0094 14.7773 14.1922 14.6754 14.3363 14.5312L18.8785 9.98555L16.3824 7.48945L11.8402 12.0352Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_34208_4881">
                    <path d="M0.875 0.75H21.125V18.75H0.875V0.75Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div class="title">
              Please Confirm Your Identity
              {this.steps > 1 ? (
                <span class="step">
                  ({this.step}/{this.steps})
                </span>
              ) : (
                <Fragment />
              )}
            </div>
          </div>

          <div slot="content" class="content">
            {!!this.helptitle && (
              <div class="help-box">
                <div class="help-icon" innerHTML={QuestionIcon} />
                <div class="help-details">
                  <div class="help-title">{this.helptitle}</div>
                  <div class="help-text">{this.helptext}</div>
                </div>
              </div>
            )}

            <div class="choices">
              {this.choices.map(choice => (
                <div
                  class={`choice ${choice === this.response ? 'selected' : ''}`}
                  onClick={() => {
                    console.log('Selected', choice);
                    this.response = choice;
                  }}
                >
                  {choice}
                </div>
              ))}
            </div>
          </div>

          <div class="footer" slot="footer">
            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label={this.step < this.steps ? 'Next' : 'Submit'} onClick={() => this.handleDone()} disabled={!this.response} />
            </div>
          </div>
        </verdocs-dialog>
      );
    }

    if (this.mode === 'identity') {
      return (
        <verdocs-dialog>
          <div slot="heading" class="heading">
            <div class="icon">
              <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_34208_4881)">
                  <path
                    d="M3.125 0.75C1.88398 0.75 0.875 1.75898 0.875 3V16.5C0.875 17.741 1.88398 18.75 3.125 18.75H12.125C13.366 18.75 14.375 17.741 14.375 16.5V15.8215C14.2801 15.8602 14.1852 15.8918 14.0867 15.9164L11.9738 16.4437C11.8684 16.4684 11.7629 16.4859 11.6574 16.493C11.6258 16.4965 11.5941 16.5 11.5625 16.5H9.3125C9.09805 16.5 8.90469 16.3805 8.80977 16.1906L8.50039 15.5684C8.44062 15.4488 8.32109 15.375 8.19102 15.375C8.06094 15.375 7.93789 15.4488 7.88164 15.5684L7.57227 16.1906C7.47031 16.398 7.24883 16.5211 7.02031 16.5C6.7918 16.4789 6.59492 16.3207 6.53164 16.1027L5.9375 14.1445L5.59297 15.2977C5.37852 16.0113 4.72109 16.5 3.97578 16.5H3.6875C3.37812 16.5 3.125 16.2469 3.125 15.9375C3.125 15.6281 3.37812 15.375 3.6875 15.375H3.97578C4.22539 15.375 4.44336 15.2133 4.51367 14.9742L5.0375 13.234C5.15703 12.8367 5.52266 12.5625 5.9375 12.5625C6.35234 12.5625 6.71797 12.8367 6.8375 13.234L7.24531 14.591C7.50547 14.373 7.83594 14.25 8.1875 14.25C8.74648 14.25 9.25625 14.5664 9.50586 15.0656L9.66055 15.375H9.97344C9.86445 15.0656 9.84336 14.7281 9.92422 14.3977L10.4516 12.2848C10.55 11.8875 10.7539 11.5289 11.0422 11.2406L14.375 7.90781V6.375H9.875C9.25273 6.375 8.75 5.87227 8.75 5.25V0.75H3.125ZM9.875 0.75V5.25H14.375L9.875 0.75ZM20.2039 5.66133C19.6555 5.11289 18.766 5.11289 18.2141 5.66133L17.1805 6.69492L19.6766 9.19102L20.7102 8.15742C21.2586 7.60898 21.2586 6.71953 20.7102 6.16758L20.2039 5.66133ZM11.8402 12.0352C11.6961 12.1793 11.5941 12.3586 11.5449 12.559L11.0176 14.6719C10.9684 14.8652 11.0246 15.0656 11.1652 15.2063C11.3059 15.3469 11.5062 15.4031 11.6996 15.3539L13.8125 14.8266C14.0094 14.7773 14.1922 14.6754 14.3363 14.5312L18.8785 9.98555L16.3824 7.48945L11.8402 12.0352Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_34208_4881">
                    <path d="M0.875 0.75H21.125V18.75H0.875V0.75Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div class="title">
              Please Confirm Your Identity
              {this.steps > 1 ? (
                <span class="step">
                  ({this.step}/{this.steps})
                </span>
              ) : (
                <Fragment />
              )}
            </div>
          </div>

          <div class="heading">
            Please Confirm Your Identity
            {this.steps > 1 ? (
              <span class="step">
                ({this.step}/{this.steps})
              </span>
            ) : (
              <Fragment />
            )}
          </div>

          <div slot="content" class="content">
            <div class="field">
              <label htmlFor="verdocs-kba-first">
                Your Name:<span class="required">*</span>
              </label>

              <verdocs-text-input
                placeholder="First name..."
                value={this.updatedRecipient?.first_name}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, first_name: e.target.value})}
                onClick={e => e.stopPropagation()}
              />

              <verdocs-text-input
                placeholder="Last name..."
                value={this.updatedRecipient?.last_name}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, last_name: e.target.value})}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div class="field">
              <label htmlFor="verdocs-kba-address">
                Address:<span class="required">*</span>
              </label>

              <verdocs-text-input
                placeholder="Address..."
                value={this.updatedRecipient?.address}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, address: e.target.value})}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div class="field">
              <label htmlFor="verdocs-kba-city">City:</label>

              <verdocs-text-input
                placeholder="City..."
                value={this.updatedRecipient?.city}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, city: e.target.value})}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div class="field">
              <label htmlFor="verdocs-kba-state">State:</label>
              <verdocs-select-input
                options={STATE_OPTIONS}
                value={this.updatedRecipient?.state}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, state: e.target.value})}
              />
            </div>

            <div class="field">
              <label htmlFor="verdocs-kba-zip">
                Zip Code:<span class="required">*</span>
              </label>

              <verdocs-text-input
                required
                placeholder="Zip Code..."
                value={this.updatedRecipient?.zip}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, zip: e.target.value})}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div class="field">
              <label htmlFor="verdocs-kba-ssn">
                SSN Last 4:<span class="required">*</span>
              </label>

              <verdocs-text-input
                placeholder="Last 4 digits of your Social Security Number..."
                required
                value={this.updatedRecipient?.ssn_last_4}
                onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, ssn_last_4: e.target.value})}
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div class="field">
              <label htmlFor={this.dobContainerId}>
                Date of Birth:<span class="required">*</span>
              </label>

              {/* TODO: Provide an IMask operation for verdocs-text-input */}
              <input
                type="text"
                class="date-input"
                value={this.updatedRecipient?.dob || ''}
                id={this.dobContainerId}
                placeholder="DOB..."
                onInput={(e: any) => {
                  e.stopPropagation(); // Mostly for Storybook
                }}
                onBlur={(e: any) => {
                  this.updatedRecipient = {...this.updatedRecipient, dob: e.target.value};
                }}
              />
            </div>

            <div class="field agree">
              <label></label>
              <verdocs-checkbox id="verdocs-kba-agree" name="verdocs-kba-agree" checked={this.agreed} onInput={(e: any) => (this.agreed = e.target.checked)} />
              <span>I agree to provide my personal information in order to validate my identity.</span>
            </div>
          </div>

          <div class="footer" slot="footer">
            <div class="buttons">
              <verdocs-button
                label="Submit"
                onClick={() => this.handleConfirmID()}
                disabled={
                  !this.agreed ||
                  !this.updatedRecipient?.first_name ||
                  !this.updatedRecipient?.last_name ||
                  !this.updatedRecipient?.address ||
                  !this.updatedRecipient?.zip ||
                  !this.updatedRecipient?.ssn_last_4 ||
                  !this.updatedRecipient?.dob
                }
              />
            </div>
          </div>
        </verdocs-dialog>
      );
    }

    // mode='text'
    return (
      <verdocs-dialog>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div slot="heading" class="heading">
            <div class="icon">
              <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_34208_4881)">
                  <path
                    d="M3.125 0.75C1.88398 0.75 0.875 1.75898 0.875 3V16.5C0.875 17.741 1.88398 18.75 3.125 18.75H12.125C13.366 18.75 14.375 17.741 14.375 16.5V15.8215C14.2801 15.8602 14.1852 15.8918 14.0867 15.9164L11.9738 16.4437C11.8684 16.4684 11.7629 16.4859 11.6574 16.493C11.6258 16.4965 11.5941 16.5 11.5625 16.5H9.3125C9.09805 16.5 8.90469 16.3805 8.80977 16.1906L8.50039 15.5684C8.44062 15.4488 8.32109 15.375 8.19102 15.375C8.06094 15.375 7.93789 15.4488 7.88164 15.5684L7.57227 16.1906C7.47031 16.398 7.24883 16.5211 7.02031 16.5C6.7918 16.4789 6.59492 16.3207 6.53164 16.1027L5.9375 14.1445L5.59297 15.2977C5.37852 16.0113 4.72109 16.5 3.97578 16.5H3.6875C3.37812 16.5 3.125 16.2469 3.125 15.9375C3.125 15.6281 3.37812 15.375 3.6875 15.375H3.97578C4.22539 15.375 4.44336 15.2133 4.51367 14.9742L5.0375 13.234C5.15703 12.8367 5.52266 12.5625 5.9375 12.5625C6.35234 12.5625 6.71797 12.8367 6.8375 13.234L7.24531 14.591C7.50547 14.373 7.83594 14.25 8.1875 14.25C8.74648 14.25 9.25625 14.5664 9.50586 15.0656L9.66055 15.375H9.97344C9.86445 15.0656 9.84336 14.7281 9.92422 14.3977L10.4516 12.2848C10.55 11.8875 10.7539 11.5289 11.0422 11.2406L14.375 7.90781V6.375H9.875C9.25273 6.375 8.75 5.87227 8.75 5.25V0.75H3.125ZM9.875 0.75V5.25H14.375L9.875 0.75ZM20.2039 5.66133C19.6555 5.11289 18.766 5.11289 18.2141 5.66133L17.1805 6.69492L19.6766 9.19102L20.7102 8.15742C21.2586 7.60898 21.2586 6.71953 20.7102 6.16758L20.2039 5.66133ZM11.8402 12.0352C11.6961 12.1793 11.5941 12.3586 11.5449 12.559L11.0176 14.6719C10.9684 14.8652 11.0246 15.0656 11.1652 15.2063C11.3059 15.3469 11.5062 15.4031 11.6996 15.3539L13.8125 14.8266C14.0094 14.7773 14.1922 14.6754 14.3363 14.5312L18.8785 9.98555L16.3824 7.48945L11.8402 12.0352Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_34208_4881">
                    <path d="M0.875 0.75H21.125V18.75H0.875V0.75Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div class="title">
              Please Confirm Your Identity
              {this.steps > 1 ? (
                <span class="step">
                  ({this.step}/{this.steps})
                </span>
              ) : (
                <Fragment />
              )}
            </div>
          </div>

          <div class="heading">
            Please Confirm Your Identity
            {this.steps > 1 ? (
              <span class="step">
                ({this.step}/{this.steps})
              </span>
            ) : (
              <Fragment />
            )}
          </div>

          <div slot="content" class="content">
            {!!this.helptitle && (
              <div class="help-box">
                <div class="help-icon" innerHTML={QuestionIcon} />
                <div class="help-details">
                  <div class="help-title">{this.helptitle}</div>
                  <div class="help-text">{this.helptext}</div>
                </div>
              </div>
            )}

            <div class="input">
              <label htmlFor="verdocs-kba-input">{this.label}</label>
              <input
                type="text"
                id="verdocs-kba-input"
                name="verdocs-kba-input"
                placeholder={this.placeholder}
                value={this.response}
                onInput={(e: any) => (this.response = e.target.value)}
              />
            </div>
          </div>

          <div class="footer" slot="footer">
            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label="Submit" onClick={() => this.handleDone()} disabled={!this.response} />
            </div>
          </div>
        </div>
      </verdocs-dialog>
    );
  }
}
