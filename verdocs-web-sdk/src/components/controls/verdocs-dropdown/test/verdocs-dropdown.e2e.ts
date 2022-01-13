import {newE2EPage} from '@stencil/core/testing';

describe('verdocs-dropdown', () => {
  it('renders a placeholder with no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<verdocs-dropdown></verdocs-dropdown>');
    await page.compareScreenshot('Closed', {fullPage: false});
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<verdocs-dropdown open></verdocs-dropdown>');
    const component = await page.find('verdocs-dropdown');
    component.setProperty('options', [{label: 'Test 1'}, {label: 'Test Disabled', disabled: true}, {label: 'Test 2'}]);

    await page.waitForChanges();

    const results = await page.compareScreenshot('Opened', {fullPage: false});
    expect(results).toMatchScreenshot({allowableMismatchedRatio: 0.05});
  });
});
