import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateBuildTabs } from './verdocs-template-build-tabs';

describe('verdocs-template-build-tabs', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateBuildTabs],
      html: '<verdocs-template-build-tabs></verdocs-template-build-tabs>',
    });
    expect(page.root).toBeTruthy();
  });
});
