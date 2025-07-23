import { newSpecPage } from '@stencil/core/testing';
import { VerdocsLoader } from './verdocs-loader';

describe('verdocs-loader', () => {
  it('renders correctly', async () => {
    const page = await newSpecPage({
      components: [VerdocsLoader],
      html: `<verdocs-loader></verdocs-loader>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
