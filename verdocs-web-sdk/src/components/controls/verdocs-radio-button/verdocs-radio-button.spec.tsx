import { newSpecPage } from '@stencil/core/testing';
import { VerdocsRadioButton } from './verdocs-radio-button';

describe('verdocs-radio-button', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsRadioButton],
      html: `<verdocs-radio-button></verdocs-radio-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders as checked and disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsRadioButton],
      html: `<verdocs-radio-button checked="true" disabled="true" value="val1" name="group1"></verdocs-radio-button>`,
    });
    expect(page.root).toMatchSnapshot();
    const input = page.root.querySelector('input[type="radio"]') as HTMLInputElement | null;
    expect(input?.checked).toBe(true);
    expect(input?.disabled).toBe(true);
  });

  it('renders with value and name', async () => {
    const page = await newSpecPage({
      components: [VerdocsRadioButton],
      html: `<verdocs-radio-button value="val2" name="group2"></verdocs-radio-button>`,
    });
    expect(page.root).toMatchSnapshot();
    const input = page.root.querySelector('input[type="radio"]') as HTMLInputElement | null;
    expect(input?.value).toBe('val2');
    expect(input?.name).toBe('group2');
  });
});
