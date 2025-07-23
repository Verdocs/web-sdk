import { newSpecPage } from '@stencil/core/testing';
import { VerdocsMultiselect } from './verdocs-multiselect';

describe('verdocs-multiselect', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsMultiselect],
      html: `<verdocs-multiselect options='[]' selectedOptions='[]'></verdocs-multiselect>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label, placeholder, and options', async () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];
    const page = await newSpecPage({
      components: [VerdocsMultiselect],
      html: `<verdocs-multiselect label="Test" placeholder="Choose..." options='${JSON.stringify(options)}' selectedOptions='[]'></verdocs-multiselect>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with selected options', async () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];
    const selectedOptions = ['1'];
    const page = await newSpecPage({
      components: [VerdocsMultiselect],
      html: `<verdocs-multiselect options='${JSON.stringify(options)}' selectedOptions='${JSON.stringify(selectedOptions)}'></verdocs-multiselect>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits selectionChanged event on option toggle', async () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];
    const page = await newSpecPage({
      components: [VerdocsMultiselect],
      html: `<verdocs-multiselect options='${JSON.stringify(options)}' selectedOptions='[]'></verdocs-multiselect>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('selectionChanged', spy);

    // Simulate toggling the first option
    (page.rootInstance as any).handleToggleOption({ target: { checked: true } }, options[0]);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
    expect((page.rootInstance as any).selectedOptions).toContain('1');
  });
});
