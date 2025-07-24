import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldSignature } from './verdocs-field-signature';

describe('verdocs-field-signature', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldSignature],
      html: '<verdocs-field-signature></verdocs-field-signature>',
    });
    expect(page.root).toBeTruthy();
  });
});
