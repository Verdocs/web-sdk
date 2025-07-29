// Test for verdocs-checkbox
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-checkbox',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Checks: Story = {
  play: async ({ canvasElement }) => {
    const checkboxEl = canvasElement.querySelector('verdocs-checkbox');
    if (!checkboxEl) throw new Error('verdocs-checkbox not found in canvas');

    // Try to access the native input[type="checkbox"] inside the shadow DOM
    const input = checkboxEl.shadowRoot?.querySelector('input[type="checkbox"]');
    if (!input) throw new Error('Native checkbox input not found in verdocs-checkbox shadowRoot');

    expect((input as HTMLInputElement).disabled).toBe(false);
    await userEvent.click(input as HTMLInputElement);
    expect((input as HTMLInputElement).checked).toBe(true);
  },
};