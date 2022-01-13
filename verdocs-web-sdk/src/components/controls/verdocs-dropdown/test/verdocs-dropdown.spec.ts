import {newSpecPage} from '@stencil/core/testing';
import {VerdocsDropdown} from '../verdocs-dropdown';

describe('verdocs-dropdown', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsDropdown],
      html: '<verdocs-dropdown></verdocs-dropdown>',
    });
    expect(root).toEqualHtml(`
      <verdocs-dropdown>
        <mock:shadow-root>
          <div>
            <button class="arrow"></button>
            <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-dropdown>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsDropdown],
      html: `<verdocs-dropdown></verdocs-dropdown>`,
    });
    expect(root).toEqualHtml(`
      <verdocs-dropdown>
        <mock:shadow-root>
          <div>
             <button class="arrow"></button>
              <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-dropdown>
    `);
  });
});
