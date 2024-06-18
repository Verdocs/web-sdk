import {z} from 'zod';
import {getCurrentProfile, IProfile, updateProfile, VerdocsEndpoint} from '@verdocs/js-sdk';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {convertToE164} from '../../../utils/utils';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(30),
  last_name: z.string().trim().min(1, 'Last name is required').max(30),
  email: z.string().trim().email('Invalid email').min(1, 'Email is required'),
  phone: z.preprocess(val => convertToE164(String(val).trim()), z.string()),
});

/**
 * Displays a settings form that allows the user to manage their Verdocs profile.
 */
@Component({
  tag: 'verdocs-settings-profile',
  styleUrl: 'verdocs-settings-profile.scss',
})
export class VerdocsSettingsProfile {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  /**
   * Event fired when the user chooses the Edit option from the dropdown menu.
   */
  @Event({composed: true}) profileUpdated: EventEmitter<{endpoint: VerdocsEndpoint; profile: IProfile}>;

  @State() valid = false;
  @State() dirty = false;
  @State() submitting = false;

  @State() first_name = '';
  @State() last_name = '';
  @State() email = '';
  @State() phone = '';

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    const profile = await getCurrentProfile(this.endpoint);
    console.log('[SETTINGS] Loaded profile', profile);
    this.resetForm(profile);
  }

  resetForm(profile: IProfile) {
    this.first_name = profile.first_name;
    this.last_name = profile.last_name;
    this.email = profile.email;
    this.phone = profile.phone;
    this.dirty = false;
    this.valid = true;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    e.stopPropagation();

    updateProfile(VerdocsEndpoint.getDefault(), this.endpoint.session.profile_id, {
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
    })
      .then(newProfile => {
        console.log('[SETTINGS] Update result', newProfile);
        this.profileUpdated?.emit({endpoint: this.endpoint, profile: newProfile});
        this.resetForm(newProfile);
      })
      .catch(e => VerdocsToast(`Error updating profile: ${e.message}`, {style: 'error'}));
  }

  processFields() {
    const validation = schema.safeParse({
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
    });

    console.log('[SETTINGS] Validation result', validation);
    this.valid = validation.success;
    this.dirty = true;
  }

  render() {
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return <Host class="authentication-required">Must be authenticated</Host>;
    }

    return (
      <Host>
        <h1>My Profile</h1>

        <form onSubmit={e => this.handleSubmit(e)}>
          <div class="columns">
            <div class="column">
              <verdocs-text-input
                id="verdocs-profile-first-name"
                value={this.first_name}
                autocomplete="off"
                label="First Name"
                required={true}
                placeholder="Enter your first name..."
                onInput={(e: any) => (this.first_name = e.target.value)}
                onFocusout={(e: any) => {
                  this.first_name = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-profile-last-name"
                value={this.last_name}
                autocomplete="off"
                label="Last Name"
                required={true}
                placeholder="Enter your last name..."
                onInput={(e: any) => (this.last_name = e.target.value)}
                onFocusout={(e: any) => {
                  this.last_name = e.target.value.trim();
                  this.processFields();
                }}
              />

              {/*<PhotoSelector name="avatar" />*/}
            </div>

            <div class="column">
              <verdocs-text-input
                id="verdocs-profile-email"
                value={this.email}
                autocomplete="off"
                label="Email Address"
                required={true}
                disabled={true}
                placeholder="Enter your email address..."
                onInput={(e: any) => (this.email = e.target.value)}
                onFocusout={(e: any) => {
                  this.email = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-profile-phone"
                value={this.phone}
                clearable={true}
                autocomplete="off"
                label="Phone Number"
                placeholder="Enter your phone number..."
                onInput={(e: any) => (this.phone = e.target.value)}
                onFocusout={(e: any) => {
                  this.phone = e.target.value.trim();
                  this.processFields();
                }}
              />
            </div>
          </div>

          <verdocs-button type="submit" label="Save" size="normal" disabled={this.submitting || !this.dirty} />
        </form>
      </Host>
    );
  }
}
