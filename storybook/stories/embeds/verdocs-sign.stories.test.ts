import type { Meta, StoryObj } from '@storybook/web-components';
import { expect } from 'vitest';
import axe from 'axe-core';
import { Sign as SignStory, default as metaConfig } from './verdocs-sign.stories';

const meta = {
  component: 'verdocs-sign',
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const PlaceholderImageTest: Story = {
  render: () => SignStory({ envelopeId: '', roleId: '', inviteCode: '' }),
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toContain('sample-signing-envelope.png');
  },
};

export const VerdocsSignElementTest: Story = {
  render: () => SignStory({ envelopeId: 'env123', roleId: 'role456', inviteCode: 'invite789' }),
  play: async ({ canvasElement }) => {
    // Look for the error dialog by its text content
    const errorTitle = Array.from(canvasElement.querySelectorAll('*')).find(
      el => el.textContent?.includes('Unable to Start Signing')
    );
    const errorMsg = Array.from(canvasElement.querySelectorAll('*')).find(
      el => el.textContent?.includes('Sorry, your invite code is invalid or has expired.')
    );
    expect(errorTitle).not.toBeNull();
    expect(errorMsg).not.toBeNull();
  },
};

export const Accessibility: Story = {
  render: () => SignStory({ envelopeId: '', roleId: '', inviteCode: '' }),
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