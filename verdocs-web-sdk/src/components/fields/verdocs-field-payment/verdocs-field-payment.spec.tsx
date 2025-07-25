import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFieldPayment } from './verdocs-field-payment';

describe('verdocs-field-payment', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldPayment],
      html: '<verdocs-field-payment></verdocs-field-payment>',
    });
    expect(page.root).toBeTruthy();
  });
});
