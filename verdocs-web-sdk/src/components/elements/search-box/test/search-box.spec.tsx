import { newSpecPage } from '@stencil/core/testing';
import { SearchBox } from '../search-box';

describe('search-box', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SearchBox],
      html: `<search-box></search-box>`,
    });
    expect(page.root).toEqualHtml(`
      <search-box>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </search-box>
    `);
  });
});
