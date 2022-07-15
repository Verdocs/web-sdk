import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-quick-functions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-quick-functions></verdocs-quick-functions>');

    const element = await page.find('verdocs-quick-functions');
    expect(element).toHaveClass('hydrated');
  });
});
