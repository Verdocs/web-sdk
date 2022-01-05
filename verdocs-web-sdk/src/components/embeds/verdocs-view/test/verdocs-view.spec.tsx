import {newSpecPage} from '@stencil/core/testing';
import {VerdocsView} from '../verdocs-view';

describe('pdf-viewer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VerdocsView],
      html: `<verdocs-view></verdocs-view>`,
    });
    expect(page.root).toEqualHtml(`
      <verdocs-view>
        <mock:shadow-root>
           <div id="pdf-container"></div>
        </mock:shadow-root>
      </verdocs-view>
    `);
  });
});
