// Test for verdocs-templates-list
import type { Meta, StoryObj } from '@storybook/web-components';
// Use global expect (from Vitest/Jest)
import { userEvent } from '@storybook/testing-library';

const meta = {
  component: 'verdocs-templates-list',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Opens: Story = {
  play: async ({ canvasElement }) => {
    const listEl = canvasElement.querySelector('verdocs-templates-list');
    if (!listEl) throw new Error('verdocs-templates-list not found in canvas');

    // Try to access the first button inside the shadow DOM (e.g., close/view/edit)
    const button = listEl.shadowRoot?.querySelector('button');
    if (!button) throw new Error('Button not found in verdocs-templates-list shadowRoot');

    expect((button as HTMLButtonElement).disabled).toBe(false);
    await userEvent.click(button as HTMLButtonElement);
    expect(document.activeElement).toBe(button);
  },
};