import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateSettings } from './verdocs-template-settings';

describe('verdocs-template-settings', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateSettings],
      html: '<verdocs-template-settings></verdocs-template-settings>',
    });
    expect(page.root).toBeTruthy();
  });
});
