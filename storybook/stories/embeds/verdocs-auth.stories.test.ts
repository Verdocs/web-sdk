import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Auth } from './verdocs-auth.stories';

const meta = {
  component: 'verdocs-auth',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AuthTest: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-auth');
    if (!host) throw new Error('verdocs-auth element not found');
    const button = host.querySelector('button');
    if (!button || !(button instanceof HTMLButtonElement)) {
      throw new Error('Inner <button> not found');
    }
    expect(button.disabled).toBe(false);
    button.click();
    expect(document.activeElement).toBe(button);
  },
};

export const Accessibility: Story = {
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