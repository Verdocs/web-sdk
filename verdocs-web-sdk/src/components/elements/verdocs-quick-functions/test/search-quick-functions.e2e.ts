import { newE2EPage } from '@stencil/core/testing';

describe('search-quick-functions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-quick-functions></search-quick-functions>');

    const element = await page.find('search-quick-functions');
    expect(element).toHaveClass('hydrated');
  });
});
