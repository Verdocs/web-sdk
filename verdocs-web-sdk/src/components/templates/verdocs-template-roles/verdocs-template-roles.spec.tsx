import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateRoles } from './verdocs-template-roles';
import { h } from '@stencil/core';

jest.mock('tinybase', () => ({
  createStore: () => ({
    // stub out the reset calls
    delTables: () => {},
    delValues: () => {},
  }),
  Row: class {},
}));

jest.mock('@verdocs/js-sdk', () => ({
  getEnvelope: jest.fn().mockResolvedValue(null),
  getDocumentDownloadLink: jest.fn(),
  cancelEnvelope: jest.fn(),
  integerSequence: () => [],
  userCanCancelEnvelope: () => false,
  VerdocsEndpoint: { getDefault: () => ({ loadSession: jest.fn(), profile: {} }) },
}));

describe('verdocs-template-roles', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateRoles],
      template: () => <verdocs-template-roles></verdocs-template-roles>,
    });
    expect(page.root).toBeTruthy();
  });
});
