import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeRecipientLink } from './verdocs-envelope-recipient-link';

describe('verdocs-envelope-recipient-link', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeRecipientLink],
      html: '<verdocs-envelope-recipient-link></verdocs-envelope-recipient-link>',
    });
    expect(page.root).toBeTruthy();
  });
});
