import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-auth', () => {
  it('renders a placeholder with no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-auth></verdocs-auth>');
    await page.compareScreenshot('Unauthenticated', {fullPage: false});
  });
});
