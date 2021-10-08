import { newSpecPage } from '@stencil/core/testing';
import { SearchQuickFunctions } from '../search-quick-functions';

describe('search-quick-functions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchQuickFunctions],
      html: `<search-quick-functions></search-quick-functions>`,
    });
    expect(page.root).toEqualHtml(`
      <search-quick-functions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-quick-functions>
    `);
  });
});
