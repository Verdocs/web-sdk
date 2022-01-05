import {newSpecPage} from '@stencil/core/testing';
import {VerdocsAuth} from '../verdocs-auth';

describe('verdocs-auth', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsAuth],
      html: '<verdocs-auth></verdocs-auth>',
    });
    expect(root).toEqualHtml(`
      <verdocs-auth>
        <mock:shadow-root>
          <div>
            <button class="arrow"></button>
            <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-auth>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [VerdocsAuth],
      html: `<verdocs-auth></verdocs-auth>`,
    });
    expect(root).toEqualHtml(`
      <verdocs-auth>
        <mock:shadow-root>
          <div>
             <button class="arrow"></button>
              <div class="items"></div>
          </div>
        </mock:shadow-root>
      </verdocs-auth>
    `);
  });
});
