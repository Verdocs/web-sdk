import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldRadio } from './verdocs-field-radio';

describe('verdocs-field-radio', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldRadio],
      html: '<verdocs-field-radio></verdocs-field-radio>',
    });
    expect(page.root).toBeTruthy();
  });
});
