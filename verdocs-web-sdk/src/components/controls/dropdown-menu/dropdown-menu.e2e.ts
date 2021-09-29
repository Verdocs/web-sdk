import {newE2EPage} from '@stencil/core/testing';

describe('dropdown-menu', () => {
  it('renders a placeholder with no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<dropdown-menu></dropdown-menu>');
    await page.compareScreenshot('Closed', {fullPage: false});
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<dropdown-menu open></dropdown-menu>');
    const component = await page.find('dropdown-menu');
    component.setProperty('options', [{label: 'Test'}]);

    await page.waitForChanges();

    const results = await page.compareScreenshot('Opened', {fullPage: false});
    expect(results).toMatchScreenshot({allowableMismatchedRatio: 0.05});
  });
});
