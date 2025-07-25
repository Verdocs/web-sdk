import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSign } from './verdocs-sign';

describe('verdocs-sign', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsSign],
      html: '<verdocs-sign></verdocs-sign>',
    });
    expect(page.root).toBeTruthy();
  });
});
