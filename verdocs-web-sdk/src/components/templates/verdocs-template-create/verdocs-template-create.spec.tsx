import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateCreate } from './verdocs-template-create';

describe('verdocs-template-create', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateCreate],
      html: '<verdocs-template-create></verdocs-template-create>',
    });
    expect(page.root).toBeTruthy();
  });
});
