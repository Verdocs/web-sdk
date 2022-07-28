import {Auth} from '@verdocs/js-sdk/Users';
import {IActiveSession} from '@verdocs/js-sdk/Users/Types';
import {Transport, VerdocsEndpoint} from '@verdocs/js-sdk/HTTP';
import {endSession, loadSession, setSession} from '@verdocs/js-sdk/Users/Auth';
import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';

const BASE_URL = 'https://stage-api.verdocs.com/';
const SOURCE = 'verdocs-stage';

export interface IAuthStatus {
  authenticated: boolean;
  session: any | null;
}

/**
 * Display an authentication dialog that allows the user to login or sign up. Callbacks are provided for events that
 * occur during the process (especially successful completion). The success callback will be fired immediately if the
 * user is already authenticated with a valid session, so this component may not always display visibly.
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
})
export class VerdocsAuth {
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
   * If the user is authenticated, this embed will normally render invisibly. If debug is set true, a summary
   * if the user's session details will be displayed instead. This may be useful while debugging authentication
   * flows in new applications.
   */
  @Prop() debug: boolean = false;

  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status.
   */
  @Event({composed: true}) authenticated: EventEmitter<IAuthStatus>;

  @State() isAuthenticated: boolean = false;
  @State() displayMode: string = 'login';
  @State() username: string = '';
  @State() password: string = '';
  @State() loggingIn: boolean = false;
  @State() activeSession: IActiveSession | null = null;
  @State() loginError: string | null = null;

  componentWillLoad() {
    const staging = new VerdocsEndpoint().setBaseURL(BASE_URL);
    Transport.setActiveEndpoint(staging);
  }

  componentDidLoad() {
    const session = loadSession(SOURCE);
    if (session !== null) {
      this.isAuthenticated = true;
      this.activeSession = session as IActiveSession;
      this.authenticated.emit({authenticated: true, session});
    } else {
      this.authenticated.emit({authenticated: false, session: null});
    }
  }

  // handleSelectOption(option: IMenuOption) {
  //   this.isAuthenticated = false;
  //   this.authenticated.emit(option);
  // }

  handleLogin() {
    this.loggingIn = true;
    Auth.authenticateUser({username: this.username, password: this.password})
      .then(r => {
        this.loggingIn = false;
        const session = setSession(SOURCE, r.accessToken, true);
        this.activeSession = session as IActiveSession;
        this.isAuthenticated = true;
        this.authenticated.emit({authenticated: true, session});
      })
      .catch(e => {
        console.log('[VERDOCS] Login error', e.response, JSON.stringify(e));
        this.loggingIn = false;
        this.activeSession = null;
        this.authenticated.emit({authenticated: false, session: null});

        if (e?.response?.status === 403) {
          this.loginError = 'Please check your username and password and try again.';
        }
      });
  }

  handleLogout() {
    endSession(SOURCE);
    this.isAuthenticated = false;
    this.authenticated.emit({authenticated: false, session: null});
  }

  handleClearError() {
    this.loginError = null;
  }

  render() {
    if (!this.visible) {
      return <div style={{display: 'none'}}>Verdocs Auth Placeholder</div>;
    }

    if (this.isAuthenticated) {
      if (this.debug) {
        return (
          <div class="status-result debug">
            <verdocs-button label="Logout" disabled={this.loggingIn} onPress={() => this.handleLogout()} />
          </div>
        );
      }

      return <div class="status-result">Authenticated</div>;
    }

    if (this.displayMode === 'signup') {
      return (
        <div class="signup-form">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />

          <h3>Sign up for an account</h3>
          <h4>
            Already have an account?
            <verdocs-button label="Log In" variant="text" onClick={() => (this.displayMode = 'login')} disabled={this.loggingIn} />
          </h4>

          <form onSubmit={() => this.handleLogin()}>
            <verdocs-text-input label="Email" autocomplete="username" value={this.username} onFieldInput={e => (this.username = e.detail)} disabled={this.loggingIn} />
            <verdocs-text-input
              label="Password"
              type="password"
              autocomplete="current-password"
              value={this.password}
              onFieldInput={e => (this.password = e.detail)}
              disabled={this.loggingIn}
            />

            <verdocs-button
              label="Signup"
              disabled={this.loggingIn}
              onPress={() => this.handleLogin()}
              style={{display: 'flex', justifyContent: 'center', margin: '30px auto 0'}}
            />
          </form>
        </div>
      );
    }

    return (
      <div class="login-form">
        <img src={this.logo} alt="Verdocs Logo" class="logo" />

        <h3>Log in to your account</h3>
        <h4>
          Don't have an account?
          <verdocs-button label="Sign Up" variant="text" onClick={() => (this.displayMode = 'signup')} disabled={this.loggingIn} />
        </h4>

        <form onSubmit={() => this.handleLogin()}>
          <verdocs-text-input label="Email" autocomplete="username" value={this.username} onFieldInput={e => (this.username = e.detail)} disabled={this.loggingIn} />
          <verdocs-text-input
            label="Password"
            type="password"
            autocomplete="current-password"
            value={this.password}
            onFieldInput={e => (this.password = e.detail)}
            disabled={this.loggingIn}
          />

          <verdocs-button
            label="Forgot Your Password?"
            variant="text"
            onClick={() => (this.displayMode = 'signup')}
            disabled={this.loggingIn}
            style={{display: 'flex', justifyContent: 'center', margin: '10px auto 20px'}}
          />

          <verdocs-button label="Login" disabled={this.loggingIn} onPress={() => this.handleLogin()} style={{display: 'flex', justifyContent: 'center', margin: '10px auto 0'}} />
        </form>

        {this.loginError ? <verdocs-ok-dialog open={true} heading="Login Error" message={this.loginError} onClosed={() => this.handleClearError()} /> : <div />}
      </div>
    );
  }
}
