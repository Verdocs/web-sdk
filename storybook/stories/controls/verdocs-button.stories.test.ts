// Replace your-framework with the name of your framework (e.g. react-vite, vue3-vite, etc.)
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-button',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Clicks: Story = {
  play: async ({ canvasElement }) => {
    // Select the verdocs-button custom element
    const verdocsButton = canvasElement.querySelector('verdocs-button');
    if (!verdocsButton) throw new Error('verdocs-button not found in canvas');

    // Try to access the native button inside the shadow DOM
    const button = verdocsButton.shadowRoot?.querySelector('button');
    if (!button) throw new Error('Native button not found in verdocs-button shadowRoot');

    expect((button as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(button as HTMLButtonElement);
    // Optionally, check if the button was focused after click
    expect(document.activeElement).toBe(button);
  },
};