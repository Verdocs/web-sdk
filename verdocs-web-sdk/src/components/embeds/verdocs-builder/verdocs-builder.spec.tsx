import {newSpecPage} from '@stencil/core/testing';
import {VerdocsBuilder} from './verdocs-builder';

describe('verdocs-builder', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsBuilder],
      html: '<verdocs-builder></verdocs-builder>',
    });
    expect(page.root).toBeTruthy();
  });
});
