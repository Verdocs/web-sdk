import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Standard as StandardStory, Outline as OutlineStory } from './verdocs-button.stories';

const meta = {
  component: 'verdocs-button',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const StandardTest: Story = {
  render: StandardStory,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-button');
    if (!host) throw new Error('verdocs-button element not found');
    // verify that the label arg is applied
    expect(host.getAttribute('label')).toBe('Click Me');
  },
};

export const OutlineTest: Story = {
  render: OutlineStory,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-button');
    if (!host) throw new Error('verdocs-button element not found');
    // verify that the variant arg is applied
    expect(host.getAttribute('variant')).toBe('outline');
  },
};

export const Accessibility: Story = {
  render: StandardStory,
  play: async ({ canvasElement }) => {
    const results = await axe.run(canvasElement);
    // we expect at least one violation, so this will fail as intended
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
