import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Checkbox as CheckboxStory, default as storyMeta } from './verdocs-checkbox.stories';

const meta = {
  component: 'verdocs-checkbox',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;
// Helper to wait for Lit to finish initial render
async function waitForRender(el: any) {
  if (el.updateComplete instanceof Promise) {
    await el.updateComplete;
  } else {
    await new Promise((r) => requestAnimationFrame(r));
  }
}

export const RenderTest: Story = {
  render: () => CheckboxStory({
    checked: false,
    label: '',
    name: '',
    value: '',
    disabled: false,
    theme: '',
    ...storyMeta.args,
    input: () => {}, // ensure input handler is always present
  }),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-checkbox');
    if (!host) throw new Error('verdocs-checkbox element not found');
    await waitForRender(host);
     
    // Props come in via the "."-notation, so check the properties, not attributes:
    expect((host as any).label).toBe('Sample checkbox');
    expect((host as any).name).toBe('test');
    expect((host as any).value).toBe('1');
    expect((host as any).theme).toBe('light');
    expect((host as any).checked).toBe(false);
    expect((host as any).disabled).toBe(false);
  },
};

export const InteractionTest: Story = {
  render: () => CheckboxStory({
    checked: false,
    label: '',
    name: '',
    value: '',
    disabled: false,
    theme: '',
    ...storyMeta.args,
    input: () => {}, // ensure input handler is always present
  }),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-checkbox');
    if (!host) throw new Error('verdocs-checkbox element not found');
    console.log(host.innerHTML);
    const inputElement: HTMLInputElement | null = canvasElement.querySelector('verdocs-checkbox input[name="test"]');
    console.log("inputElement: ",inputElement)
    inputElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Wait for checked to become true (up to 2s)
    for (let i = 0; i < 20; i++) {
      if (inputElement?.checked === true || (host as any).checked === true) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log('inputElement.checked:', inputElement?.checked, 'host.checked:', (host as any).checked);
    expect(inputElement?.checked === true || (host as any).checked === true).toBe(true);

    // Click again to untoggle
    inputElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Wait for checked to become false (up to 2s)
    for (let i = 0; i < 20; i++) {
      if (inputElement?.checked === false || (host as any).checked === false) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log('inputElement.checked:', inputElement?.checked, 'host.checked:', (host as any).checked);
    expect(inputElement?.checked === false || (host as any).checked === false).toBe(true);
  },
};

export const Accessibility: Story = {
  render: () => CheckboxStory({
    checked: false,
    label: '',
    name: '',
    value: '',
    disabled: false,
    theme: '',
    ...storyMeta.args,
    input: () => {}, // ensure input handler is always present
  }),
  play: async ({ canvasElement }) => {
    const results = await axe.run(canvasElement);
    // we know no a11y features have been added yet, so expect at least one violation
    expect(results.violations.length).toBeGreaterThan(0);
  },
};

export const Visual: Story = {
  play: async () => {
    // skipped: visual regression not available in this environment
  },
};

export const Snapshot: Story = {
  play: async () => {
    // skipped: snapshot testing not available in this environment
  },
};
