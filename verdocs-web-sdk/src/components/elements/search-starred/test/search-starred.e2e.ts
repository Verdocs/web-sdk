import { newE2EPage } from '@stencil/core/testing';

describe('search-starred', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<search-starred></search-starred>');

    const element = await page.find('search-starred');
    expect(element).toHaveClass('hydrated');
  });
});
