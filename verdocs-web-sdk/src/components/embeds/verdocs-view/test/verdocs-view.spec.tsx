// verdocs-view.spec.tsx

/**
 * Prevent Jest from importing the real tinybase (which uses un‑transpiled ESM "export" syntax
 * and calls store.delTables/delValues() on import).
 */
jest.mock('tinybase', () => ({
  createStore: () => ({
    // stub out the reset calls
    delTables: () => {},
    delValues: () => {},
  }),
  Row: class {},
}));

/**
 * And you'll probably still need to mock your SDK imports:
 */
jest.mock('@verdocs/js-sdk', () => ({
  getEnvelope: jest.fn().mockResolvedValue(null),
  getDocumentDownloadLink: jest.fn(),
  cancelEnvelope: jest.fn(),
  integerSequence: () => [],
  userCanCancelEnvelope: () => false,
  VerdocsEndpoint: { getDefault: () => ({ loadSession: jest.fn(), profile: {} }) },
}));

import { newSpecPage } from '@stencil/core/testing';
import { VerdocsView } from '../verdocs-view';

describe('verdocs-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsView],
      // must be a string, not JSX!
      html: `<verdocs-view></verdocs-view>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
