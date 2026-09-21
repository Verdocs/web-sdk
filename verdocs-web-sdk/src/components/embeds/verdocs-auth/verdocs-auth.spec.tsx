jest.mock('../../../utils/Toast', () => ({
  VerdocsToast: jest.fn(),
}));

import {newSpecPage, SpecPage} from '@stencil/core/testing';
import * as sdk from '@verdocs/js-sdk';
import {VerdocsTextInput} from '../../controls/verdocs-text-input/verdocs-text-input';
import {VerdocsButton} from '../../controls/verdocs-button/verdocs-button';
import {VerdocsToast} from '../../../utils/Toast';
import {VerdocsAuth} from './verdocs-auth';

const MFA_REQUIRED = (mfa_token: string) => ({response: {status: 403, data: {error: 'mfa_required', mfa_token}}});
const SOCIAL_LOGIN_KEY = 'vdocs-social-login';

describe('verdocs-auth', () => {
  const authenticate = sdk.authenticate as jest.Mock;
  let replaceState: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    authenticate.mockResolvedValue({access_token: 'ACCESS'});
    (sdk.getMyUser as jest.Mock).mockResolvedValue({email_verified: true});
    (sdk.getSocialProviders as jest.Mock).mockResolvedValue({google: false, microsoft: false});
  });

  // The page is created before the element is attached so storage and spies set up in between
  // are in place when the component loads and reads the URL.
  const renderAuth = async (url?: string, storedAttempt?: object, showSocialLogins = true): Promise<SpecPage> => {
    const page = await newSpecPage({
      components: [VerdocsAuth, VerdocsTextInput, VerdocsButton],
      ...(url ? {url} : {}),
    });

    window.sessionStorage.clear();
    if (storedAttempt) {
      window.sessionStorage.setItem(SOCIAL_LOGIN_KEY, JSON.stringify(storedAttempt));
    }
    replaceState = jest.spyOn(window.history, 'replaceState');

    await page.setContent(showSocialLogins ? '<verdocs-auth show-social-logins="true"></verdocs-auth>' : '<verdocs-auth></verdocs-auth>');
    await page.waitForChanges();
    return page;
  };

  const ATTEMPT = {verifier: 'VERIFIER', state: 'STATE', provider: 'google'};

  const signIn = async (page: SpecPage) => {
    const instance = page.rootInstance as VerdocsAuth;
    instance.email = 'test@example.com';
    instance.password = 'Password1!';
    await instance.loginAndCheckVerification();
    await flush(page);
  };

  const mfaInput = (page: SpecPage) => page.root.querySelector('.mfa-input input') as HTMLInputElement;

  // Lets a pending promise chain (authenticate, then getMyUser) settle before the next render check.
  const flush = async (page: SpecPage) => {
    await new Promise(resolve => setTimeout(resolve, 0));
    await page.waitForChanges();
  };

  const typeInto = async (page: SpecPage, input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
    await flush(page);
  };

  const buttonByLabel = (page: SpecPage, label: string) =>
    (Array.from(page.root.querySelectorAll('verdocs-button')).find(button => button.textContent.trim() === label) as HTMLElement | undefined) || null;

  const click = async (page: SpecPage, label: string) => {
    buttonByLabel(page, label).click();
    await flush(page);
  };

  it('renders without crashing', async () => {
    const page = await renderAuth();
    expect(page.root).toBeTruthy();
    expect(page.root.querySelector('h3').textContent).toEqual('Log in to your account');
  });

  it('hides the provider buttons when no provider is enabled', async () => {
    const page = await renderAuth();

    expect(sdk.getSocialProviders).toHaveBeenCalledTimes(1);
    expect(page.root.querySelector('.providers')).toBeNull();
    expect(buttonByLabel(page, 'Continue with Google')).toBeNull();
    expect(buttonByLabel(page, 'Continue with Microsoft')).toBeNull();
  });

  it('shows no provider buttons unless the host asks for them', async () => {
    (sdk.getSocialProviders as jest.Mock).mockResolvedValue({google: true, microsoft: true});
    const page = await renderAuth(undefined, undefined, false);

    expect(page.root.querySelector('.providers')).toBeNull();
    expect(buttonByLabel(page, 'Continue with Google')).toBeNull();
    expect(sdk.getSocialProviders).not.toHaveBeenCalled();
  });

  it('shows a button for each enabled provider', async () => {
    (sdk.getSocialProviders as jest.Mock).mockResolvedValue({google: true, microsoft: false});
    const page = await renderAuth();

    expect(buttonByLabel(page, 'Continue with Google')).not.toBeNull();
    expect(buttonByLabel(page, 'Continue with Microsoft')).toBeNull();
    expect(page.root.querySelector('.divider').textContent.trim()).toEqual('or');
  });

  it('shows no provider buttons when the probe fails', async () => {
    (sdk.getSocialProviders as jest.Mock).mockRejectedValue(new Error('offline'));
    const page = await renderAuth();

    expect(page.root.querySelector('.providers')).toBeNull();
  });

  it('starts a provider sign-in with a PKCE challenge and a stored attempt', async () => {
    (sdk.getSocialProviders as jest.Mock).mockResolvedValue({google: true, microsoft: true});
    const page = await renderAuth('https://app.example.com/login?tab=1#forgot-nothing');
    const assign = jest.spyOn(window.location, 'assign').mockImplementation(() => undefined);

    (page.rootInstance as VerdocsAuth).handleSocialLogin('microsoft');
    await flush(page);

    expect(sdk.createCodeChallenge).toHaveBeenCalledWith('TESTVERIFIER');
    expect(JSON.parse(window.sessionStorage.getItem(SOCIAL_LOGIN_KEY))).toEqual({verifier: 'TESTVERIFIER', state: 'TESTVERIFIER', provider: 'microsoft'});
    expect(sdk.getSocialLoginUrl).toHaveBeenCalledWith(expect.anything(), 'microsoft', {
      returnUri: 'https://app.example.com/login?tab=1#forgot-nothing',
      codeChallenge: 'TESTCHALLENGE',
      state: 'TESTVERIFIER',
    });
    expect(assign).toHaveBeenCalledWith(expect.stringContaining('/v2/oauth2/social/microsoft/start'));
    assign.mockRestore();
  });

  it('completes a password login and pushes the token to the endpoint', async () => {
    const page = await renderAuth();
    const instance = page.rootInstance as VerdocsAuth;
    const setToken = jest.spyOn(instance.endpoint, 'setToken');

    await signIn(page);

    expect(authenticate).toHaveBeenCalledWith(instance.tempAuthEndpoint, {username: 'test@example.com', password: 'Password1!', grant_type: 'password'});
    expect(setToken).toHaveBeenCalledWith('ACCESS');
    expect(instance.displayMode).toEqual('login');
  });

  it('enters the mfa step when the password grant answers mfa_required', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth();

    await signIn(page);

    const instance = page.rootInstance as VerdocsAuth;
    expect(instance.displayMode).toEqual('mfa');
    expect(instance.mfaToken).toEqual('MFATOKEN');
    expect(page.root.querySelector('h3').textContent).toEqual('Two-factor authentication');
    expect(page.root.querySelector('.mfa-input .input-label').textContent).toContain('Authentication code');
    expect(mfaInput(page).getAttribute('inputmode')).toEqual('numeric');
    expect(VerdocsToast).not.toHaveBeenCalled();
  });

  it('completes the sign-in with a six-digit code', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth();
    await signIn(page);

    await typeInto(page, mfaInput(page), '12345');
    expect(authenticate).toHaveBeenCalledTimes(1);

    await typeInto(page, mfaInput(page), '123456');

    expect(authenticate).toHaveBeenCalledTimes(2);
    expect(authenticate).toHaveBeenLastCalledWith(expect.anything(), {
      grant_type: 'urn:verdocs:params:oauth:grant-type:mfa-otp',
      mfa_token: 'MFATOKEN',
      otp: '123456',
    });
    expect((page.rootInstance as VerdocsAuth).displayMode).toEqual('login');
  });

  it('keeps only digits in the authentication code', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth();
    await signIn(page);

    await typeInto(page, mfaInput(page), '12a3-4');

    expect((page.rootInstance as VerdocsAuth).mfaCode).toEqual('1234');
    expect(mfaInput(page).value).toEqual('1234');
    expect(authenticate).toHaveBeenCalledTimes(1);
  });

  it('sends the recovery-code grant once the backup toggle is on', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth();
    await signIn(page);

    await click(page, 'Use a backup code instead');

    expect(page.root.querySelector('.mfa-input .input-label').textContent).toContain('Backup code');
    expect(mfaInput(page).getAttribute('placeholder')).toEqual('xxxx-xxxx');
    expect(buttonByLabel(page, 'Use your authenticator app instead')).not.toBeNull();

    await typeInto(page, mfaInput(page), 'ABCD1234');
    expect((page.rootInstance as VerdocsAuth).recoveryCode).toEqual('abcd-1234');

    await click(page, 'Verify');

    expect(authenticate).toHaveBeenCalledTimes(2);
    expect(authenticate).toHaveBeenLastCalledWith(expect.anything(), {
      grant_type: 'urn:verdocs:params:oauth:grant-type:mfa-recovery-code',
      mfa_token: 'MFATOKEN',
      recovery_code: 'abcd-1234',
    });
  });

  it('shows an inline error and keeps the new token when a code is wrong', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN')).mockRejectedValueOnce(MFA_REQUIRED('SECONDTOKEN'));
    const page = await renderAuth();
    await signIn(page);

    await typeInto(page, mfaInput(page), '111111');

    const instance = page.rootInstance as VerdocsAuth;
    expect(instance.displayMode).toEqual('mfa');
    expect(instance.mfaToken).toEqual('SECONDTOKEN');
    expect(instance.mfaCode).toEqual('');
    expect(page.root.querySelector('.mfa-error').textContent).toEqual('Invalid code. Please try again.');

    await typeInto(page, mfaInput(page), '222222');

    expect(authenticate).toHaveBeenCalledTimes(3);
    expect(authenticate).toHaveBeenLastCalledWith(expect.anything(), {
      grant_type: 'urn:verdocs:params:oauth:grant-type:mfa-otp',
      mfa_token: 'SECONDTOKEN',
      otp: '222222',
    });
    expect(page.root.querySelector('.mfa-error')).toBeNull();
  });

  it('returns to the login form when the challenge expires', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN')).mockRejectedValueOnce({response: {status: 401, data: {error: 'invalid_grant'}}});
    const page = await renderAuth();
    await signIn(page);

    await typeInto(page, mfaInput(page), '123456');

    const instance = page.rootInstance as VerdocsAuth;
    expect(instance.displayMode).toEqual('login');
    expect(instance.mfaToken).toEqual('');
    expect(instance.password).toEqual('');
    expect(VerdocsToast).toHaveBeenCalledWith('Your sign-in timed out. Enter your password again.', {style: 'error'});
    expect(buttonByLabel(page, 'Login')).not.toBeNull();
  });

  it('shows the lock reason when too many codes lock the account', async () => {
    authenticate
      .mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'))
      .mockRejectedValueOnce({response: {status: 401, data: {error: 'Account locked. Please contact support@verdocs.com for assistance.'}}});
    const page = await renderAuth();
    await signIn(page);

    await typeInto(page, mfaInput(page), '123456');

    expect((page.rootInstance as VerdocsAuth).displayMode).toEqual('login');
    expect(VerdocsToast).toHaveBeenCalledWith('Account locked. Please contact support@verdocs.com for assistance.', {style: 'error'});
  });

  it('strips state from the URL after a provider error', async () => {
    await renderAuth('https://app.example.com/login?error=email_unverified&state=STATE', ATTEMPT);

    expect(replaceState).toHaveBeenCalledWith(window.history.state, '', '/login');
  });

  it('cancels the mfa step back to the login form', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth();
    await signIn(page);

    await click(page, 'Cancel');

    expect((page.rootInstance as VerdocsAuth).displayMode).toEqual('login');
    expect(page.root.querySelector('h3').textContent).toEqual('Log in to your account');
  });

  it('exchanges a returned login_code and cleans the URL', async () => {
    const page = await renderAuth('https://app.example.com/login?login_code=LOGINCODE&state=STATE', ATTEMPT);
    const instance = page.rootInstance as VerdocsAuth;

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(authenticate).toHaveBeenCalledWith(instance.tempAuthEndpoint, {
      grant_type: 'urn:verdocs:params:oauth:grant-type:login-code',
      login_code: 'LOGINCODE',
      code_verifier: 'VERIFIER',
    });
    expect(replaceState).toHaveBeenCalledWith(window.history.state, '', '/login');
    expect(window.sessionStorage.getItem(SOCIAL_LOGIN_KEY)).toBeNull();
    expect(instance.displayMode).toEqual('login');
    expect(VerdocsToast).not.toHaveBeenCalled();
  });

  it('keeps unrelated query parameters when cleaning the URL', async () => {
    await renderAuth('https://app.example.com/login?tab=2&login_code=LOGINCODE&state=STATE#forgot', ATTEMPT);

    expect(replaceState).toHaveBeenCalledWith(window.history.state, '', '/login?tab=2#forgot');
  });

  it('enters the mfa step when a returned login_code answers mfa_required', async () => {
    authenticate.mockRejectedValueOnce(MFA_REQUIRED('MFATOKEN'));
    const page = await renderAuth('https://app.example.com/login?login_code=LOGINCODE&state=STATE', ATTEMPT);
    await flush(page);

    expect((page.rootInstance as VerdocsAuth).displayMode).toEqual('mfa');
    expect(page.root.querySelector('h3').textContent).toEqual('Two-factor authentication');
  });

  it('refuses a returned login_code whose state does not match', async () => {
    const page = await renderAuth('https://app.example.com/login?login_code=LOGINCODE&state=TAMPERED', ATTEMPT);

    expect(authenticate).not.toHaveBeenCalled();
    expect(VerdocsToast).toHaveBeenCalledWith('Sign-in could not be verified. Try again.', {style: 'error'});
    expect(replaceState).toHaveBeenCalledWith(window.history.state, '', '/login');
    expect(window.sessionStorage.getItem(SOCIAL_LOGIN_KEY)).toBeNull();
    expect((page.rootInstance as VerdocsAuth).displayMode).toEqual('login');
  });

  it('refuses a returned login_code when no attempt was stored', async () => {
    await renderAuth('https://app.example.com/login?login_code=LOGINCODE&state=STATE');

    expect(authenticate).not.toHaveBeenCalled();
    expect(VerdocsToast).toHaveBeenCalledWith('Sign-in could not be verified. Try again.', {style: 'error'});
  });

  it('reports a provider error and cleans the URL', async () => {
    const page = await renderAuth('https://app.example.com/login?error=email_unverified', ATTEMPT);

    expect(authenticate).not.toHaveBeenCalled();
    expect(VerdocsToast).toHaveBeenCalledWith('That account does not have a verified email address.', {style: 'error'});
    expect(replaceState).toHaveBeenCalledWith(window.history.state, '', '/login');
    expect(page.root.querySelector('h3').textContent).toEqual('Log in to your account');
  });

  it('maps each provider error code to its message', async () => {
    await renderAuth('https://app.example.com/login?error=access_denied', ATTEMPT);
    expect(VerdocsToast).toHaveBeenLastCalledWith('Sign-in was canceled.', {style: 'error'});

    await renderAuth('https://app.example.com/login?error=provider_error', ATTEMPT);
    expect(VerdocsToast).toHaveBeenLastCalledWith('That provider could not sign you in. Please try again.', {style: 'error'});

    await renderAuth('https://app.example.com/login?error=corporate_email_required', ATTEMPT);
    expect(VerdocsToast).toHaveBeenLastCalledWith('Please use your corporate email address to create an account.', {style: 'error'});

    await renderAuth('https://app.example.com/login?error=account_locked', ATTEMPT);
    expect(VerdocsToast).toHaveBeenLastCalledWith('That account is locked. Please contact support@verdocs.com.', {style: 'error'});

    await renderAuth('https://app.example.com/login?error=something_else', ATTEMPT);
    expect(VerdocsToast).toHaveBeenLastCalledWith('Unable to sign in. Please try again.', {style: 'error'});
  });

  // This component is embedded in host pages that own their own query string, and `error` is a
  // common parameter name. Without a provider login started from this tab it is not ours to read.
  it('leaves a host page error parameter alone when no provider login was started', async () => {
    const page = await renderAuth('https://app.example.com/login?error=upload_failed&tab=2');

    expect(VerdocsToast).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
    expect(authenticate).not.toHaveBeenCalled();
    expect(page.root.querySelector('h3').textContent).toEqual('Log in to your account');
  });
});
