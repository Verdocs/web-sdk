import { newSpecPage } from '@stencil/core/testing';
import { VerdocsBuild } from './verdocs-build';

describe('verdocs-build', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsBuild],
      html: '<verdocs-build></verdocs-build>',
    });
    expect(page.root).toBeTruthy();
  });
});
