import { newSpecPage } from '@stencil/core/testing';
import { VerdocsPreview } from './verdocs-preview';

describe('verdocs-preview', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsPreview],
      html: '<verdocs-preview></verdocs-preview>',
    });
    expect(page.root).toBeTruthy();
  });
});
