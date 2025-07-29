// Test for verdocs-auth
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-auth',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Opens: Story = {
  play: async ({ canvasElement }) => {
    const authEl = canvasElement.querySelector('verdocs-auth');
    if (!authEl) throw new Error('verdocs-auth not found in canvas');

    // Try to access the first button inside the shadow DOM (e.g., login/submit)
    const button = authEl.shadowRoot?.querySelector('button');
    if (!button) throw new Error('Button not found in verdocs-auth shadowRoot');

    expect((button as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(button as HTMLButtonElement);
    expect(document.activeElement).toBe(button);
  },
};