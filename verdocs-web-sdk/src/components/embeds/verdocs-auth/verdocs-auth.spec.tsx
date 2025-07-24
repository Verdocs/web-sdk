import { newSpecPage } from '@stencil/core/testing';
import { VerdocsAuth } from './verdocs-auth';

describe('verdocs-auth', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsAuth],
      html: '<verdocs-auth></verdocs-auth>',
    });
    expect(page.root).toBeTruthy();
  });
});
