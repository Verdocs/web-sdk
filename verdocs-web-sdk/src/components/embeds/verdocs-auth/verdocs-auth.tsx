import {Component, Prop, State, h, Event, EventEmitter} from '@stencil/core';
import {Auth} from '@verdocs/js-sdk/Users';

export interface IAuthStatus {
  authenticated: boolean;
  session: any | null;
}

export type TSessionSource = 'verdocs-user' | 'verdocs-sign';

/**
 * Display an authentication dialog that allows the user to login or sign up. Callbacks are provided for events that
 * occur during the process (especially successful completion). The success callback will be fired immediately if the
 * user is already authenticated with a valid session, so this component may not always display visibly. To simplify
 * some types of authentication flows, a visibility flag can force this component to never display.
 *
 * This embed is responsive / mobile-friendly, but the calling application should provide at least a 300px wide
 * container to allow sufficient space for the required forms.
 *
 * As noted below, the primary event is `authenticated`. This will always be fired at least once, immediately after
 * the widget is rendered and the user's status has been checked. It may be fired again as the user completes (or
 * cancels) authentication steps.
 *
 * ```typescript
 * interface IAuthStatus {
 *   // If true, the user is authenticated with a valid session
 *   authenticated: boolean;
 *
 *   // Details for the user's session
 *   session: any | null;
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
   * By default, this embed will check the user's standard Verdocs session, which allows access to all
   * functions within the platform. Applications only presenting e-signing experiences should use
   * `verdocs-sign` instead, which provides a more streamlined interface - direct login and signup will be
   * disabled, and the user's session will only be checked and loaded if possible.
   *
   * It is also possible to specify other values here to target private / sandboxed session environments.
   * This should only be done after discussion with a Verdocs Customer Solutions Engineering contact.
   */
  @Prop() source: TSessionSource = 'verdocs-user';

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
  @Prop() debug: boolean = true;

  /**
   * Event fired when session authentication process has completed. Check the event contents for completion status.
   */
  @Event({composed: true}) authenticated: EventEmitter<IAuthStatus>;

  @State() isAuthenticated: boolean = false;
  @State() displayMode: string = 'login';

  componentWillLoad() {}

  componentDidLoad() {
    console.log('[Verdocs Auth] Validating user session');
    const token = localStorage.getItem(this.source);
    if (!token) {
      this.isAuthenticated = false;
      this.authenticated.emit({authenticated: false, session: null});
      return;
    }

    console.log('Loaded token', token);
    this.isAuthenticated = true;
    Auth.validateToken({token})
      .then(r => {
        console.log('Validated token', r);
      })
      .catch(e => {
        console.log('Error validating token', e);
      });
  }

  // handleSelectOption(option: IMenuOption) {
  //   this.isAuthenticated = false;
  //   this.authenticated.emit(option);
  // }

  handleLogin(e: any) {
    e.preventDefault();
    console.log('login', e);
  }

  render() {
    if (this.isAuthenticated) {
      return this.debug ? <div class="status-result">Authenticated</div> : <div class="status-result">Authenticated</div>;
    }

    if (this.displayMode === 'signup') {
      return (
        <div class="signup-form">
          <img src={this.logo} alt="Verdocs Logo" class="logo" />

          <h3>Sign up for an account</h3>
          <h4>
            Already have an account?
            <button class="text-button" aria-label="Sign Up" onClick={() => (this.displayMode = 'login')}>
              Log In
            </button>
          </h4>

          <form onSubmit={e => this.handleLogin(e)}>
            <verdocs-text-input label="Email" autocomplete="username" />
            <verdocs-text-input label="Password" type="password" autocomplete="current-password" />

            <button type="submit" class="submit-button" aria-label="Sign Up">
              Signup
            </button>
          </form>

          <div class="items">{this.source}</div>
        </div>
      );
    }

    return (
      <div class="login-form">
        <img src={this.logo} alt="Verdocs Logo" class="logo" />

        <h3>Log in to your account</h3>
        <h4>
          Don't have an account?
          <button class="text-button" aria-label="Sign Up" onClick={() => (this.displayMode = 'signup')}>
            Sign Up
          </button>
        </h4>

        <form onSubmit={e => this.handleLogin(e)}>
          <verdocs-text-input label="Email" autocomplete="username" />
          <verdocs-text-input label="Password" type="password" autocomplete="current-password" />

          <button class="forgot-button" aria-label="Sign Up" onClick={() => (this.displayMode = 'signup')}>
            Forgot your password?
          </button>

          <button type="submit" class="submit-button" aria-label="Log In">
            Login
          </button>
        </form>
      </div>
    );
  }
}
