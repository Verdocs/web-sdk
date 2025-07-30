import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { TextInput as TextInputStory } from './verdocs-text-input.stories';

const meta = {
  component: 'verdocs-text-input',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const TextInputTest: Story = {
  render: TextInputStory,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-text-input');
    if (!host) throw new Error('verdocs-text-input element not found');
    const input = host.querySelector('input[type="text"], input[type="email"], input[type="password"], input');
    if (!input || !(input instanceof HTMLInputElement)) {
      throw new Error('Inner <input> not found');
    }
    expect(input.disabled).toBe(false);
    input.value = 'Test Value';
    expect(input.value).toBe('Test Value');
  },
};

export const Accessibility: Story = {
  render: TextInputStory,
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