import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldTextarea } from './verdocs-field-textarea';

describe('verdocs-field-textarea', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldTextarea],
      html: '<verdocs-field-textarea></verdocs-field-textarea>',
    });
    expect(page.root).toBeTruthy();
  });
});
