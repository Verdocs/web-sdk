import {newSpecPage} from '@stencil/core/testing';
import {VerdocsSearch} from '../verdocs-search';

describe('verdocs-search', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsSearch],
      html: `<verdocs-search></verdocs-search>`,
    });
    expect(page.root).toEqualHtml(`
      <verdocs-search>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </verdocs-search>
    `);
  });
});
