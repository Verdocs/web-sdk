import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeRecipientSummary } from './verdocs-envelope-recipient-summary';

describe('verdocs-envelope-recipient-summary', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeRecipientSummary],
      html: '<verdocs-envelope-recipient-summary></verdocs-envelope-recipient-summary>',
    });
    expect(page.root).toBeTruthy();
  });
});
