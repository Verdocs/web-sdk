import {newE2EPage} from '@stencil/core/testing';

describe('org-popup', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<org-popup></org-popup>');
    const element = await page.find('org-popup');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<org-popup></org-popup>');
    const component = await page.find('org-popup');
    const element = await page.find('org-popup >>> div');

    component.setProperty('organization', {name: 'Test'});
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Test`);
  });
});

// describe('dropdown-menu', () => {
//   it('renders a placeholder with no options', async () => {
//     const page = await newE2EPage();
//     await page.setContent('<dropdown-menu></dropdown-menu>');
//     await page.compareScreenshot('Closed', {fullPage: false});
//   });

//   it('renders changes to the name data', async () => {
//     const page = await newE2EPage();

//     await page.setContent('<dropdown-menu open></dropdown-menu>');
//     const component = await page.find('dropdown-menu');
//     component.setProperty('options', [{label: 'Test 1'}, {label: 'Test Disabled', disabled: true}, {label: 'Test 2'}]);

//     await page.waitForChanges();

//     const results = await page.compareScreenshot('Opened', {fullPage: false});
//     expect(results).toMatchScreenshot({allowableMismatchedRatio: 0.05});
//   });
// });
