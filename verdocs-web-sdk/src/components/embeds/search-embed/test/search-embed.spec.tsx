import { newSpecPage } from '@stencil/core/testing';
import { SearchEmbed } from '../search-embed';

describe('search-embed', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchEmbed],
      html: `<search-embed></search-embed>`,
    });
    expect(page.root).toEqualHtml(`
      <search-embed>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-embed>
    `);
  });
});
