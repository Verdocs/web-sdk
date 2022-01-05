import {newE2EPage} from '@stencil/core/testing';

describe('fill-and-sign', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fill-and-sign></fill-and-sign>');

    const element = await page.find('fill-and-sign');
    expect(element).toHaveClass('hydrated');
  });
});
