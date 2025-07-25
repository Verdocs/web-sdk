import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSearchBox } from './verdocs-search-box';

describe('verdocs-search-box', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSearchBox],
      html: '<verdocs-search-box></verdocs-search-box>',
    });
    expect(page.root).toBeTruthy();
  });
});
