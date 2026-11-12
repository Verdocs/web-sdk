import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsClickwrap} from '../verdocs-clickwrap';

// jest-setup.ts already mocks @verdocs/js-sdk for every spec (keeping the real helpers), and that mock wins over a
// per-file jest.mock. So we spy on the four clickwrap calls on that shared module instead.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require('@verdocs/js-sdk');

const TOKEN = 'vd_cw_abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';
const RESULT = {acceptance_id: 'r-1', outcome: 'accepted', created_at: '2026-11-12T15:00:00.000Z'};

const agreement = (key: string, name: string) => ({
  key,
  name,
  version_id: `v-${key}`,
  number: 1,
  content: `<p>The ${name} text.</p>`,
});

const session = (overrides: Record<string, unknown> = {}) => ({
  id: 's-1',
  expires_at: '2026-11-12T16:00:00.000Z',
  mode: 'modal',
  require_scroll: false,
  agreements: [agreement('tos', 'Terms of Service'), agreement('privacy', 'Privacy Policy')],
  brand: null,
  ...overrides,
});

const mocked: Record<'getSession' | 'sendEvent' | 'accept' | 'decline', jest.Mock> = {
  getSession: jest.spyOn(sdk, 'getClickwrapSession') as unknown as jest.Mock,
  sendEvent: jest.spyOn(sdk, 'sendClickwrapEvent') as unknown as jest.Mock,
  accept: jest.spyOn(sdk, 'acceptClickwrap') as unknown as jest.Mock,
  decline: jest.spyOn(sdk, 'declineClickwrap') as unknown as jest.Mock,
};

const render = async (props: Record<string, unknown> = {}) => {
  const handlers = {current: jest.fn(), shown: jest.fn(), accepted: jest.fn(), declined: jest.fn(), sdkError: jest.fn()};
  const page = await newSpecPage({
    components: [VerdocsClickwrap],
    template: () => (
      <verdocs-clickwrap
        token={TOKEN}
        onCurrent={handlers.current}
        onShown={handlers.shown}
        onAccepted={handlers.accepted}
        onDeclined={handlers.declined}
        onSdkError={handlers.sdkError}
        {...props}
      />
    ),
  });
  return {page, handlers};
};

const boxes = (page: any) => Array.from(page.root.querySelectorAll('.cw-check input')) as HTMLInputElement[];
const acceptButton = (page: any) => page.root.querySelector('.cw-accept') as HTMLButtonElement;

// The mock DOM reflects disabled on inputs but not on buttons, so we read the attribute
const acceptDisabled = (page: any) => acceptButton(page).hasAttribute('disabled');

const check = async (page: any, index: number) => {
  const box = boxes(page)[index];
  box.checked = true;
  box.dispatchEvent(new Event('change'));
  await page.waitForChanges();
};

// The mock DOM does no layout, so a terms box has to be given a size before it can be "scrolled"
const scrollTermsTo = async (page: any, top: number, {height = 1000, client = 300} = {}) => {
  const terms = page.root.querySelector('.cw-terms') as HTMLElement;
  Object.defineProperty(terms, 'scrollHeight', {configurable: true, value: height});
  Object.defineProperty(terms, 'clientHeight', {configurable: true, value: client});
  terms.scrollTop = top;
  terms.dispatchEvent(new Event('scroll'));
  await page.waitForChanges();
};

const sentEvents = () => mocked.sendEvent.mock.calls.map(([, , event]) => event);

beforeEach(() => {
  Object.values(mocked).forEach(mock => mock.mockReset());
  mocked.sendEvent.mockResolvedValue(undefined);
  mocked.getSession.mockResolvedValue(session());
});

describe('verdocs-clickwrap', () => {
  it('emits current and renders nothing when there is no token', async () => {
    const {page, handlers} = await render({token: ''});

    expect(handlers.current).toHaveBeenCalledTimes(1);
    expect(mocked.getSession).not.toHaveBeenCalled();
    expect(page.root.querySelector('.cw-check')).toBeNull();
  });

  it('loads the session with its token and reports that the terms were shown', async () => {
    const {page, handlers} = await render();

    expect(mocked.getSession).toHaveBeenCalledWith(expect.anything(), TOKEN);
    expect(handlers.shown).toHaveBeenCalledTimes(1);
    expect(sentEvents()).toEqual([expect.objectContaining({event: 'shown'})]);
    expect(page.root.querySelector('.cw-terms').textContent).toContain('The Terms of Service text.');
  });

  it('enables accept only when every agreement is checked, and reports each box', async () => {
    const {page} = await render();
    expect(boxes(page)).toHaveLength(2);
    expect(acceptDisabled(page)).toBe(true);

    await check(page, 0);
    expect(acceptDisabled(page)).toBe(true);
    await check(page, 1);
    expect(acceptDisabled(page)).toBe(false);

    expect(sentEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({event: 'checked', version_id: 'v-tos'}),
        expect.objectContaining({event: 'checked', version_id: 'v-privacy'}),
      ]),
    );
  });

  it('keeps the boxes locked until the terms are scrolled to the end when scrolling is required', async () => {
    mocked.getSession.mockResolvedValue(session({require_scroll: true}));
    const {page} = await render();
    expect(boxes(page).every(box => box.disabled)).toBe(true);
    expect(page.root.querySelector('.cw-scroll-hint')).not.toBeNull();

    await scrollTermsTo(page, 200);
    expect(boxes(page).every(box => box.disabled)).toBe(true);

    await scrollTermsTo(page, 700);
    await scrollTermsTo(page, 700);
    expect(boxes(page).some(box => box.disabled)).toBe(false);
    expect(page.root.querySelector('.cw-scroll-hint')).toBeNull();
    expect(sentEvents().filter(event => event.event === 'scrolled_to_end')).toHaveLength(1);
  });

  it('records an acceptance with the labels, surface, and a presentation of what was shown', async () => {
    mocked.accept.mockResolvedValue(RESULT);
    const {page, handlers} = await render({surface: 'hosted'});
    await check(page, 0);
    await check(page, 1);

    acceptButton(page).click();
    await page.waitForChanges();

    const [, token, params] = mocked.accept.mock.calls[0];
    expect(token).toBe(TOKEN);
    expect(params).toMatchObject({
      surface: 'hosted',
      labels: {
        agreements: [
          {version_id: 'v-tos', label: 'I have read and agree to the Terms of Service'},
          {version_id: 'v-privacy', label: 'I have read and agree to the Privacy Policy'},
        ],
        button: 'Agree and continue',
      },
    });
    expect(params.presentation).toContain('<!doctype html>');
    expect(params.presentation).toContain('The Privacy Policy text.');
    expect(params.presentation).toContain('I have read and agree to the Terms of Service');
    // Live checkbox state survives into the capture
    expect(params.presentation.match(/<input[^>]*checked/g)).toHaveLength(2);
    expect(params.presentation).not.toContain('data-verdocs-linked-terms');

    expect(handlers.accepted).toHaveBeenCalledWith(expect.objectContaining({detail: RESULT}));
    expect(page.root.querySelector('.cw-check')).toBeNull();
  });

  it('records a decline with the decline label as the button', async () => {
    mocked.decline.mockResolvedValue({...RESULT, outcome: 'declined'});
    const {page, handlers} = await render({declineLabel: 'No thanks'});

    (page.root.querySelector('.cw-decline') as HTMLButtonElement).click();
    await page.waitForChanges();

    expect(mocked.decline.mock.calls[0][2].labels.button).toBe('No thanks');
    expect(handlers.declined).toHaveBeenCalledTimes(1);
  });

  it('stays usable and reports the error when saving fails', async () => {
    mocked.accept.mockRejectedValue(Object.assign(new Error('Request failed'), {response: {status: 400, data: {error: 'bad'}}}));
    const {page, handlers} = await render();
    await check(page, 0);
    await check(page, 1);

    acceptButton(page).click();
    await page.waitForChanges();

    expect(handlers.sdkError).toHaveBeenCalledTimes(1);
    expect(handlers.accepted).not.toHaveBeenCalled();
    expect(acceptDisabled(page)).toBe(false);
  });

  it('reports an error when the session cannot be loaded', async () => {
    mocked.getSession.mockRejectedValue(Object.assign(new Error('Unauthorized'), {response: {status: 401}}));
    const {page, handlers} = await render();

    expect(handlers.sdkError).toHaveBeenCalledTimes(1);
    expect(handlers.shown).not.toHaveBeenCalled();
    expect(page.root.querySelector('.cw-check')).toBeNull();
  });

  describe('inline mode', () => {
    beforeEach(() => mocked.getSession.mockResolvedValue(session({mode: 'inline'})));

    it('links each agreement name to its text in a dialog', async () => {
      const {page} = await render();
      expect(page.root.querySelector('.cw-overlay')).toBeNull();

      const links = page.root.querySelectorAll('.cw-link');
      expect(links[1].textContent).toBe('Privacy Policy');
      (links[1] as HTMLElement).click();
      await page.waitForChanges();

      expect(page.root.querySelector('.cw-dialog').textContent).toContain('The Privacy Policy text.');
    });

    it('keeps each agreement text in the presentation as hidden linked terms', async () => {
      mocked.accept.mockResolvedValue(RESULT);
      const {page} = await render();
      await check(page, 0);
      await check(page, 1);

      acceptButton(page).click();
      await page.waitForChanges();

      const {presentation} = mocked.accept.mock.calls[0][2];
      expect(presentation).toContain('<section data-verdocs-linked-terms hidden>');
      expect(presentation).toContain('The Terms of Service text.');
      expect(presentation).toContain('The Privacy Policy text.');
    });
  });
});
