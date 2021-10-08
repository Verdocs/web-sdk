import { newSpecPage } from '@stencil/core/testing';
import { SearchRecent } from '../search-recent';

describe('search-recent', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchRecent],
      html: `<search-recent></search-recent>`,
    });
    expect(page.root).toEqualHtml(`
      <search-recent>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-recent>
    `);
  });
});
