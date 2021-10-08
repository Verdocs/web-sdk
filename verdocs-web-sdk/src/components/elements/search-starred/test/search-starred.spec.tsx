import { newSpecPage } from '@stencil/core/testing';
import { SearchStarred } from '../search-starred';

describe('search-starred', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchStarred],
      html: `<search-starred></search-starred>`,
    });
    expect(page.root).toEqualHtml(`
      <search-starred>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-starred>
    `);
  });
});
