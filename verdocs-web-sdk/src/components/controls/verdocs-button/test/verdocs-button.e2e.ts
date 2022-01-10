import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-button', () => {
  it('renders a placeholder with no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-button></verdocs-button>');
    await page.compareScreenshot('Closed', {fullPage: false});
  });
});
