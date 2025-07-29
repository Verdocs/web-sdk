import { newSpecPage } from '@stencil/core/testing';
import { VerdocsDelegateDialog } from './verdocs-delegate-dialog';

describe('verdocs-delegate-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsDelegateDialog],
      html: '<verdocs-delegate-dialog></verdocs-delegate-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
