import {h} from '@stencil/core';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsFieldCheckbox} from './verdocs-field-checkbox';

describe('verdocs-field-checkbox', () => {
  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsFieldCheckbox],
      html: '<verdocs-field-checkbox></verdocs-field-checkbox>',
    });
    expect(page.root).toBeTruthy();
  });

  it('marks a checked box with an X when its config asks for one', async () => {
    const field = {name: 'agree', type: 'checkbox', value: 'true', config: {type: 'checkbox', image: 'x'}};
    const page = await newSpecPage({components: [VerdocsFieldCheckbox], template: () => <verdocs-field-checkbox source="envelope" fieldname="agree" field={field as any} />});
    expect(page.root.classList.contains('cross')).toBe(true);

    page.root.done = true;
    await page.waitForChanges();
    expect(page.root.textContent).toEqual('✕');
  });
});
