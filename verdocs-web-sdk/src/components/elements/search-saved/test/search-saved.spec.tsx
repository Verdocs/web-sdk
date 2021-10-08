import { newSpecPage } from '@stencil/core/testing';
import { SearchSaved } from '../search-saved';

describe('search-saved', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchSaved],
      html: `<search-saved></search-saved>`,
    });
    expect(page.root).toEqualHtml(`
      <search-saved>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-saved>
    `);
  });
});
