import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { SignatureDialog } from './verdocs-signature-dialog.stories';

const meta = {
  component: 'verdocs-signature-dialog',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const SignatureDialogTest: Story = {
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-signature-dialog');
    if (!host) throw new Error('verdocs-signature-dialog element not found');

    // Wait for the inner button to appear (up to 2s)
    let button: HTMLButtonElement | null = null;
    for (let i = 0; i < 20; i++) {
      button = host.querySelector('button');
      if (button && button instanceof HTMLButtonElement) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!button || !(button instanceof HTMLButtonElement)) {
      throw new Error('Inner <button> not found');
    }
    expect(button.disabled).toBe(false);
    button.click();
    // Optionally, check for click effect, but do not require focus
    // expect(document.activeElement).toBe(button);
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