import { newSpecPage } from '@stencil/core/testing';
import { VerdocsDialog } from './verdocs-dialog';

describe('verdocs-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsDialog],
      html: '<verdocs-dialog></verdocs-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
