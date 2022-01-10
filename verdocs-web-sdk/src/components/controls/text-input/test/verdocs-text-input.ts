import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-text-input', () => {
  it('renders a placeholder with no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-text-input></verdocs-text-input>');
    await page.compareScreenshot('Closed', {fullPage: false});
  });
});
