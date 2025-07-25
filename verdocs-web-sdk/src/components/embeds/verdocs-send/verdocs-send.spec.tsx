import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSend } from './verdocs-send';

describe('verdocs-send', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSend],
      html: '<verdocs-send></verdocs-send>',
    });
    expect(page.root).toBeTruthy();
  });
});
