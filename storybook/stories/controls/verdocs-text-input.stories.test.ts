// Test for verdocs-text-input
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-text-input',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Types: Story = {
  play: async ({ canvasElement }) => {
    const textInputEl = canvasElement.querySelector('verdocs-text-input');
    if (!textInputEl) throw new Error('verdocs-text-input not found in canvas');

    // Try to access the native input inside the shadow DOM
    const input = textInputEl.shadowRoot?.querySelector('input');
    if (!input) throw new Error('Native input not found in verdocs-text-input shadowRoot');

    expect((input as HTMLInputElement).disabled).toBe(false);
    await userEvent.type(input as HTMLInputElement, 'Test Value');
    expect((input as HTMLInputElement).value).toBe('Test Value');
  },
};