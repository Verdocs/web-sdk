import {TSession, VerdocsEndpoint, createProfile, authenticate, decodeAccessTokenBody, resendVerification, resetPassword} from '@verdocs/js-sdk';
import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

const RECHECK_INTERVAL = 5000;

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
 * Display an authentication dialog that allows the user to login or sign up. If the user is already authenticated
 * with a valid session, this component will hide itself and fire the success callback immediately. It is up to the
 * host application to render the next appropriate view for the application.
 *
 * To simplify UI development, a visibility flag can force this component to never display. This
 * allows you to susbcribe to notifications from client apps without calling the lower-level JS SDK.
 *
 * This embed is responsive / mobile-friendly, but the calling application should provide at least a 300px wide
 * container to allow sufficient space for the required forms.
 *
 * ```ts
 * <verdocs-auth onAuthenticated={e => console.log('Authentication state:', e.detail)} />
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
  @Prop() logo: string = 'https://app.verdocs.com/assets/blue-logo.svg';

  /**
   * Event fired when session authentication process has completed. Check the event
   * contents for completion status. This event will always be called at least once,
   * when the component is first rendered.
   */
  @Event({composed: true}) authenticated: EventEmitter<IAuthStatus>;

  /**
   * Event fired if an error occurs. The event details will contain information about the error. Most errors will
   * terminate the process, and the calling application should correct the condition and re-render the component.
   */
  @Event({composed: true}) sdkError: EventEmitter<SDKError>;

  @State() isAuthenticated: boolean = false;
  @State() displayMode: 'login' | 'forgot' | 'signup' | 'verify' = 'login';
  @State() orgname: string = '';
  @State() first: string = '';
  @State() last: string = '';
  @State() username: string = '';
  @State() phone: string = '';
  @State() password: string = '';
  @State() submitting: boolean = false;
  @State() activeSession: TSession = null;
  @State() accountType: 'personal' | 'org' = 'org';
  @State() howHear: string = '';
  @State() industry: string = '';
  @State() companySize: string = '';
  @State() reason: string = '';
  @State() signupStep = 1;
  @State() resendDisabled = false;
  @State() checkingOrg = false;

  recheckTimer = null;
  resendDisabledTimer = null;
  accessTokenForVerification = null;

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

  disconnectedCallback() {
    this.cancelRecheckTimer();
  }

  cancelRecheckTimer() {
    if (this.recheckTimer) {
      try {
        clearTimeout(this.recheckTimer);
      } catch (e) {
        // NOP
      }
      this.recheckTimer = null;
    }

    if (this.resendDisabledTimer) {
      try {
        clearTimeout(this.resendDisabledTimer);
      } catch (e) {
        // NOP
      }
      this.resendDisabledTimer = null;
    }
  }

  handleSignup() {
    this.submitting = true;
    this.accessTokenForVerification = null;

    createProfile(this.endpoint, {
      email: this.username,
      password: this.password,
      firstName: this.first,
      lastName: this.last,
      orgName: this.orgname,
    })
      .then(r => {
        console.log('Result', r);
        console.log('[AUTH] Created profile', r.profile);
        console.log('[AUTH] Created organization', r.organization);
        this.loginAndCheckVerification();
      })
      .catch(e => {
        console.log('[AUTH] Signup error', e.response);
        this.submitting = false;
        this.activeSession = null;
        this.authenticated?.emit({authenticated: false, session: null});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));

        VerdocsToast('Signup failed: ' + e.response?.data?.message || 'Unknown Error', {style: 'error'});
      });
  }

  loginAndCheckVerification() {
    this.submitting = true;
    this.accessTokenForVerification = null;

    authenticate(this.endpoint, {username: this.username, password: this.password, grant_type: 'password'})
      .then(r => {
        this.cancelRecheckTimer();
        this.submitting = false;

        const body = decodeAccessTokenBody(r.access_token);
        console.log('[AUTH] Got access token body', body);
        if (body?.email_verified) {
          console.log('[AUTH] Email address is verified, completing login');
          this.displayMode = 'login'; // After signing out, this will be the next mode
          this.accessTokenForVerification = null;
          this.endpoint.setToken(r.access_token);
          this.activeSession = this.endpoint.session;
          this.isAuthenticated = true;
          this.authenticated?.emit({authenticated: true, session: this.endpoint.session});
        } else {
          console.log('[AUTH] Logged in, pending email address verification');
          this.displayMode = 'verify';
          this.accessTokenForVerification = r.access_token;
          this.recheckTimer = setTimeout(() => this.loginAndCheckVerification(), RECHECK_INTERVAL);
        }
      })
      .catch(e => {
        this.cancelRecheckTimer();

        console.log('[AUTH] Authentication error', e.response, JSON.stringify(e));
        this.displayMode = 'login';
        this.submitting = false;
        this.activeSession = null;
        this.authenticated?.emit({authenticated: false, session: null});
        this.sdkError?.emit(new SDKError(e.message, e.response?.status, e.response?.data));

        VerdocsToast('Login failed. Please check your username and password and try again.', {style: 'error'});
      });
  }

  handleLogout() {
    this.endpoint.clearSession();
    this.isAuthenticated = false;
    this.accessTokenForVerification = null;
    this.authenticated?.emit({authenticated: false, session: null});
  }

  handleResend() {
    // Avoid the user just click-spamming this pathway. The server rate-limits this anyway so it's not a
    // security issue but it's a poor user experience to allow it.
    this.resendDisabled = true;
    this.resendDisabledTimer = setTimeout(() => {
      this.resendDisabled = false;
      this.resendDisabledTimer = null;
    }, 30000);

    resendVerification(this.endpoint, this.accessTokenForVerification)
      .then(r => {
        console.log('[AUTH] Verification request resent', r);
        VerdocsToast('Please check your email for a message with verification instructions.', {style: 'info'});
      })
      .catch((e: any) => {
        console.log('[AUTH] Unable to resend verification', e);
      });
  }

  handleReset() {
    this.submitting = true;
    resetPassword(this.endpoint, {email: this.username})
      .then(r => {
        console.log('[AUTH] Reset sent', r);
        this.submitting = false;
        this.displayMode = 'login';
        VerdocsToast('If your email address is registered, you will receive instructions on resetting your password shortly.', {style: 'info'});
      })
      .catch((e: any) => {
        console.log('[AUTH] Unable to reset password', e);
        this.submitting = false;
      });
  }

  render() {
    if (!this.visible) {
      return <div style={{display: 'none'}}>Authenticated</div>;
    }

    if (this.isAuthenticated) {
      return (
        <verdocs-button
          label="Sign Out"
          disabled={this.submitting}
          onClick={() => this.handleLogout()}
          style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
        />
      );
    }

    if (this.displayMode === 'signup') {
      const step1Invalid = this.submitting || !this.first || !this.last || !this.username || !this.password || !this.orgname;

      return (
        <div class="form">
          <a href="https://verdocs.com/en/">
            <img src={this.logo} alt="Verdocs Logo" class="logo" />
          </a>

          <h3>Sign up for a trial account</h3>
          <h4>
            Already have an account?
            <verdocs-button label="Log In" variant="text" onClick={() => (this.displayMode = 'login')} disabled={this.submitting} />
          </h4>

          {this.signupStep === 1 && (
            <form onSubmit={() => this.handleSignup()}>
              <div style={{display: 'flex', flexDirection: 'row', columnGap: '20px'}}>
                <verdocs-text-input
                  label="First Name"
                  autocomplete="first"
                  required={true}
                  value={this.first}
                  onInput={(e: any) => (this.first = e.target.value)}
                  disabled={this.submitting}
                />
                <verdocs-text-input
                  label="Last Name"
                  autocomplete="last"
                  required={true}
                  value={this.last}
                  onInput={(e: any) => (this.last = e.target.value)}
                  disabled={this.submitting}
                />
              </div>
              <verdocs-text-input
                label="Email"
                autocomplete="email"
                required={true}
                value={this.username}
                onInput={(e: any) => (this.username = e.target.value)}
                disabled={this.submitting}
              />
              <verdocs-text-input label="Phone #" autocomplete="phone" value={this.phone} onInput={(e: any) => (this.phone = e.target.value)} disabled={this.submitting} />
              <verdocs-text-input
                label="Password"
                type="password"
                required={true}
                autocomplete="current-password"
                value={this.password}
                onInput={(e: any) => (this.password = e.target.value)}
                disabled={this.submitting}
              />
              <verdocs-text-input
                label="Organization Name"
                autocomplete="org"
                required={true}
                value={this.orgname}
                onInput={(e: any) => (this.orgname = e.target.value)}
                disabled={this.submitting}
                style={{flex: '1'}}
              />

              <div style={{marginTop: '30px'}} />

              <verdocs-button
                label="Next"
                disabled={step1Invalid}
                onClick={() => (this.signupStep = 2)}
                style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
              />
            </form>
          )}

          {this.signupStep === 2 && (
            <form onSubmit={() => this.handleSignup()}>
              <verdocs-text-input label="How did you hear about Verdocs?" value={this.howHear} onInput={(e: any) => (this.howHear = e.target.value)} disabled={this.submitting} />
              <verdocs-select-input
                label="Your Industry"
                options={Industries}
                value={this.industry}
                onInput={(e: any) => (this.industry = e.target.value)}
                disabled={this.submitting}
              />
              <verdocs-select-input
                label="Company Size"
                options={CompanySizes}
                value={this.companySize}
                onInput={(e: any) => (this.companySize = e.target.value)}
                disabled={this.submitting}
              />
              <verdocs-select-input label="Purpose" options={Reasons} value={this.reason} onInput={(e: any) => (this.reason = e.target.value)} disabled={this.submitting} />
              <div style={{marginTop: '30px'}} />
              <verdocs-button
                label="Create Account"
                disabled={this.submitting}
                onClick={() => this.handleSignup()}
                style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
              />
            </form>
          )}

          {this.signupStep === 3 && (
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
                  disabled={this.submitting}
                  onClick={() => {
                    this.signupStep = 2;
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

    if (this.displayMode === 'forgot') {
      return (
        <div class="form">
          <a href="https://verdocs.com/en/">
            <img src={this.logo} alt="Verdocs Logo" class="logo" />
          </a>

          <h3>Forgot your password?</h3>

          <p>Enter your e-mail address below, and reset instructions will be sent to your Inbox.</p>
          <p>
            <em>Please allow up to 24 hours for delivery, and check your spam folder if you do not receive the message. </em>
          </p>

          <form onSubmit={() => this.handleSignup()}>
            <verdocs-text-input
              label="Email"
              autocomplete="email"
              required={true}
              value={this.username}
              onInput={(e: any) => (this.username = e.target.value)}
              disabled={this.submitting}
            />

            <div style={{marginTop: '30px'}} />

            <div class="buttons">
              <verdocs-button label="Cancel" variant="outline" disabled={this.submitting} onClick={() => (this.displayMode = 'login')} />
              <verdocs-button label="Reset" disabled={this.submitting} onClick={() => this.handleReset()} />
            </div>
          </form>
        </div>
      );
    }

    if (this.displayMode === 'verify') {
      return (
        <div class="form">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />

          <h3>Please Verify your Email Address</h3>

          <p>Check your e-mail inbox for a verification email, and follow the instructions provided.</p>
          <p>
            <em>Please allow up to 24 hours for delivery, and check your spam folder if you do not receive the message. </em>
          </p>

          <div class="buttons">
            <verdocs-button
              label="Sign Out"
              variant="outline"
              disabled={this.submitting}
              onClick={() => {
                this.username = '';
                this.password = '';
                this.cancelRecheckTimer();
                this.displayMode = 'login';
              }}
            />
            <verdocs-button label="Resend Email" disabled={this.resendDisabled} onClick={() => this.handleResend()} />
          </div>
        </div>
      );
    }

    return (
      <div class="form">
        <a href="https://verdocs.com/en/">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />
        </a>

        <h3>Log in to your account</h3>
        <h4>
          Don't have an account?
          <verdocs-button
            label="Sign Up"
            variant="text"
            onClick={() => {
              this.displayMode = 'signup';
              this.signupStep = 1;
            }}
            disabled={this.submitting}
          />
        </h4>

        <form onSubmit={() => this.loginAndCheckVerification()}>
          <verdocs-text-input label="Email" autocomplete="username" value={this.username} onInput={(e: any) => (this.username = e.target.value)} disabled={this.submitting} />
          <verdocs-text-input
            label="Password"
            type="password"
            autocomplete="current-password"
            value={this.password}
            onInput={(e: any) => (this.password = e.target.value)}
            disabled={this.submitting}
          />

          <verdocs-button
            label="Forgot Your Password?"
            variant="text"
            onClick={() => (this.displayMode = 'forgot')}
            disabled={this.submitting}
            style={{display: 'flex', justifyContent: 'center', margin: '10px auto 20px'}}
          />

          <verdocs-button
            label="Login"
            disabled={this.submitting}
            onClick={() => this.loginAndCheckVerification()}
            style={{display: 'flex', justifyContent: 'center', margin: '10px auto 0'}}
          />
        </form>
      </div>
    );
  }
}
