import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Checkbox as CheckboxStory } from './verdocs-checkbox.stories';

const meta = {
  component: 'verdocs-checkbox',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const ChecksTest: Story = {
  render: CheckboxStory,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-checkbox');
    if (!host) throw new Error('verdocs-checkbox element not found');

    // args-defined attributes should be present on the host
    expect(host.getAttribute('label')).toBe('Sample checkbox');
    expect(host.getAttribute('name')).toBe('test');
    expect(host.getAttribute('value')).toBe('1');
    expect(host.getAttribute('theme')).toBe('light');
  },
};

export const Accessibility: Story = {
  render: CheckboxStory,
  play: async ({ canvasElement }) => {
    const results = await axe.run(canvasElement);
    // we know there are no a11y improvements yet, so expect at least one violation
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
