import {newSpecPage} from '@stencil/core/testing';
import {VerdocsButton} from '../verdocs-button';

describe('verdocs-button', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsButton],
      html: '<verdocs-button></verdocs-button>',
    });
    expect(root).toEqualHtml(`
      <verdocs-button>
        <mock:shadow-root>
          <div>
            <button class="arrow"></button>
            <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-button>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button></verdocs-button>`,
    });
    expect(root).toEqualHtml(`
      <verdocs-button>
        <mock:shadow-root>
          <div>
             <button class="arrow"></button>
              <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-button>
    `);
  });
});
