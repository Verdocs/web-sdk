import { newSpecPage } from '@stencil/core/testing';
import { VerdocsDisclosureDialog } from './verdocs-disclosure-dialog';

describe('verdocs-disclosure-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsDisclosureDialog],
      html: '<verdocs-disclosure-dialog></verdocs-disclosure-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
