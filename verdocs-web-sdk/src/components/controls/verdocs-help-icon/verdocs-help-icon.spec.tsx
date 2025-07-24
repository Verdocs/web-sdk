import { newSpecPage } from '@stencil/core/testing';
import { VerdocsHelpIcon } from './verdocs-help-icon';
import {h} from '@stencil/core';

describe('verdocs-help-icon', () => {
   beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    // restore the original behavior after the tests
    (Math.random as jest.Mock).mockRestore();
  });

  it('renders the help icon with the correct attributes', async () => {
    const page = await newSpecPage({
      components: [VerdocsHelpIcon],
      template: () => <verdocs-help-icon />,
    });
    const div = page.root.querySelector('.icon');

    // The id prefix should be correct:
    expect(div.getAttribute('aria-describedby'))
      .toMatch(/^verdocs-help-icon-/);

    // And the icon SVG should be present:
    expect(div.innerHTML).toContain('<svg');
  });

  it('renders with custom help text', async () => {
    const page = await newSpecPage({
      components: [VerdocsHelpIcon],
      template: () => <verdocs-help-icon text="Help me!"></verdocs-help-icon>,
    });
    expect(page.rootInstance.text).toBe('Help me!');
  });

  it('renders with custom icon', async () => {
    const customIcon = '<svg><circle cx="12" cy="12" r="10" fill="red"/></svg>';
    const page = await newSpecPage({
      components: [VerdocsHelpIcon],
      template: () => <verdocs-help-icon icon={customIcon}></verdocs-help-icon>,
    });
    expect(page.rootInstance.icon).toBe(customIcon);
  });
});
