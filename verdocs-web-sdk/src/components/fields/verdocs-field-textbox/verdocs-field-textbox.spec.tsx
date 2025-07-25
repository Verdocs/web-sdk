import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldTextbox } from './verdocs-field-textbox';

describe('verdocs-field-textbox', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldTextbox],
      html: '<verdocs-field-textbox></verdocs-field-textbox>',
    });
    expect(page.root).toBeTruthy();
  });
});
