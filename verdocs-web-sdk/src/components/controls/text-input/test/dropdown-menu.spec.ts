import {newSpecPage} from '@stencil/core/testing';
import {TextInput} from '../dropdown-menu';

describe('dropdown-menu', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [TextInput],
      html: '<dropdown-menu></dropdown-menu>',
    });
    expect(root).toEqualHtml(`
      <dropdown-menu>
        <mock:shadow-root>
          <div>
            <button class="arrow"></button>
            <div class="items"></div>
          </div>
        </mock:shadow-root>
      </dropdown-menu>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [TextInput],
      html: `<dropdown-menu></dropdown-menu>`,
    });
    expect(root).toEqualHtml(`
      <dropdown-menu>
        <mock:shadow-root>
          <div>
             <button class="arrow"></button>
              <div class="items"></div>
          </div>
        </mock:shadow-root>
      </dropdown-menu>
    `);
  });
});
