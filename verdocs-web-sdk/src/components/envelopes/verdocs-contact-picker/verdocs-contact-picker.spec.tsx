import { newSpecPage } from '@stencil/core/testing';
import { VerdocsContactPicker } from './verdocs-contact-picker';

describe('verdocs-contact-picker', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsContactPicker],
      html: '<verdocs-contact-picker></verdocs-contact-picker>',
    });
    expect(page.root).toBeTruthy();
  });
});
