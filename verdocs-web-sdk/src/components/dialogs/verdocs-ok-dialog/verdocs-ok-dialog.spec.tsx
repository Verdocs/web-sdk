import { newSpecPage } from '@stencil/core/testing';
import { VerdocsOkDialog } from './verdocs-ok-dialog';

describe('verdocs-ok-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsOkDialog],
      html: '<verdocs-ok-dialog></verdocs-ok-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
