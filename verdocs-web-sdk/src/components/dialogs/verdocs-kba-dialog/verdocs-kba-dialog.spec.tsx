import IMask from 'imask';
import { newSpecPage } from '@stencil/core/testing';
import { VerdocsKbaDialog } from './verdocs-kba-dialog';

const mockIMask = IMask as unknown as jest.Mock;

describe('verdocs-kba-dialog', () => {
  beforeEach(() => mockIMask.mockReset().mockReturnValue({ destroy: jest.fn() }));

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsKbaDialog],
      html: '<verdocs-kba-dialog></verdocs-kba-dialog>',
    });
    expect(page.root).toBeTruthy();
  });

  it('masks nothing on steps without a date of birth input', async () => {
    await newSpecPage({ components: [VerdocsKbaDialog], html: '<verdocs-kba-dialog mode="choice"></verdocs-kba-dialog>' });
    expect(mockIMask).not.toHaveBeenCalled();
  });

  it('masks the date of birth input once across renders', async () => {
    const page = await newSpecPage({ components: [VerdocsKbaDialog], html: '<verdocs-kba-dialog mode="identity"></verdocs-kba-dialog>' });
    page.rootInstance.updatedRecipient = { ...page.rootInstance.updatedRecipient, dob: '01/02/1980' };
    await page.waitForChanges();

    expect(mockIMask).toHaveBeenCalledTimes(1);
  });

  it('removes the mask when the date of birth input goes away', async () => {
    const destroy = jest.fn();
    mockIMask.mockReturnValue({ destroy });
    const page = await newSpecPage({ components: [VerdocsKbaDialog], html: '<verdocs-kba-dialog mode="identity"></verdocs-kba-dialog>' });
    page.root.mode = 'choice';
    await page.waitForChanges();

    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
