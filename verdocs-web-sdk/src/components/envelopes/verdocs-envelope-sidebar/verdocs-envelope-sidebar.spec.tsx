import { newSpecPage } from '@stencil/core/testing';
import { VerdocsEnvelopeSidebar } from './verdocs-envelope-sidebar';

describe('verdocs-envelope-sidebar', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsEnvelopeSidebar],
      html: '<verdocs-envelope-sidebar></verdocs-envelope-sidebar>',
    });
    expect(page.root).toBeTruthy();
  });
});
