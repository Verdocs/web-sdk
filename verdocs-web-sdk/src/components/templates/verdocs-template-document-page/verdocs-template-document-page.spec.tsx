import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateDocumentPage } from './verdocs-template-document-page';

describe('verdocs-template-document-page', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateDocumentPage],
      html: '<verdocs-template-document-page></verdocs-template-document-page>',
    });
    expect(page.root).toBeTruthy();
  });
});
