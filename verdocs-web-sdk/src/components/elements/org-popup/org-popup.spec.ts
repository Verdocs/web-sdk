import {newSpecPage} from '@stencil/core/testing';
import {OrgPopup} from './org-popup';

describe('org-popup', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [OrgPopup],
      html: '<org-popup></org-popup>',
    });
    expect(root).toEqualHtml(`
      <org-popup>
        <mock:shadow-root>
          <div></div>
        </mock:shadow-root>
      </org-popup>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [OrgPopup],
      html: `<org-popup organization={{ name: "Test" }}></org-popup>`,
    });
    expect(root).toEqualHtml(`
      <org-popup organization={{ name: "Test" }}>
        <mock:shadow-root>
          <div></div>
        </mock:shadow-root>
      </org-popup>
    `);
  });
});
