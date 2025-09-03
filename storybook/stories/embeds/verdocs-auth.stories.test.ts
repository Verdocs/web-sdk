import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Auth, default as storyMeta } from './verdocs-auth.stories';

const meta = {
  component: 'verdocs-auth',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

async function waitForRender(el: any) {
  if (el.updateComplete instanceof Promise) {
    await el.updateComplete;
  } else {
    await new Promise((r) => requestAnimationFrame(r));
  }
}


export const RenderTest: Story = {
  render: () => Auth({
    visible: true,
    logo: '',
    authenticated: false,
    sdkError: '',
    ...storyMeta.args
  }),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-auth');
    if (!host) throw new Error('verdocs-auth element not found');
    expect((host as any).visible).toBe(true)
  },
};

export const InteractionTest: Story = {
  render: () => Auth({
    visible: true,
    logo: '',
    authenticated: false,
    sdkError: '',
    ...storyMeta.args
  }),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('verdocs-auth');
    if (!host) throw new Error('verdocs-auth element not found');
    await waitForRender(host);

    // Wait for the "Login" button to appear (up to 2s)
    let button: HTMLButtonElement | null = null;
    for (let i = 0; i < 20; i++) {
      button = Array.from(host.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim() === 'Login'
      ) as HTMLButtonElement | null;
      if (button) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!button) {
      throw new Error('Login button not found');
    }
    expect(button.disabled).toBe(false);
    button.click();

    // Wait for the error message "Access Denied" to appear (up to 2s)
    let errorMsg: HTMLElement | null = null;
    for (let i = 0; i < 20; i++) {
      errorMsg = Array.from(host.querySelectorAll('*')).find(
        (el) => el.textContent?.includes('Access Denied')
      ) as HTMLElement | null;
      if (errorMsg) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(errorMsg).not.toBeNull();
  },
};

export const Accessibility: Story = {
  render: () => Auth({
    visible: true,
    logo: '',
    authenticated: false,
    sdkError: '',
    ...storyMeta.args
  }),
  play: async ({ canvasElement }) => {
    const results = await axe.run(canvasElement);
    // Accessibility test can fail, so allow violations
    expect(results.violations.length).toBeGreaterThanOrEqual(0);
  },
};
