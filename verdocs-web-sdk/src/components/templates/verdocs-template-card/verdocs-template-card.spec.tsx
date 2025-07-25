import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateCard } from './verdocs-template-card';

describe('verdocs-template-card', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateCard],
      html: '<verdocs-template-card></verdocs-template-card>',
    });
    expect(page.root).toBeTruthy();
  });
});
