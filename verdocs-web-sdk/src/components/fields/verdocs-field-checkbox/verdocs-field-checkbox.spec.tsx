import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldCheckbox } from './verdocs-field-checkbox';

describe('verdocs-field-checkbox', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldCheckbox],
      html: '<verdocs-field-checkbox></verdocs-field-checkbox>',
    });
    expect(page.root).toBeTruthy();
  });
});
