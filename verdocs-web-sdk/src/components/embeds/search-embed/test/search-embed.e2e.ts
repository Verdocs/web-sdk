import { newE2EPage } from '@stencil/core/testing';

describe('search-embed', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-embed></search-embed>');

    const element = await page.find('search-embed');
    expect(element).toHaveClass('hydrated');
  });
});
