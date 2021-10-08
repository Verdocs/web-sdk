import { newSpecPage } from '@stencil/core/testing';
import { SearchTabs } from '../search-tabs';

describe('search-tabs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchTabs],
      html: `<search-tabs></search-tabs>`,
    });
    expect(page.root).toEqualHtml(`
      <search-tabs>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-tabs>
    `);
  });
});
