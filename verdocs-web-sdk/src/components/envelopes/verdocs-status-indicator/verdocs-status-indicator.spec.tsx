import { newSpecPage } from '@stencil/core/testing';
import { VerdocsStatusIndicator } from './verdocs-status-indicator';

describe('verdocs-status-indicator', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsStatusIndicator],
      html: '<verdocs-status-indicator></verdocs-status-indicator>',
    });
    expect(page.root).toBeTruthy();
  });
});
