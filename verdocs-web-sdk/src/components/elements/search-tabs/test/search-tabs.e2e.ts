import { newE2EPage } from '@stencil/core/testing';

describe('search-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-tabs></search-tabs>');

    const element = await page.find('search-tabs');
    expect(element).toHaveClass('hydrated');
  });
});
