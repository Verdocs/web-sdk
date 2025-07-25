import { newSpecPage } from '@stencil/core/testing';
import { VerdocsComponentError } from './verdocs-component-error';

describe('verdocs-component-error', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsComponentError],
      html: `<verdocs-component-error></verdocs-component-error>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with a message', async () => {
    const page = await newSpecPage({
      components: [VerdocsComponentError],
      html: `<verdocs-component-error message="Error occurred"></verdocs-component-error>`,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.root.querySelector('.inner')?.textContent).toBe('Error occurred');
  });
});
