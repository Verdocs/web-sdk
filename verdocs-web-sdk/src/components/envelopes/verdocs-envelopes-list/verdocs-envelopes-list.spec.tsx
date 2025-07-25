import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopesList } from './verdocs-envelopes-list';

describe('verdocs-envelopes-list', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopesList],
      html: '<verdocs-envelopes-list></verdocs-envelopes-list>',
    });
    expect(page.root).toBeTruthy();
  });
});
