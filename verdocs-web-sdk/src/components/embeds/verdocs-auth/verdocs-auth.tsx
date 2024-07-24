import {TSession, VerdocsEndpoint, createProfile, authenticate, resendVerification, resetPassword, verifyEmail, getMyUser, IAuthenticateResponse} from '@verdocs/js-sdk';
import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import {VerdocsToast} from '../../../utils/Toast';
import {SDKError} from '../../../utils/errors';

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
  @State() org_name: string = '';
  @State() first_name: string = '';
  @State() last_name: string = '';
  @State() email: string = '';
  @State() verificationCode: string = '';
  @State() password: string = '';
  @State() submitting: boolean = false;
  @State() activeSession: TSession = null;
  @State() resendDisabled = false;

  resendDisabledTimer = null;
  accessTokenForVerification = null;

  // We can't instantly log in on the default endpoint because other listeners might see
  // its events and incorrectly trigger before we're done. So we manage our own temp
  // endpoint and pass the final tokens to the default once we're ready.
  tempAuthEndpoint = new VerdocsEndpoint();

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

  isPasswordComplex(password: string) {
    const isUppercase = (ch: string) => /[A-Z]/.test(ch);
    const isLowercase = (ch: string) => /[a-z]/.test(ch);
    const isSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (isUppercase(ch)) countOfUpperCase++;
      else if (isLowercase(ch)) countOfLowerCase++;
      else if (isSpecialChar(ch)) countOfSpecialChar++;
    }
    return password.length >= 8 && countOfLowerCase > 0 && countOfUpperCase > 0 && countOfSpecialChar > 0;
  }

  handleSignup() {
    this.submitting = true;
    this.accessTokenForVerification = null;

    if (!this.isPasswordComplex(this.password)) {
      window.alert('Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.');
      return;
    }

    createProfile(this.endpoint, {
      email: this.email,
      password: this.password,
      first_name: this.first_name,
      last_name: this.last_name,
      org_name: this.org_name,
    })
      .then(r => {
        console.log('Profile creation result', r);
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

  async handleVerification() {
    this.submitting = true;
    this.accessTokenForVerification = null;

    try {
      this.submitting = false;
      const verificationResult = await verifyEmail(this.endpoint, {email: this.email, token: this.verificationCode});
      console.log('Verification result', verificationResult);
      if (!this.isPasswordComplex(this.password)) {
        window.alert('Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character.');
        return;
      }
    } catch (e) {
      this.submitting = false;
      console.log('Verification error', e);
      VerdocsToast('Verification error, please check the code and try again.');
    }
  }

  completeLogin(result: IAuthenticateResponse) {
    this.endpoint.setToken(result.access_token);
    this.activeSession = this.endpoint.session;
    this.isAuthenticated = true;
    this.authenticated?.emit({authenticated: true, session: this.endpoint.session});
  }

  async loginAndCheckVerification() {
    this.submitting = true;
    this.accessTokenForVerification = null;

    try {
      this.submitting = false;
      const authResult = await authenticate(this.endpoint, {username: this.email, password: this.password, grant_type: 'password'});
      this.accessTokenForVerification = authResult.access_token;

      const user = await getMyUser(this.endpoint);
      console.log('Got user', user);

      if (!user.email_verified) {
        console.log('[AUTH] Logged in, pending email address verification');
        this.displayMode = 'verify';
        this.accessTokenForVerification = authResult.access_token;
      } else {
        console.log('[AUTH] Email address is verified, completing login');
        this.completeLogin(authResult);
      }
    } catch (e) {
      this.submitting = false;
    }
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

  async handleReset() {
    this.submitting = true;

    try {
      const result = await resetPassword(this.endpoint, {email: this.email});
      console.log('[AUTH] Reset sent', result);
      this.submitting = false;
      this.displayMode = 'login';
      VerdocsToast('If your email address is registered, you will receive instructions on resetting your password shortly.', {style: 'info'});
    } catch (e) {
      console.log('[AUTH] Unable to reset password', e);
      this.submitting = false;
      VerdocsToast('Unable to reset password. Please check your email address and try again.', {style: 'error'});
    }
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
      const invalid = this.submitting || !this.first_name || !this.last_name || !this.email || !this.password || !this.org_name;

      return (
        <div class="form">
          <a href="https://verdocs.com/en/">
            <img src={this.logo} alt="Verdocs Logo" class="logo" />
          </a>

          <h3>Sign up for a free account</h3>
          <h5>
            Already have an account?
            <verdocs-button label="Log In" variant="text" onClick={() => (this.displayMode = 'login')} disabled={this.submitting} />
          </h5>

          <form onSubmit={() => this.handleSignup()}>
            <div style={{display: 'flex', flexDirection: 'row', columnGap: '20px'}}>
              <verdocs-text-input
                label="First Name"
                autocomplete="first"
                required={true}
                value={this.first_name}
                onInput={(e: any) => (this.first_name = e.target.value)}
                disabled={this.submitting}
              />
              <verdocs-text-input
                label="Last Name"
                autocomplete="last"
                required={true}
                value={this.last_name}
                onInput={(e: any) => (this.last_name = e.target.value)}
                disabled={this.submitting}
              />
            </div>
            <verdocs-text-input
              label="Email Address"
              autocomplete="email"
              required={true}
              value={this.email}
              onInput={(e: any) => (this.email = e.target.value)}
              disabled={this.submitting}
            />
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
              value={this.org_name}
              onInput={(e: any) => (this.org_name = e.target.value)}
              disabled={this.submitting}
              style={{flex: '1'}}
            />

            <div style={{marginTop: '30px'}} />

            <verdocs-button label="Next" disabled={invalid} onClick={() => this.handleSignup()} style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}} />
          </form>
        </div>
      );
    }

    if (this.displayMode === 'verify') {
      return (
        <form onSubmit={() => this.handleSignup()}>
          <p>Please check your e-mail inbox for a verification code and follow the instructions provided.</p>
          <p>
            <em>
              Verification messages may take up to 1 hour to arrive. If you do not receive the invitation, <a href="#">Click Here</a> to resend it. Be sure to check your spam
              folder.
            </em>
          </p>

          <verdocs-text-input
            label="Verification Code"
            required={true}
            value={this.verificationCode}
            onInput={(e: any) => (this.verificationCode = e.target.value)}
            disabled={this.submitting}
          />

          <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
            <verdocs-button
              label="Verify"
              disabled={this.submitting}
              onClick={() => this.handleVerification()}
              style={{display: 'flex', justifyContent: 'center', margin: '10px auto 0'}}
            />
            <verdocs-button variant="outline" label="Resend Code" disabled={this.resendDisabled} onClick={() => this.handleResend()} />
            <verdocs-button
              label="Sign Out"
              variant="text"
              disabled={this.submitting}
              onClick={() => {
                this.tempAuthEndpoint.clearSession();
                this.email = '';
                this.password = '';
                this.displayMode = 'login';
              }}
            />
          </div>
        </form>
      );
    }

    if (this.displayMode === 'forgot') {
      return (
        <div class="form">
          <a href="https://verdocs.com/en/">
            <img src={this.logo} alt="Verdocs Logo" class="logo" />
          </a>

          <h3>Forgot your password?</h3>

          <p>
            Enter your e-mail address below, and reset instructions will be sent to your Inbox. Please allow up to 15 minutes to arrive. Check your spam folder if you do not
            receive the message.
          </p>

          <form onSubmit={() => this.handleSignup()}>
            <verdocs-text-input
              label="Email Address"
              autocomplete="email"
              required={true}
              value={this.email}
              onInput={(e: any) => (this.email = e.target.value)}
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

    return (
      <div class="form">
        <a href="https://verdocs.com/en/">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />
        </a>

        <h3>Log in to your account</h3>
        <h4>
          Don't have an account?
          <verdocs-button label="Sign Up" variant="text" onClick={() => (this.displayMode = 'signup')} disabled={this.submitting} />
        </h4>

        <form onSubmit={() => this.loginAndCheckVerification()}>
          <verdocs-text-input label="Email" autocomplete="username" value={this.email} onInput={(e: any) => (this.email = e.target.value)} disabled={this.submitting} />
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
