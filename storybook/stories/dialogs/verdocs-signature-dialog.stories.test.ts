// Test for verdocs-signature-dialog
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-signature-dialog',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Opens: Story = {
  play: async ({ canvasElement }) => {
    const dialogEl = canvasElement.querySelector('verdocs-signature-dialog');
    if (!dialogEl) throw new Error('verdocs-signature-dialog not found in canvas');

    // Try to access the close or exit button inside the shadow DOM
    const button = dialogEl.shadowRoot?.querySelector('button');
    if (!button) throw new Error('Button not found in verdocs-signature-dialog shadowRoot');

    expect((button as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(button as HTMLButtonElement);
    // Optionally, check if the button was focused after click
    expect(document.activeElement).toBe(button);
  },
};