import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeUpdateRecipient } from './verdocs-envelope-update-recipient';

describe('verdocs-envelope-update-recipient', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeUpdateRecipient],
      html: '<verdocs-envelope-update-recipient></verdocs-envelope-update-recipient>',
    });
    expect(page.root).toBeTruthy();
  });
});
