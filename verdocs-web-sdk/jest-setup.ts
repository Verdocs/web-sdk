// jest‑setup.ts
// @ts-nocheck

// 1) Stub out tinybase so import‑time store.delTables()/delValues() never crash:
jest.mock('tinybase', () => ({
  createStore: () => ({
    // utils/Datastore calls these:
    delTables:        () => {},
    delValues:        () => {},
    addRowListener:   jest.fn(() => 'rowListenerId'),
    addTableListener: jest.fn(() => 'tableListenerId'),
    removeRowListener:   jest.fn(),
    removeTableListener: jest.fn(),

    getRow:           () => ({}),
    subscribe:        jest.fn(),
    updateTemplate:   jest.fn(),
    getField:         jest.fn(() => [0, { required: false, placeholder: '', value: '', label: '' }]),
  }),
  Row: class {},
}));

// 2) Partially mock @verdocs/js‑sdk, but keep its helpers and replace only the network/store bits:
const actualSdk = jest.requireActual('@verdocs/js-sdk');

class FakeEndpoint {
  static getDefault() { return new FakeEndpoint(); }
  api = {
    get:  jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
    put:  jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
  };
  profile = {};
  session = {};
  loadSession() {}
  onSessionChanged() {}
  setTimeout() {}
  setBaseURL() {}
  getBaseURL() { return ''; }
  setToken() {}
  clearSession() {}
}

jest.mock('@verdocs/js-sdk', () => ({
  ...actualSdk,

  // swap in our fake endpoint with a working `.api`:
  VerdocsEndpoint: FakeEndpoint,

  // Stub data fetchers
  getEnvelope:                  jest.fn().mockResolvedValue({ documents: [], name: '' }),
  getTemplate:                  jest.fn().mockResolvedValue({ roles: [], documents: [] }),
  getEnvelopes:                 jest.fn().mockResolvedValue([]),
  getTemplates:                 jest.fn().mockResolvedValue([]),
  getDocumentDownloadLink:      jest.fn().mockResolvedValue(''),
  cancelEnvelope:               jest.fn().mockResolvedValue({}),
  integerSequence:              (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => s + i),
  userCanCancelEnvelope:        () => false,
  getRecipientsWithActions:     () => [],
  createTemplateRole:           jest.fn().mockResolvedValue({}),
  updateTemplateRole:           jest.fn().mockResolvedValue({}),

  // Stub auth calls
  authenticate:                 jest.fn().mockResolvedValue({ access_token: 'ACCESS' }),
  getMyUser:                    jest.fn().mockResolvedValue({ email_verified: true }),
  isMFARequired:                jest.fn((e: any) => e?.response?.status === 403 && e?.response?.data?.error === 'mfa_required' && typeof e?.response?.data?.mfa_token === 'string'),
  getMFAChallenge:              jest.fn((e: any) => (e?.response?.status === 403 && e?.response?.data?.error === 'mfa_required' ? e.response.data : null)),
  getSocialProviders:           jest.fn().mockResolvedValue({ google: false, microsoft: false }),
  getSocialLoginUrl:            jest.fn((_endpoint: any, provider: string, params: any) => `https://api.example.com/v2/oauth2/social/${provider}/start?return_uri=${encodeURIComponent(params.returnUri)}&code_challenge=${params.codeChallenge}&code_challenge_method=S256&state=${params.state}`),
  createCodeVerifier:           jest.fn(() => 'TESTVERIFIER'),
  createCodeChallenge:          jest.fn().mockResolvedValue('TESTCHALLENGE'),

  // leave helpers like randomString, formatFullName, etc., intact:
}));

// 3) Mock out any other libs you pull in:
jest.mock('imask',     () => ({ __esModule: true, default: jest.fn() }));
jest.mock('sortablejs',() => ({ __esModule: true, default: jest.fn().mockImplementation(() => ({ destroy: () => {}, option: () => {} })) }));

// 4) Polyfill any missing DOM globals:
global.ResizeObserver = class { observe(){}; unobserve(){}; disconnect(){}; };
global.FontFace       = class { constructor(_f,_s){}; load() { return Promise.resolve(this); } };
Object.defineProperty(document, 'fonts', { value: { add: jest.fn() }, writable: true });
