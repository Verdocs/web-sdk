import {newSpecPage} from '@stencil/core/testing';
import {VerdocsIdScanDialog} from './verdocs-id-scan-dialog';

describe('verdocs-id-scan-dialog', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsIdScanDialog],
      html: '<verdocs-id-scan-dialog></verdocs-id-scan-dialog>',
    });
    expect(page.root).toBeTruthy();
  });

  it('asks for the front and back of a license', async () => {
    const page = await newSpecPage({
      components: [VerdocsIdScanDialog],
      html: '<verdocs-id-scan-dialog></verdocs-id-scan-dialog>',
    });
    expect(page.root.querySelectorAll('input[type="file"]').length).toBe(2);
  });

  it('adds a selfie when required', async () => {
    const page = await newSpecPage({
      components: [VerdocsIdScanDialog],
      html: '<verdocs-id-scan-dialog require-selfie="true"></verdocs-id-scan-dialog>',
    });
    const inputs = page.root.querySelectorAll('input[type="file"]');
    expect(inputs.length).toBe(3);
    expect(inputs[2].getAttribute('capture')).toBe('user');
  });
});
