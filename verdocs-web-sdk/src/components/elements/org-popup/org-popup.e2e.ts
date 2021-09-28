import {newE2EPage} from '@stencil/core/testing';

describe('my-component', () => {
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
