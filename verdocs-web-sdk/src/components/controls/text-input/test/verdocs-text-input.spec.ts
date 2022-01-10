import {newSpecPage} from '@stencil/core/testing';
import {VerdocsTextInput} from '../verdocs-text-input';

describe('verdocs-text-input', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsTextInput],
      html: '<verdocs-text-input></verdocs-text-input>',
    });
    expect(root).toEqualHtml(`
      <verdocs-text-input>
        <mock:shadow-root>
          <div>
            <button class="arrow"></button>
            <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-text-input>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsTextInput],
      html: `<verdocs-text-input></verdocs-text-input>`,
    });
    expect(root).toEqualHtml(`
      <verdocs-text-input>
        <mock:shadow-root>
          <div>
             <button class="arrow"></button>
              <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-text-input>
    `);
  });
});
