import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldDropdown } from './verdocs-field-dropdown';

describe('verdocs-field-dropdown', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldDropdown],
      html: '<verdocs-field-dropdown></verdocs-field-dropdown>',
    });
    expect(page.root).toBeTruthy();
  });
});
