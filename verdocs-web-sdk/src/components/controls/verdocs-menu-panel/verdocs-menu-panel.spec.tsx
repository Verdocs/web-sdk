import { newSpecPage } from '@stencil/core/testing';
import { VerdocsMenuPanel } from './verdocs-menu-panel';

describe('verdocs-menu-panel', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsMenuPanel],
      html: `<verdocs-menu-panel></verdocs-menu-panel>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with side left and custom width', async () => {
    const page = await newSpecPage({
      components: [VerdocsMenuPanel],
      html: `<verdocs-menu-panel side="left" width="400"></verdocs-menu-panel>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.side).toBe('left');
    expect(page.rootInstance.width).toBe(400);
  });

  it('renders with overlay disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsMenuPanel],
      html: `<verdocs-menu-panel overlay="false"></verdocs-menu-panel>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.overlay).toBe(false);
  });

  // Note: Simulating document click to test close event may not work in JSDOM, but we can check event emission logic.
  it('emits close event', async () => {
    const page = await newSpecPage({
      components: [VerdocsMenuPanel],
      html: `<verdocs-menu-panel></verdocs-menu-panel>`,
    });
    const spy = jest.fn();
    page.root.addEventListener('close', spy);
    // Directly call the handler to simulate
    (page.rootInstance as any).handleClick({ target: document.createElement('div'), stopPropagation: () => {} });
    expect(spy).toHaveBeenCalled();
  });
});
