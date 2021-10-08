import { newE2EPage } from '@stencil/core/testing';

describe('search-recent', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-recent></search-recent>');

    const element = await page.find('search-recent');
    expect(element).toHaveClass('hydrated');
  });
});
