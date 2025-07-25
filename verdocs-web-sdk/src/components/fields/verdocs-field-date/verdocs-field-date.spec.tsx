import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldDate } from './verdocs-field-date';

describe('verdocs-field-date', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldDate],
      html: '<verdocs-field-date></verdocs-field-date>',
    });
    expect(page.root).toBeTruthy();
  });
});
