import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTextInput } from './verdocs-text-input';

describe('verdocs-text-input', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsTextInput],
      html: `<verdocs-text-input></verdocs-text-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label, value, and placeholder', async () => {
    const page = await newSpecPage({
      components: [VerdocsTextInput],
      html: `<verdocs-text-input label="Name" value="Alice" placeholder="Enter your name"></verdocs-text-input>`,
    });
    expect(page.root).toMatchSnapshot();
    const input = page.root.querySelector('input');
    expect(input?.value).toBe('Alice');
    expect(input?.placeholder).toBe('Enter your name');
  });

  it('renders with clearable and helpText', async () => {
    const page = await newSpecPage({
      components: [VerdocsTextInput],
      html: `<verdocs-text-input clearable="true" help-text="Help!"></verdocs-text-input>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.clearable).toBe(true);
    expect(page.rootInstance.helpText).toBe('Help!');
  });
});
