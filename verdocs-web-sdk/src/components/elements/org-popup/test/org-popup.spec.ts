import {newSpecPage} from '@stencil/core/testing';
import {OrgPopup} from '../org-popup';

describe('org-popup', () => {
  it('renders', async () => {
    const {root} = await newSpecPage({
      components: [OrgPopup],
      html: '<org-popup></org-popup>',
    });
    expect(root).toEqualHtml(`
      <org-popup>
        <mock:shadow-root>
          <div class="container">
            <span class="icon"></span>
            <span class="content"></span>
            <div class="popup">
              <div class="popup-header">
                <span class="status"></span>
                <span class="title"></span>
              </div>
              <div class="popup-body">
                <span class="joined"><b>Joined</b></span>
                <span class="followers"><b>Followers</b></span>
                <span class="website"><b>Website</b></span>
                <span class="templates"><b>Templates</b></span>
                <span></span>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </org-popup>
    `);
  });

  it('renders with values', async () => {
    const {root} = await newSpecPage({
      components: [OrgPopup],
      html: `<org-popup 
                organization={{ name: 'Acme Organization', created_at: '2014', followers: '123', website: 'www.acmeorganization.com', templates: '9' }></org-popup>`,
    });
    expect(root).toEqualHtml(`
      <org-popup organization={{ name: "Test" }}>
        <mock:shadow-root>
          <div class="container">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff"><rect fill="none" height="24" width="24"></rect><g><path d="M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1C4.76,14.04,4.39,14,4,14 c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2 c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85C21.93,14.21,20.99,14,20,14 c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M16.24,13.65c-1.17-0.52-2.61-0.9-4.24-0.9 c-1.63,0-3.07,0.39-4.24,0.9C6.68,14.13,6,15.21,6,16.39V18h12v-1.61C18,15.21,17.32,14.13,16.24,13.65z M8.07,16 c0.09-0.23,0.13-0.39,0.91-0.69c0.97-0.38,1.99-0.56,3.02-0.56s2.05,0.18,3.02,0.56c0.77,0.3,0.81,0.46,0.91,0.69H8.07z M12,8 c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,8,12,8 M12,6c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3 C15,7.34,13.66,6,12,6L12,6z"></path></g></svg>
            </span>
            <span class="content">Acme Organization</span>
            <div class="popup">
              <div class="popup-header">
                <span class="status"></span>
                <span class="title">Acme Organization</span>
              </div>
              <div class="popup-body">
                <span class="joined"><b>Joined</b> 2014</span>
                <span class="followers"><b>Followers</b> 123</span>
                <span class="website"><b>Website</b></span>
                <span class="templates"><b>Templates</b> 9</span>
                <span>www.acmeorganization.com</span>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </org-popup>
    `);
  });
});