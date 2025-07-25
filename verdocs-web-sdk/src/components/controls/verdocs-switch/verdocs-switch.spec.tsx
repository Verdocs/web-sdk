import { newSpecPage } from '@stencil/core/testing';
import { VerdocsSwitch } from './verdocs-switch';

describe('verdocs-switch', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsSwitch],
      html: `<verdocs-switch></verdocs-switch>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders as checked and disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsSwitch],
      html: `<verdocs-switch checked="true" disabled="true"></verdocs-switch>`,
    });
    expect(page.root).toMatchSnapshot();
    const button = page.root.querySelector('button');
    expect(button?.getAttribute('data-state')).toBe('checked');
    expect(button?.classList.contains('disabled')).toBe(true);
  });

  it('emits checkedChange event on click', async () => {
    const page = await newSpecPage({
      components: [VerdocsSwitch],
      html: `<verdocs-switch></verdocs-switch>`,
    });
    const spy = jest.fn();
    page.root.addEventListener('checkedChange', spy);

    const button = page.root.querySelector('button');
    button?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(spy).toHaveBeenCalled();
  });
});
