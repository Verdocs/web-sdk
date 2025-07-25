import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSelectInput } from './verdocs-select-input';
import { h } from '@stencil/core';

describe('verdocs-select-input', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsSelectInput],
      template: () => <verdocs-select-input options={[]} />,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label, value, and options', async () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ];
    const page = await newSpecPage({
      components: [VerdocsSelectInput],
      template: () => <verdocs-select-input label="Select" value="2" options={options} />,
    });
    expect(page.root).toMatchSnapshot();
    const selectedOption = page.root.querySelector('option[selected]');
    expect(selectedOption).not.toBeNull();
    expect(selectedOption?.getAttribute('value')).toBe('2');
  });

  it('renders as disabled', async () => {
    const options = [
      { label: 'Option 1', value: '1' }
    ];
    const page = await newSpecPage({
      components: [VerdocsSelectInput],
      template: () => <verdocs-select-input disabled={true} options={options} />,
    });
    expect(page.root).toMatchSnapshot();
    const select = page.root.querySelector('select');
    expect(select?.hasAttribute('disabled')).toBe(true);
  });
});
