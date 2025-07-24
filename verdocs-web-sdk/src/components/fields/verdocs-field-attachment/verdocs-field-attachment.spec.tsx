import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldAttachment } from './verdocs-field-attachment';

describe('verdocs-field-attachment', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldAttachment],
      html: '<verdocs-field-attachment></verdocs-field-attachment>',
    });
    expect(page.root).toBeTruthy();
  });
});
