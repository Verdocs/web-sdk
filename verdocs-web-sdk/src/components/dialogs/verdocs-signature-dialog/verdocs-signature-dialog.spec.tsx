import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSignatureDialog } from './verdocs-signature-dialog';

describe('verdocs-signature-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSignatureDialog],
      html: '<verdocs-signature-dialog></verdocs-signature-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
