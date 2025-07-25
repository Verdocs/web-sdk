import { newSpecPage } from '@stencil/core/testing';
import { VerdocsInitialDialog } from './verdocs-initial-dialog';

describe('verdocs-initial-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsInitialDialog],
      html: '<verdocs-initial-dialog></verdocs-initial-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
