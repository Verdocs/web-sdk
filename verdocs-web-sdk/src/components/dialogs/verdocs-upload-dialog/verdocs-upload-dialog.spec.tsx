import { newSpecPage } from '@stencil/core/testing';
import { VerdocsUploadDialog } from './verdocs-upload-dialog';

describe('verdocs-upload-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsUploadDialog],
      html: '<verdocs-upload-dialog></verdocs-upload-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
