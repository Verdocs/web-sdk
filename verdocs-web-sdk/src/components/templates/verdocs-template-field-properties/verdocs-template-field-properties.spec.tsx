import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateFieldProperties } from './verdocs-template-field-properties';

describe('verdocs-template-field-properties', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateFieldProperties],
      html: '<verdocs-template-field-properties></verdocs-template-field-properties>',
    });
    expect(page.root).toBeTruthy();
  });
});
