import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateAttachments } from './verdocs-template-attachments';

describe('verdocs-template-attachments', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateAttachments],
      html: '<verdocs-template-attachments></verdocs-template-attachments>',
    });
    expect(page.root).toBeTruthy();
  });
});
