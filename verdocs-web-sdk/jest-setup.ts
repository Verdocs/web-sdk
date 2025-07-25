// jest‑setup.ts
// @ts-nocheck

// 1) Stub out tinybase so import‑time store.delTables()/delValues() never crash:
jest.mock('tinybase', () => ({
  createStore: () => ({
    // the exact methods that utils/Datastore calls:
    delTables:        () => {},
    delValues:        () => {},
    addRowListener:   jest.fn(() => 'rowListenerId'),
    addTableListener: jest.fn(() => 'tableListenerId'),
    removeRowListener:   jest.fn(),
    removeTableListener: jest.fn(),

    // anything else your code uses:
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
}

jest.mock('@verdocs/js-sdk', () => ({
  ...actualSdk,

  // swap in our fake endpoint with a working `.api`:
  VerdocsEndpoint: FakeEndpoint,

  // stub out all the data‑fetchers so they never hit your real back end:
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

  // leave helpers like randomString, formatFullName, etc., intact:
}));

// 3) Mock out any other libs you pull in:
jest.mock('imask',     () => ({ __esModule: true, default: jest.fn() }));
jest.mock('sortablejs',() => ({ __esModule: true, default: jest.fn().mockImplementation(() => ({ destroy: () => {}, option: () => {} })) }));

// 4) Polyfill any missing DOM globals:
global.ResizeObserver = class { observe(){}; unobserve(){}; disconnect(){}; };
global.FontFace       = class { constructor(_f,_s){}; load() { return Promise.resolve(this); } };
Object.defineProperty(document, 'fonts', { value: { add: jest.fn() }, writable: true });

// 5) Prevent real HTTP in your Unleash helper:
jest.mock('axios', () => ({ get: jest.fn().mockResolvedValue({ data: {} }) }));
