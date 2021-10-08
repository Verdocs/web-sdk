import { newE2EPage } from '@stencil/core/testing';

describe('search-saved', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-saved></search-saved>');

    const element = await page.find('search-saved');
    expect(element).toHaveClass('hydrated');
  });
});
