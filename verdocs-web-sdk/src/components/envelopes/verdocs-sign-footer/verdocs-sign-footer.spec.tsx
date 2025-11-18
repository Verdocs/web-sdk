import {newSpecPage} from '@stencil/core/testing';
import {VerdocsSignFooter} from './verdocs-sign-footer';

describe('verdocs-sign-footer', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSignFooter],
      html: '<verdocs-sign-footer></verdocs-sign-footer>',
    });
    expect(page.root).toBeTruthy();
  });
});
