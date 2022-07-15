import {newSpecPage} from '@stencil/core/testing';
import {VerdocsQuickFunctions} from '../verdocs-quick-functions';

describe('search-quick-functions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFunctions],
      html: `<verdocs-quick-functions></verdocs-quick-functions>`,
    });
    expect(page.root).toEqualHtml(`
      <verdocs-quick-functions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </verdocs-quick-functions>
    `);
  });
});
