import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { VerdocsToggle } from './verdocs-toggle';

describe('verdocs-toggle', () => {
  const options = {
    label: 'Toggle',
    defaultSelection: 0,
    buttons: [
      { id: 'btn1', icon: '<svg></svg>' },
      { id: 'btn2', icon: '<svg></svg>' }
    ]
  };

  it('renders with default props (with options)', async () => {
    const page = await newSpecPage({
      components: [VerdocsToggle],
      template: () => <verdocs-toggle options={options}></verdocs-toggle>,

    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with options and theme', async () => {
    const themedOptions = { ...options, defaultSelection: 1 };
    const page = await newSpecPage({
      components: [VerdocsToggle],
      template: () => <verdocs-toggle options={themedOptions} theme="dark"></verdocs-toggle>,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.theme).toBe('dark');
    expect(page.rootInstance.options.label).toBe('Toggle');
  });

  it('changes selectedOption on button click', async () => {
    const page = await newSpecPage({
      components: [VerdocsToggle],
      template: () => <verdocs-toggle options={options}></verdocs-toggle>,
    });

    const buttons = page.root.querySelectorAll('button');
    expect(buttons.length).toBe(2);

    // Simulate click on the second button
    buttons[1].dispatchEvent(new Event('click', { bubbles: true }));
    expect(page.rootInstance.selectedOption).toBe(1);
  });
});
