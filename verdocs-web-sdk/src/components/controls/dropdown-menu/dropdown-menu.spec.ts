import {newSpecPage} from '@stencil/core/testing';
import {DropdownMenu} from './dropdown-menu';

describe('dropdown-menu', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [DropdownMenu],
      html: '<dropdown-menu></dropdown-menu>',
    });
    expect(root).toEqualHtml(`
      <dropdown-menu>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </dropdown-menu>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [DropdownMenu],
      html: `<dropdown-menu first="Stencil" last="'Don't call me a framework' JS"></dropdown-menu>`,
    });
    expect(root).toEqualHtml(`
      <dropdown-menu first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </dropdown-menu>
    `);
  });
});
