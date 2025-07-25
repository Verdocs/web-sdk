import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeDocumentPage } from './verdocs-envelope-document-page';

describe('verdocs-envelope-document-page', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeDocumentPage],
      html: '<verdocs-envelope-document-page></verdocs-envelope-document-page>',
    });
    expect(page.root).toBeTruthy();
  });
});
