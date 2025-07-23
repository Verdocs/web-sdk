import { newSpecPage } from '@stencil/core/testing';
import { VerdocsDateInput } from './verdocs-date-input';

describe('verdocs-date-input', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsDateInput],
      html: `<verdocs-date-input></verdocs-date-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with label, placeholder, and value', async () => {
    const page = await newSpecPage({
      components: [VerdocsDateInput],
      html: `<verdocs-date-input label="DOB" placeholder="Date of Birth..." value="2023-01-01"></verdocs-date-input>`,
    });
    expect(page.root).toMatchSnapshot();
    const input = page.root.querySelector('input');
    expect(input?.value).toBe('2023-01-01');
  });

  it('renders as disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsDateInput],
      html: `<verdocs-date-input disabled="true"></verdocs-date-input>`,
    });
    expect(page.root).toMatchSnapshot();
    const input = page.root.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('handles input change event', async () => {
    const page = await newSpecPage({
      components: [VerdocsDateInput],
      html: `<verdocs-date-input></verdocs-date-input>`,
    });
    const input = page.root.querySelector('input');
    expect(input).not.toBeNull();
    if (input) {
      input.value = '2025-07-23';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('2025-07-23');
    }
  });
});
