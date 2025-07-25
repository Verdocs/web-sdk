import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplatesList } from './verdocs-templates-list';

describe('verdocs-templates-list', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplatesList],
      html: '<verdocs-templates-list></verdocs-templates-list>',
    });
    expect(page.root).toBeTruthy();
  });
});
