import {newSpecPage} from '@stencil/core/testing';
import {VerdocsSign} from '../verdocs-sign';

describe('verdocs-sign', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsSign],
      html: `<verdocs-sign></verdocs-sign>`,
    });
    expect(page.root).toEqualHtml(`
      <verdocs-sign>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </verdocs-sign>
    `);
  });
});
