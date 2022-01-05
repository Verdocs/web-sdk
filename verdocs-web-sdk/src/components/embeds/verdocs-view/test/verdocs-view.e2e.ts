import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-view></verdocs-view>');

    const element = await page.find('verdocs-view');
    expect(element).toHaveClass('hydrated');
  });
});
