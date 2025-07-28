import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldTimestamp } from './verdocs-field-timestamp';

describe('verdocs-field-timestamp', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldTimestamp],
      html: '<verdocs-field-timestamp></verdocs-field-timestamp>',
    });
    expect(page.root).toBeTruthy();
  });
});
