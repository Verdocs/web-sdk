import { newSpecPage } from '@stencil/core/testing';
import { VerdocsToggleButton } from './verdocs-toggle-button';

describe('verdocs-toggle-button', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsToggleButton],
      html: `<verdocs-toggle-button></verdocs-toggle-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders as active with icon and size', async () => {
    const icon = '<svg></svg>';
    const page = await newSpecPage({
      components: [VerdocsToggleButton],
      html: `<verdocs-toggle-button active="true" icon='${icon}' size="small"></verdocs-toggle-button>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.active).toBe(true);
    expect(page.rootInstance.icon).toBe(icon);
    expect(page.rootInstance.size).toBe('small');
  });

  it('emits toggle event on button click', async () => {
    const page = await newSpecPage({
      components: [VerdocsToggleButton],
      html: `<verdocs-toggle-button></verdocs-toggle-button>`,
    });
    const spy = jest.fn();
    page.root.addEventListener('toggle', spy);

    const button = page.root.querySelector('button');
    button?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(spy).toHaveBeenCalled();
  });
});
