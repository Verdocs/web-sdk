import IMask from 'imask';
import {IRecipient} from '@verdocs/js-sdk';
import {Component, Prop, h, Event, EventEmitter, Fragment, Host, State} from '@stencil/core';

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

const QuestionIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.95313 0 0 8.95313 0 20C0 31.0469 8.95313 40 20 40C31.0469 40 40 31.0469 40 20C40 8.95313 31.0469 0 20 0ZM20 36.25C11.0391 36.25 3.75 28.9602 3.75 20C3.75 11.0398 11.0391 3.75 20 3.75C28.9609 3.75 36.25 11.0398 36.25 20C36.25 28.9602 28.9609 36.25 20 36.25Z" fill="white"/><path d="M20 26.25C18.5938 26.25 17.5 27.3438 17.5 28.75C17.5 30.1562 18.5234 31.25 20 31.25C21.3359 31.25 22.5 30.1562 22.5 28.75C22.5 27.3438 21.3359 26.25 20 26.25ZM22.5859 10H18.5938C15.5469 10 13.125 12.4219 13.125 15.4688C13.125 16.4844 13.9844 17.3438 15 17.3438C16.0156 17.3438 16.875 16.4844 16.875 15.4688C16.875 14.5312 17.5859 13.75 18.5234 13.75H22.5156C23.5234 13.75 24.375 14.5312 24.375 15.4688C24.375 16.0938 24.0625 16.5703 23.5156 16.8828L19.0625 19.6094C18.4375 20 18.125 20.625 18.125 21.25V22.5C18.125 23.5156 18.9844 24.375 20 24.375C21.0156 24.375 21.875 23.5156 21.875 22.5V22.3438L25.3984 20.1562C27.0391 19.1406 28.0547 17.3438 28.0547 15.4688C28.125 12.4219 25.7031 10 22.5859 10Z" fill="#E7E7E7"/></svg>`;

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
      max: new Date(2007, 12, 31), // 18 years old
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
        var yearMonthDay = str.split('/');
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
        <Host>
          <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
            <div class="dialog">
              <div class="heading">
                Confirm Your Identity
                {this.steps > 1 ? (
                  <span class="step">
                    ({this.step}/{this.steps})
                  </span>
                ) : (
                  <Fragment />
                )}
              </div>

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

              <div class="buttons">
                <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
                <verdocs-button label={this.step < this.steps ? 'Next' : 'Submit'} onClick={() => this.handleDone()} disabled={!this.response} />
              </div>
            </div>
          </div>
        </Host>
      );
    }

    if (this.mode === 'identity') {
      return (
        <Host>
          <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
            <div class="dialog">
              <div class="heading">Confirm Your Identity</div>

              {/*{!!this.helptitle && (*/}
              {/*  <div class="help-box">*/}
              {/*    <div class="help-icon" innerHTML={QuestionIcon} />*/}
              {/*    <div class="help-details">*/}
              {/*      <div class="help-title">Identity verification is required</div>*/}
              {/*      <div class="help-text">NOTE: Only four fields are required, but providing more details will allow us to complete the verification process more quickly.</div>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*)}*/}

              <div class="field">
                <label htmlFor="verdocs-kba-first">
                  Your Name:<span class="required">*</span>
                </label>
                <input
                  required
                  type="text"
                  id="verdocs-kba-first"
                  name="verdocs-kba-first"
                  placeholder="First name..."
                  value={this.updatedRecipient?.first_name}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, first_name: e.target.value})}
                />

                <input
                  type="text"
                  id="verdocs-kba-last"
                  name="verdocs-kba-last"
                  placeholder="Last name..."
                  required
                  value={this.updatedRecipient?.last_name}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, last_name: e.target.value})}
                />
              </div>

              <div class="field">
                <label htmlFor="verdocs-kba-address">
                  Address:<span class="required">*</span>
                </label>
                <input
                  type="text"
                  id="verdocs-kba-address"
                  name="verdocs-kba-address"
                  placeholder="Address..."
                  value={this.updatedRecipient?.address}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, address: e.target.value})}
                />
              </div>

              <div class="field">
                <label htmlFor="verdocs-kba-city">City:</label>
                <input
                  type="text"
                  id="verdocs-kba-city"
                  name="verdocs-kba-city"
                  placeholder="City..."
                  value={this.updatedRecipient?.city}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, city: e.target.value})}
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
                <input
                  type="text"
                  id="verdocs-kba-zip"
                  name="verdocs-kba-zip"
                  placeholder="Zip Code..."
                  required
                  value={this.updatedRecipient?.zip}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, zip: e.target.value})}
                />
              </div>

              <div class="field">
                <label htmlFor="verdocs-kba-ssn">
                  SSN Last 4:<span class="required">*</span>
                </label>
                <input
                  type="text"
                  id="verdocs-kba-ssn"
                  name="verdocs-kba-ssn"
                  placeholder="Last 4 digits of your Social Security Number..."
                  required
                  value={this.updatedRecipient?.ssn_last_4}
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, ssn_last_4: e.target.value})}
                />
              </div>

              <div class="field">
                <label htmlFor={this.dobContainerId}>
                  Date of Birth:<span class="required">*</span>
                </label>
                <input
                  type="text"
                  value={this.updatedRecipient?.dob || ''}
                  id={this.dobContainerId}
                  placeholder="DOB..."
                  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, dob: e.target.value})}
                />
              </div>

              <div class="field">
                <label></label>
                <verdocs-checkbox
                  id="verdocs-kba-agree"
                  name="verdocs-kba-agree"
                  checked={this.agreed}
                  onInput={(e: any) => (this.agreed = e.target.checked)}
                  // label="I agree to provide my personal information in order to validate my identity. Identity verification powered by IDology."
                />
                <span>I agree to provide my personal information in order to validate my identity.</span>
                {/*<input*/}
                {/*  type="text"*/}
                {/*  value={this.updatedRecipient?.dob || ''}*/}
                {/*  id={this.dobContainerId}*/}
                {/*  placeholder="DOB..."*/}
                {/*  onInput={(e: any) => (this.updatedRecipient = {...this.updatedRecipient, dob: e.target.value})}*/}
                {/*/>*/}
              </div>

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
          </div>
        </Host>
      );
    }

    // mode='text'
    return (
      <Host>
        <div class="background-overlay" onClick={e => this.handleDismiss(e)}>
          <div class="dialog">
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

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" onClick={() => this.handleCancel()} />
              <verdocs-button label="Submit" onClick={() => this.handleDone()} disabled={!this.response} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
