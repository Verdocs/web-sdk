import { newSpecPage } from '@stencil/core/testing';
import { VerdocsKbaDialog } from './verdocs-kba-dialog';

describe('verdocs-kba-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsKbaDialog],
      html: '<verdocs-kba-dialog></verdocs-kba-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
