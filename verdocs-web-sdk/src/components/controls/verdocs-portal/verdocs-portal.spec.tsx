import { newSpecPage } from '@stencil/core/testing';
import { VerdocsPortal } from './verdocs-portal';

describe('verdocs-portal', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsPortal],
      html: `<verdocs-portal></verdocs-portal>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with anchor and voffset', async () => {
    const page = await newSpecPage({
      components: [VerdocsPortal],
      html: `<verdocs-portal anchor="anchor-id" voffset="10"></verdocs-portal>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.anchor).toBe('anchor-id');
    expect(page.rootInstance.voffset).toBe(10);
  });

  it('emits clickAway event on outside click', async () => {
    const page = await newSpecPage({
      components: [VerdocsPortal],
      html: `<verdocs-portal></verdocs-portal>`,
    });
    const spy = jest.fn();
    page.root.addEventListener('clickAway', spy);

    // Simulate a click outside the portal
    (page.rootInstance as any).handleClick({ target: document.createElement('div') });
    expect(spy).toHaveBeenCalled();
  });
});
