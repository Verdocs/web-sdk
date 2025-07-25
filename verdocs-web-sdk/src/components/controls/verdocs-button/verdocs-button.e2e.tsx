import { newE2EPage,E2EPage } from '@stencil/core/testing';

it('verdocs-button visual diff test', async () => {
  const page: E2EPage = await newE2EPage();
  await page.setContent('<verdocs-button></verdocs-button>');
  await page.compareScreenshot('Comparing visual diff for verdocs-button', {fullPage: false});
});
