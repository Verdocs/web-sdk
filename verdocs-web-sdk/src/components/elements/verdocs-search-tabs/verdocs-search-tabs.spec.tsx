import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSearchTabs } from './verdocs-search-tabs';

describe('verdocs-search-tabs', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSearchTabs],
      html: '<verdocs-search-tabs></verdocs-search-tabs>',
    });
    expect(page.root).toBeTruthy();
  });
});
