import { newSpecPage } from '@stencil/core/testing';
import { VerdocsQuickFilter } from './verdocs-spinner';

describe('verdocs-spinner', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      html: `<verdocs-spinner></verdocs-spinner>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with custom size and mode', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      html: `<verdocs-spinner size="48" mode="dark"></verdocs-spinner>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.size).toBe(48);
    expect(page.rootInstance.mode).toBe('dark');
  });
});
