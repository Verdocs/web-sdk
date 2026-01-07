import {newSpecPage} from '@stencil/core/testing';
import {VerdocsAdoptSignatureDialog} from './verdocs-adopt-signature-dialog';

describe('verdocs-adopt-signature-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsAdoptSignatureDialog],
      html: '<verdocs-adopt-signature-dialog></verdocs-adopt-signature-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
