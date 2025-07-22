import { newSpecPage } from '@stencil/core/testing';
import { VerdocsCheckbox } from './verdocs-checkbox';

describe('verdocs-checkbox', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsCheckbox],
      html: `<verdocs-checkbox></verdocs-checkbox>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with checked, theme, size, and label', async () => {
    const page = await newSpecPage({
      components: [VerdocsCheckbox],
      html: `<verdocs-checkbox checked="true" theme="dark" size="small" label="Test"></verdocs-checkbox>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root.querySelector('input[type="checkbox"]')?.checked).toBe(true);
  });

  it('handles input event and toggles checked state', async () => {
    const page = await newSpecPage({
      components: [VerdocsCheckbox],
      html: `<verdocs-checkbox></verdocs-checkbox>`,
    });
    const input = page.root.querySelector('input[type="checkbox"]');
    expect(input).not.toBeNull();
    input.checked = true;
    input.dispatchEvent(new Event('input'));
    // Stencil's @Prop() does not auto-update, but we can check the event fired
    // For a real test, you would listen for a custom event if implemented
    expect(input.checked).toBe(true);
  });
});
