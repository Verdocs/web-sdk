import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateFields } from './verdocs-template-fields';

describe('verdocs-template-fields', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateFields],
      html: '<verdocs-template-fields></verdocs-template-fields>',
    });
    expect(page.root).toBeTruthy();
  });
});
