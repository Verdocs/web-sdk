import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateTags } from './verdocs-template-tags';

describe('verdocs-template-tags', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateTags],
      html: '<verdocs-template-tags></verdocs-template-tags>',
    });
    expect(page.root).toBeTruthy();
  });
});
