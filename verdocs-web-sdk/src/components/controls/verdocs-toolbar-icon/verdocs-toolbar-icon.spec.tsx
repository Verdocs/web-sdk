import { newSpecPage } from '@stencil/core/testing';
import { VerdocsToolbarIcon } from './verdocs-toolbar-icon';
import {h} from '@stencil/core';

describe('verdocs-toolbar-icon', () => {
   beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    // restore the original behavior after the tests
    (Math.random as jest.Mock).mockRestore();
  });
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
      template: () => <verdocs-toolbar-icon text="Tooltip" icon={icon} placement="top"></verdocs-toolbar-icon>,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.text).toBe('Tooltip');
    expect(page.rootInstance.icon).toBe(icon);
    expect(page.rootInstance.placement).toBe('top');
  });
});
