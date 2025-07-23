import { newSpecPage } from '@stencil/core/testing';
import { VerdocsToolbarIcon } from './verdocs-toolbar-icon';

describe('verdocs-toolbar-icon', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsToolbarIcon],
      html: `<verdocs-toolbar-icon></verdocs-toolbar-icon>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with text, icon, and placement', async () => {
    const icon = '<svg></svg>';
    const page = await newSpecPage({
      components: [VerdocsToolbarIcon],
      html: `<verdocs-toolbar-icon text="Tooltip" icon='${icon}' placement="top"></verdocs-toolbar-icon>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.text).toBe('Tooltip');
    expect(page.rootInstance.icon).toBe(icon);
    expect(page.rootInstance.placement).toBe('top');
  });
});
