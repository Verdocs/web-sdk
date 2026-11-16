import {html} from 'lit';
import {keyed} from 'lit/directives/keyed.js';
import {Meta} from '@storybook/web-components-vite';
import {IClickwrapPublicSession, IClickwrapSessionAgreement, VerdocsEndpoint} from '@verdocs/js-sdk';
import {API_URL, loadStoryDefaults} from '../utils';

// The api a pasted token goes to: STORYBOOK_API_URL from storybook/.env.local when it's set, stage otherwise
const API_URLS = [...new Set([API_URL, 'http://localhost:3000', 'https://stage-api.verdocs.com', 'https://api.verdocs.com'].filter(Boolean))];

// With no token, the story runs against a mock endpoint, so it works without an api or a real session. Paste a token
// from POST /v2/clickwraps/session to run against a real api instead.

const MOCK_TOKEN = 'vd_cw_mock-token';

const paragraph = (topic: string, n: number) =>
  `<p>${topic} ${n}. This sample text stands in for real agreement content. It runs long enough that the terms box ` +
  `has to scroll, so you can try the require-scroll setting and watch the scrolled_to_end event fire. Real content ` +
  `is sanitized HTML: headings, paragraphs, lists, links, bold, italic, underline, and line breaks.</p>`;

const SAMPLE_AGREEMENTS: IClickwrapSessionAgreement[] = [
  {
    key: 'terms',
    name: 'Terms of Service',
    version_id: 'mock-version-terms-3',
    number: 3,
    content:
      '<h3>1. Using the service</h3>' +
      [1, 2, 3].map(n => paragraph('Service clause', n)).join('') +
      '<h3>2. Your account</h3>' +
      '<ul><li>Keep your login details private.</li><li>Tell us if someone else uses your account.</li></ul>' +
      [4, 5].map(n => paragraph('Account clause', n)).join('') +
      '<p>Questions? Write to <a href="mailto:support@example.com">support@example.com</a>.</p>',
  },
  {
    key: 'privacy',
    name: 'Privacy Policy',
    version_id: 'mock-version-privacy-1',
    number: 1,
    content:
      '<h3>What we collect</h3>' +
      [1, 2].map(n => paragraph('Privacy clause', n)).join('') +
      '<h3>How we use it</h3>' +
      [3, 4].map(n => paragraph('Privacy clause', n)).join(''),
  },
];

// The override controls rewrite the session before the component sees it, whether it came from the mock or a real api.
// "session" keeps the session's own value.
const applyOverrides = (session: IClickwrapPublicSession, args: any): IClickwrapPublicSession => ({
  ...session,
  mode: args.mode === 'session' ? session.mode : args.mode,
  require_scroll: args.requireScroll === 'session' ? session.require_scroll : args.requireScroll === 'on',
  agreements: args.agreements === 'first' ? session.agreements.slice(0, 1) : session.agreements,
  brand: args.brandColor
    ? {...(session.brand || {name: 'Sample brand', full_logo_url: null, thumbnail_url: null}), primary_color: args.brandColor, secondary_color: args.brandColor}
    : session.brand,
});

const isSessionRequest = (config: any) => (config.method || 'get').toLowerCase() === 'get' && (config.url || '').replace(/^\/v2/, '') === '/clickwraps/session';

// A real api, with the overrides applied to the session it returns
const liveEndpoint = (args: any) => {
  const endpoint = new VerdocsEndpoint({baseURL: args.baseURL, persist: false});
  endpoint.api.interceptors.response.use(response => {
    if (isSessionRequest(response.config)) {
      response.data = applyOverrides(response.data, args);
    }
    return response;
  });
  return endpoint;
};

// An endpoint whose requests never leave the browser: axios hands each request to this adapter instead of the network
const mockEndpoint = (args: any) => {
  const endpoint = new VerdocsEndpoint({baseURL: 'https://mock.verdocs.invalid', persist: false});

  const session = applyOverrides(
    {
      id: 'mock-session',
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      mode: 'modal',
      require_scroll: false,
      agreements: SAMPLE_AGREEMENTS,
      brand: null,
    },
    args,
  );

  endpoint.api.defaults.adapter = async config => {
    const url = (config.url || '').replace(/^\/v2/, '');
    const method = (config.method || 'get').toUpperCase();
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    args.apiCall?.({method, url, body});

    // A short pause so the buttons' disabled state shows while a save is in flight
    await new Promise(resolve => setTimeout(resolve, 400));

    const reply = (status: number, data: any) => {
      const response = {data, status, statusText: String(status), headers: {}, config};
      if (status >= 400) {
        throw Object.assign(new Error(`Request failed with status code ${status}`), {response, config, isAxiosError: true});
      }
      return response;
    };

    if (isSessionRequest(config)) {
      return reply(200, session);
    }

    if (method === 'POST' && url === '/clickwraps/session/events') {
      return reply(204, '');
    }

    const outcome = {'/clickwraps/session/accept': 'accepted', '/clickwraps/session/decline': 'declined'}[url];
    if (method === 'POST' && outcome) {
      if (args.failSave) {
        return reply(500, {error: 'Mock save failure. Turn off failSave and try again.'});
      }
      return reply(200, {acceptance_id: `mock-acceptance-${Date.now()}`, outcome, created_at: new Date().toISOString()});
    }

    return reply(404, {error: `No mock for ${method} ${url}`});
  };

  return endpoint;
};

// The component reads its endpoint and token once, when it loads. So the controls that change the session (the token
// and api, the overrides, or failSave) mount a fresh component under a new key, and the label controls just update the
// mounted one. The endpoint is cached per key so a label change doesn't hand the component a new one.
let mounted = {key: '', endpoint: null as VerdocsEndpoint | null};

const sessionFor = (args: any) => {
  const token = (args.token || '').trim();
  const overrides = `${args.mode}|${args.requireScroll}|${args.agreements}|${args.brandColor}`;
  const key = token ? `live|${args.baseURL}|${token}|${overrides}` : `mock|${overrides}|${args.failSave}`;

  if (mounted.key !== key) {
    mounted = {key, endpoint: token ? liveEndpoint(args) : mockEndpoint(args)};
  }

  return {key, token: token || MOCK_TOKEN, endpoint: mounted.endpoint};
};

// Remembered between visits, like the other embeds
const defaults = {
  token: '',
  baseURL: API_URL || 'https://stage-api.verdocs.com',
  mode: 'session',
  failSave: false,
  heading: 'Please review and accept',
  acceptLabel: 'Agree and continue',
  declineLabel: 'Decline',
  checkboxLabel: 'I have read and agree to the {name}',
};

// Not remembered: every visit starts with the session's own values
const overrideDefaults = {
  requireScroll: 'session',
  agreements: 'all',
  brandColor: '',
};

const OVERRIDE_NOTE =
  'With a real token this only changes what the component shows; the api still holds the real session, so an accept that no longer matches it may be refused.';

export default {
  title: 'Embeds/Clickwrap',
  component: 'verdocs-clickwrap',
  args: {...loadStoryDefaults('embeds-clickwrap', defaults), ...overrideDefaults},
  argTypes: {
    token: {
      control: 'text',
      description: 'Leave empty to use the mock api. Or paste a vd_cw_ token from POST /v2/clickwraps/session (it lasts one hour and works once).',
    },
    baseURL: {
      control: 'select',
      options: API_URLS,
      description: 'The api a pasted token is sent to. Defaults to STORYBOOK_API_URL from storybook/.env.local.',
    },
    mode: {
      control: 'select',
      options: ['session', 'modal', 'inline'],
      description: `Modal shows the terms in a dialog; inline shows checkboxes that link to them. "session" keeps the session's mode (modal for the mock). ${OVERRIDE_NOTE}`,
    },
    requireScroll: {
      control: 'select',
      options: ['session', 'on', 'off'],
      description: `On locks the checkboxes until the person scrolls to the end of the terms. "session" keeps the session's setting (off for the mock). ${OVERRIDE_NOTE}`,
    },
    agreements: {
      control: 'select',
      options: ['all', 'first'],
      description: `Show every agreement in the session, or only the first. ${OVERRIDE_NOTE}`,
    },
    brandColor: {
      control: 'color',
      description: `The brand's primary color. Empty keeps the session's brand. Ignored when the page already sets --verdocs-primary-color (the Overrides theme does). ${OVERRIDE_NOTE}`,
    },
    failSave: {control: 'boolean', description: 'Mock only. Accept and decline fail with a 500, to see the error path.'},
    heading: {control: 'text', description: 'Shown above the terms in modal mode.'},
    acceptLabel: {control: 'text', description: 'Keep "agree" or "accept" in it; the component warns in the console otherwise.'},
    declineLabel: {control: 'text'},
    checkboxLabel: {
      control: 'text',
      description: '{name} becomes the agreement name. In inline mode, the text from {name} to the end is a link to the full terms.',
    },
    current: {action: 'current', table: {disable: true}},
    shown: {action: 'shown', table: {disable: true}},
    accepted: {action: 'accepted', table: {disable: true}},
    declined: {action: 'declined', table: {disable: true}},
    sdkError: {action: 'sdkError', table: {disable: true}},
    apiCall: {action: 'api call', table: {disable: true}},
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

// The transform makes this box the containing block for the modal's fixed overlay, so the overlay covers the story
// frame instead of the whole docs page. That lets the story render inline, where the controls can update it.
export const Clickwrap = (args: any) => {
  const {key, token, endpoint} = sessionFor(args);

  return html`
    <div style="position: relative; height: 680px; overflow: hidden; transform: translateZ(0); background: #f8faff;">
      <div style="padding: 24px; max-width: 520px;">
        ${keyed(
          key,
          html`<verdocs-clickwrap
            .endpoint=${endpoint}
            .token=${token}
            .heading=${args.heading}
            .acceptLabel=${args.acceptLabel}
            .declineLabel=${args.declineLabel}
            .checkboxLabel=${args.checkboxLabel}
            @current=${args.current}
            @shown=${args.shown}
            @accepted=${args.accepted}
            @declined=${args.declined}
            @sdkError=${args.sdkError}
          ></verdocs-clickwrap>`,
        )}
      </div>
    </div>
  `;
};
