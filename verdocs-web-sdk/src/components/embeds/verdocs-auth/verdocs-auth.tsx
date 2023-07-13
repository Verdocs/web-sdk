import {Auth} from '@verdocs/js-sdk/Users';
import {VerdocsEndpoint} from '@verdocs/js-sdk';
import {TSession} from '@verdocs/js-sdk/Sessions/Types';
import {Organizations} from '@verdocs/js-sdk/Organizations';
import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const Industries = [
  {value: '', label: ''},
  {value: 'Accounting & Tax', label: 'Accounting & Tax'},
  {value: 'Business Services / Consulting', label: 'Business Services / Consulting'},
  {value: 'Construction', label: 'Construction'},
  {value: 'Education', label: 'Education'},
  {value: 'Financial Services', label: 'Financial Services'},
  {value: 'Government', label: 'Government'},
  {value: 'Healthcare - Health Plans & Payers', label: 'Healthcare - Health Plans & Payers'},
  {value: 'Healthcare - Providers', label: 'Healthcare - Providers'},
  {value: 'Insurance', label: 'Insurance'},
  {value: 'Legal', label: 'Legal'},
  {value: 'Life Sciences', label: 'Life Sciences'},
  {value: 'Manufacturing', label: 'Manufacturing'},
  {value: 'Mortgage', label: 'Mortgage'},
  {value: 'Not For Profit', label: 'Not For Profit'},
  {value: 'Real Estate - Commercial', label: 'Real Estate - Commercial'},
  {value: 'Real Estate - Residential', label: 'Real Estate - Residential'},
  {value: 'Retail', label: 'Retail'},
  {value: 'Technology', label: 'Technology'},
  {value: 'Other', label: 'Other'},
];

const Reasons = [
  {value: '', label: ''},
  {value: 'I want to send a document for signature.', label: 'I want to send a document for signature.'},
  {value: 'I just need to sign a document today.', label: 'I just need to sign a document today.'},
  {value: "I'm evaluating it for my business.", label: "I'm evaluating it for my business."},
  {value: "I'm evaluating it for my personal use.", label: "I'm evaluating it for my personal use."},
  {value: "I'm a developer building an integration.", label: "I'm a developer building an integration."},
];

const CompanySizes = [
  {value: '', label: ''},
  {value: 'Solo', label: 'Solo'},
  {value: '2-10', label: '2-10'},
  {value: '11-50', label: '11-50'},
  {value: '51-200', label: '51-200'},
  {value: '201-500', label: '201-500'},
  {value: '501-1000', label: '501-1000'},
  {value: '1000+', label: '1000+'},
];

export interface IAuthStatus {
  authenticated: boolean;
  session: TSession;
}

/**
 * Display an authentication dialog that allows the user to login or sign up. Callbacks are provided for events that
 * occur during the process (especially successful completion). If the user is already authenticated with a valid
 * session, this component will hide itself and fire the success callback immediately. It is up to the host application
 * to render the next appropriate view for the application.
 *
 * To simplify some types of authentication flows, a visibility flag can force this component to never display. This
 * allows you to susbcribe to notifications from the
 *
 * This embed is responsive / mobile-friendly, but the calling application should provide at least a 300px wide
 * container to allow sufficient space for the required forms.
 *
 * As noted below, the primary event is `authenticated`. This will always be fired at least once, immediately after
 * the widget is rendered and the user's status has been checked. It may be fired again as the user completes (or
 * cancels) authentication steps.
 *
 * Authentication is required to demonstrate this Element. You may do this in Storybook by using the Auth
 * embed. This Element will reuse the same session produced by logging in via that Embed.
 *
 * ```typescript
 * interface IAuthStatus {
 *   // If true, the user is authenticated with a valid session
 *   authenticated: boolean;
 *
 *   // Details for the user's session
 *   session: IActiveSession | null;
 * }
 * ```
 */
@Component({
  tag: 'verdocs-auth',
  styleUrl: 'verdocs-auth.scss',
  shadow: false,
})
export class VerdocsAuth {
  /**
   * The endpoint to use to communicate with Verdocs. If not set, the default endpoint will be used.
   */
  @Prop() endpoint: VerdocsEndpoint = VerdocsEndpoint.getDefault();

  /**
   * Normally, if the user has a valid session, this embed will be invisible, otherwise it will display
   * login / signup forms. If this is set to false, this embed will be invisible in both cases. Apps may
   * use this to verify if a user has a valid session without needing a separate call to Verdocs JS SDK.
   */
  @Prop() visible: boolean = true;

  /**
   * By default, a Verdocs logo will be displayed above the login/signup forms. This may be used to
   * override its source. (Alternatively, you may simply hide it via CSS overrides.) Logos should be
   * in SVG format for best results.
   */
  @Prop() logo: string = 'https://verdocs.com/assets/blue-logo.svg';

  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status.
   */
  @Event({composed: true}) authenticated: EventEmitter<IAuthStatus>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() isAuthenticated: boolean = false;
  @State() displayMode: string = 'login';
  @State() orgname: string = '';
  @State() orgAvailable: '' | 'TAKEN' | 'OK' = '';
  @State() first: string = '';
  @State() last: string = '';
  @State() username: string = '';
  @State() phone: string = '';
  @State() password: string = '';
  @State() loggingIn: boolean = false;
  @State() activeSession: TSession = null;
  @State() accountType: 'personal' | 'org' = 'org';
  @State() howHear: string = '';
  @State() industry: string = '';
  @State() companySize: string = '';
  @State() reason: string = '';
  @State() step = 1;

  componentWillLoad() {
    this.endpoint.loadSession();
    if (this.endpoint.session) {
      console.log('[AUTH] Authenticated');
      this.isAuthenticated = true;
      this.activeSession = this.endpoint.session;
      this.authenticated?.emit({authenticated: true, session: this.endpoint.session});
    } else {
      console.log('[AUTH] Anonymous');
      this.authenticated?.emit({authenticated: false, session: null});
    }
  }

  handleSignup() {
    this.loggingIn = true;

    Auth.authenticateUser(this.endpoint, {username: this.username, password: this.password})
      .then(r => {
        this.loggingIn = false;
        this.endpoint.setToken(r.accessToken);
        this.activeSession = this.endpoint.session;
        this.isAuthenticated = true;
        this.authenticated?.emit({authenticated: true, session: this.endpoint.session});
      })
      .catch(e => {
        console.log('[AUTH] Authentication error', e.response, JSON.stringify(e));
        this.loggingIn = false;
        this.activeSession = null;
        this.authenticated?.emit({authenticated: false, session: null});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));

        VerdocsToast('Login failed. Please check your username and password and try again.', {style: 'error'});
      });
  }

  handleLogin() {
    this.loggingIn = true;
    Auth.authenticateUser(this.endpoint, {username: this.username, password: this.password})
      .then(r => {
        this.loggingIn = false;
        this.endpoint.setToken(r.accessToken);
        this.activeSession = this.endpoint.session;
        this.isAuthenticated = true;
        this.authenticated?.emit({authenticated: true, session: this.endpoint.session});
      })
      .catch(e => {
        console.log('[AUTH] Authentication error', e.response, JSON.stringify(e));
        this.loggingIn = false;
        this.activeSession = null;
        this.authenticated?.emit({authenticated: false, session: null});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));

        VerdocsToast('Login failed. Please check your username and password and try again.', {style: 'error'});
      });
  }

  handleLogout() {
    this.endpoint.clearSession();
    this.isAuthenticated = false;
    this.authenticated?.emit({authenticated: false, session: null});
  }

  async checkAvailability(name: string) {
    this.orgname = name;
    this.orgAvailable = '';
    this.orgAvailable = await Organizations.isOrgAvailable(this.endpoint, name);
    console.log('response', this.orgAvailable);
    // Stage: POST - https://2r8pilqa44.execute-api.us-east-1.amazonaws.com/organizations/check-availability
    // Prod: POST - https://lb1is9fxoc.execute-api.us-east-1.amazonaws.com/organizations/check-availability
  }

  render() {
    if (!this.visible) {
      return <div style={{display: 'none'}}>Authenticated</div>;
    }

    if (this.isAuthenticated) {
      return (
        <verdocs-button label="Sign Out" disabled={this.loggingIn} onClick={() => this.handleLogout()} style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}} />
      );
    }

    if (this.displayMode === 'signup') {
      const step1Valid = this.loggingIn || !this.first || !this.last || !this.username || !this.password || !this.orgname || this.orgAvailable !== 'OK';
      return (
        <div class="signup-form">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />

          <h3>Sign up for a trial account</h3>
          <h4>
            Already have an account?
            <verdocs-button label="Log In" variant="text" onClick={() => (this.displayMode = 'login')} disabled={this.loggingIn} />
          </h4>

          {this.step === 1 && (
            <form onSubmit={() => this.handleSignup()}>
              <div style={{display: 'flex', flexDirection: 'row', columnGap: '20px'}}>
                <verdocs-text-input
                  label="First Name"
                  autocomplete="first"
                  required={true}
                  value={this.first}
                  onInput={(e: any) => (this.first = e.target.value)}
                  disabled={this.loggingIn}
                />
                <verdocs-text-input
                  label="Last Name"
                  autocomplete="last"
                  required={true}
                  value={this.last}
                  onInput={(e: any) => (this.last = e.target.value)}
                  disabled={this.loggingIn}
                />
              </div>
              <verdocs-text-input
                label="Email"
                autocomplete="email"
                required={true}
                value={this.username}
                onInput={(e: any) => (this.username = e.target.value)}
                disabled={this.loggingIn}
              />
              <verdocs-text-input label="Phone #" autocomplete="phone" value={this.phone} onInput={(e: any) => (this.phone = e.target.value)} disabled={this.loggingIn} />
              <verdocs-text-input
                label="Password"
                type="password"
                required={true}
                autocomplete="current-password"
                value={this.password}
                onInput={(e: any) => (this.password = e.target.value)}
                disabled={this.loggingIn}
              />
              <verdocs-text-input
                label="Organization Name"
                autocomplete="org"
                required={true}
                value={this.orgname}
                onInput={(e: any) => this.checkAvailability(e.target.value)}
                disabled={this.loggingIn}
              />
              {this.orgAvailable === 'TAKEN' && <p style={{color: 'red'}}>This organization name is already taken.</p>}

              <div style={{marginTop: '30px'}} />

              <verdocs-button label="Next" disabled={step1Valid} onClick={() => (this.step = 2)} style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}} />
            </form>
          )}

          {this.step === 2 && (
            <form onSubmit={() => this.handleSignup()}>
              <verdocs-text-input label="How did you hear about Verdocs?" value={this.howHear} onInput={(e: any) => (this.howHear = e.target.value)} disabled={this.loggingIn} />
              <verdocs-select-input
                label="Your Industry"
                options={Industries}
                value={this.industry}
                onInput={(e: any) => (this.industry = e.target.value)}
                disabled={this.loggingIn}
              />
              <verdocs-select-input
                label="Company Size"
                options={CompanySizes}
                value={this.companySize}
                onInput={(e: any) => (this.companySize = e.target.value)}
                disabled={this.loggingIn}
              />
              <verdocs-select-input label="Purpose" options={Reasons} value={this.reason} onInput={(e: any) => (this.reason = e.target.value)} disabled={this.loggingIn} />
              <div style={{marginTop: '30px'}} />
              <verdocs-button
                label="Create Account"
                disabled={this.loggingIn}
                onClick={() => this.handleSignup()}
                style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
              />
            </form>
          )}

          {this.step === 3 && (
            <form onSubmit={() => this.handleSignup()}>
              <p>Please check your e-mail inbox for a verification code and follow the instructions provided.</p>
              <p>
                <em>
                  Verification messages may take up to 1 hour to arrive. If you do not receive the invitation, <a href="#">Click Here</a> to resend it. Be sure to check your spam
                  folder.
                </em>
              </p>

              <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                <verdocs-button
                  label="Back"
                  disabled={this.loggingIn}
                  onClick={() => {
                    this.step = 4;
                  }}
                  style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
                />
                <verdocs-button
                  label="Go to Dashboard"
                  disabled={true}
                  onClick={() => this.handleSignup()}
                  style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
                />
              </div>
            </form>
          )}
        </div>
      );
    }

    return (
      <div class="login-form">
        <img src={this.logo} alt="Verdocs Logo" class="logo" />

        <h3>Log in to your account</h3>
        <h4>
          Don't have an account?
          <verdocs-button
            label="Sign Up"
            variant="text"
            onClick={() => {
              this.displayMode = 'signup';
              this.step = 1;
            }}
            disabled={this.loggingIn}
          />
        </h4>

        <form onSubmit={() => this.handleLogin()}>
          <verdocs-text-input label="Email" autocomplete="username" value={this.username} onInput={(e: any) => (this.username = e.target.value)} disabled={this.loggingIn} />
          <verdocs-text-input
            label="Password"
            type="password"
            autocomplete="current-password"
            value={this.password}
            onInput={(e: any) => (this.password = e.target.value)}
            disabled={this.loggingIn}
          />

          <verdocs-button
            label="Forgot Your Password?"
            variant="text"
            onClick={() => (this.displayMode = 'signup')}
            disabled={this.loggingIn}
            style={{display: 'flex', justifyContent: 'center', margin: '10px auto 20px'}}
          />

          <verdocs-button label="Login" disabled={this.loggingIn} onClick={() => this.handleLogin()} style={{display: 'flex', justifyContent: 'center', margin: '10px auto 0'}} />
        </form>
      </div>
    );
  }
}
