import {z} from 'zod';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {Organizations} from '@verdocs/js-sdk/Organizations';
import {IOrganization} from '@verdocs/js-sdk/Organizations/Types';
import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {convertToE164} from '../../../utils/utils';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';
import {TimeZones} from './TimeZones';

const timeZoneOptions = TimeZones.map(tz => ({value: tz[2], label: tz[2]}));

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(30),
  business_name: z.string().trim().max(30).optional(),
  contact_email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  phone: z.preprocess(val => convertToE164(String(val).trim()), z.string().optional()),
  address: z.string().trim().max(30).optional(),
  address2: z.string().trim().max(30).optional(),
  timezone: z.string().trim().optional(),
  url: z.string().trim().optional(),
});

/**
 * Displays a settings form that allows the user to manage their Verdocs profile.
 */
@Component({
  tag: 'verdocs-settings-organization',
  styleUrl: 'verdocs-settings-organization.scss',
})
export class VerdocsSettingsOrganization {
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
  @Event({composed: true}) organizationUpdated: EventEmitter<{endpoint: VerdocsEndpoint; organization: IOrganization}>;

  @State() valid = false;
  @State() dirty = false;
  @State() submitting = false;

  @State() name = '';
  @State() business_name = '';
  @State() contact_email = '';
  @State() phone = '';
  @State() address = '';
  @State() address2 = '';
  @State() timezone = '';
  @State() url = '';

  componentWillLoad() {
    this.endpoint.loadSession();
    if (!this.endpoint.session) {
      console.log('[SETTINGS] Must be authenticated');
      return;
    }
  }

  async componentDidLoad() {
    const organization = await Organizations.getOrganization(this.endpoint, this.endpoint.session.organization_id);
    console.log('[SETTINGS] Loaded organization', organization);
    this.resetForm(organization);
  }

  resetForm(organization: IOrganization) {
    this.name = organization.name;
    this.business_name = organization.business_name;
    this.contact_email = organization.contact_email;
    this.phone = organization.phone;
    this.address = organization.address;
    this.address2 = organization.address2;
    this.timezone = organization.timezone;
    this.url = organization.url;
    this.dirty = false;
    this.valid = true;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    e.stopPropagation();

    Organizations.updateOrganization(VerdocsEndpoint.getDefault(), this.endpoint.session.organization_id, {
      name: this.name,
      business_name: this.business_name,
      contact_email: this.contact_email,
      phone: this.phone,
      address: this.address,
      address2: this.address2,
      timezone: this.timezone,
      url: this.url,
    })
      .then(newOrganization => {
        console.log('[SETTINGS] Update result', newOrganization);
        this.organizationUpdated?.emit({endpoint: this.endpoint, organization: newOrganization});
        this.resetForm(newOrganization);
      })
      .catch(e => VerdocsToast(`Error updating organization: ${e.message}`, {style: 'error'}));
  }

  processFields() {
    const validation = schema.safeParse({
      name: this.name,
      business_name: this.business_name,
      contact_email: this.contact_email,
      phone: this.phone,
      address: this.address,
      address2: this.address2,
      timezone: this.timezone,
      url: this.url,
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
        <h1>Organization Profile</h1>

        <form onSubmit={e => this.handleSubmit(e)}>
          <div class="columns">
            <div class="column">
              <verdocs-text-input
                id="verdocs-organization-name"
                value={this.name}
                autocomplete="off"
                label="Name"
                required={true}
                placeholder="Enter your organization's name..."
                onInput={(e: any) => (this.name = e.target.value)}
                onFocusout={(e: any) => {
                  this.name = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-business-name"
                value={this.business_name}
                autocomplete="off"
                label="d/b/a"
                placeholder="Enter your d/b/a, if any..."
                onInput={(e: any) => (this.business_name = e.target.value)}
                onFocusout={(e: any) => {
                  this.business_name = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-url"
                value={this.url}
                autocomplete="off"
                label="Web URL"
                placeholder="Enter your Web URL..."
                onInput={(e: any) => (this.url = e.target.value)}
                onFocusout={(e: any) => {
                  this.url = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-phone"
                value={this.phone}
                autocomplete="off"
                label="Phone Number"
                placeholder="Enter your phone number..."
                onInput={(e: any) => (this.phone = e.target.value)}
                onFocusout={(e: any) => {
                  this.phone = e.target.value.trim();
                  this.processFields();
                }}
              />

              {/*<PhotoSelector name="avatar" />*/}
            </div>

            <div class="column">
              <verdocs-text-input
                id="verdocs-organization-address"
                value={this.address}
                autocomplete="off"
                label="Address"
                required={true}
                placeholder="Enter your address..."
                onInput={(e: any) => (this.address = e.target.value)}
                onFocusout={(e: any) => {
                  this.address = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-address"
                value={this.address2}
                autocomplete="off"
                label="Address 2"
                required={true}
                placeholder="Address line 2..."
                onInput={(e: any) => (this.address2 = e.target.value)}
                onFocusout={(e: any) => {
                  this.address2 = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-address2"
                value={this.address2}
                clearable={true}
                autocomplete="off"
                label="Address 2"
                placeholder="Enter your address..."
                onInput={(e: any) => (this.address2 = e.target.value)}
                onFocusout={(e: any) => {
                  this.address2 = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-text-input
                id="verdocs-organization-email"
                value={this.contact_email}
                clearable={true}
                autocomplete="off"
                label="Contact Email"
                placeholder="Enter your contact email address..."
                onInput={(e: any) => (this.contact_email = e.target.value)}
                onFocusout={(e: any) => {
                  this.contact_email = e.target.value.trim();
                  this.processFields();
                }}
              />

              <verdocs-select-input options={timeZoneOptions} value={this.timezone} label="Time Zone" />
            </div>
          </div>

          <verdocs-button type="submit" label="Save" size="normal" disabled={this.submitting || !this.dirty} />
        </form>
      </Host>
    );
  }
}
