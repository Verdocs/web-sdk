import { newSpecPage } from '@stencil/core/testing';
import { VerdocsOtpDialog } from './verdocs-otp-dialog';

describe('verdocs-otp-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsOtpDialog],
      html: '<verdocs-otp-dialog></verdocs-otp-dialog>',
    });
    expect(page.root).toBeTruthy();
  });
});
