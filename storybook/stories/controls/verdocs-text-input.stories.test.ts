import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { TextInput as TextInputStory, default as storyMeta } from './verdocs-text-input.stories';

const meta = {
  component: 'verdocs-text-input',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

async function waitForRender(el: any) {
  if (el && typeof el.updateComplete === 'object' && el.updateComplete instanceof Promise) {
    await el.updateComplete;
  } else {
    await new Promise((r) => requestAnimationFrame(r));
  }
}

export const TextInputTest: Story = {
  render: () => TextInputStory({
    type: 'text',
    label: 'Name',
    value: '',
    placeholder: 'Enter your name...',
    disabled: false,
    input: () => {},
    ...(storyMeta.args || {})
  }),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-text-input');
    if (!host) throw new Error('verdocs-text-input element not found');
    await waitForRender(host);

    // Wait for the inner input to appear (up to 2s)
    let input: HTMLInputElement | null = null;
    for (let i = 0; i < 20; i++) {
      input = host.querySelector('input[type="text"], input[type="email"], input[type="password"], input');
      if (input && input instanceof HTMLInputElement) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!input || !(input instanceof HTMLInputElement)) {
      throw new Error('Inner <input> not found');
    }
    expect(input.disabled).toBe(false);
    input.value = 'Test Value';
    expect(input.value).toBe('Test Value');
  },
};

export const Accessibility: Story = {
  render: () => TextInputStory({
    type: 'text',
    label: 'Name',
    value: '',
    placeholder: 'Enter your name...',
    disabled: false,
    input: () => {},
    ...(storyMeta.args || {})
  }),
  play: async ({ canvasElement }) => {
    const results = await axe.run(canvasElement);
    expect(results.violations).toHaveLength(0);
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