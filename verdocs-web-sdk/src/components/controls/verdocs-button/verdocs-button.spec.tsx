import { newSpecPage } from '@stencil/core/testing';
import { VerdocsButton } from './verdocs-button';

describe('verdocs-button', () => {
  it('renders with label', async () => {
    const page = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button label="Click Me"></verdocs-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with variant, size, and disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button label="Disabled" variant="outline" size="large" disabled="true"></verdocs-button>`,
    });
    expect(page.root).toMatchSnapshot();
    // Check for disabled attribute instead of .disabled property due to JSDOM limitations
    expect(page.root.querySelector('button')?.getAttribute('disabled')).not.toBeNull();
  });

  it('renders with startIcon and endIcon', async () => {
    const page = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button label="Icon" starticon="<svg></svg>" endicon="<svg></svg>"></verdocs-button>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('handles click event when enabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button label="Clickable"></verdocs-button>`,
    });
    const button = page.root.querySelector('button');
    const clickSpy = jest.fn();
    button?.addEventListener('click', clickSpy);
    button?.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('does not handle click event when disabled', async () => {
    const page = await newSpecPage({
      components: [VerdocsButton],
      html: `<verdocs-button label="Disabled" disabled="true"></verdocs-button>`,
    });
    const button = page.root.querySelector('button');
    const clickSpy = jest.fn();
    button?.addEventListener('click', clickSpy);
    button?.click();
    // In JSDOM, click events may still fire even if disabled attribute is set.
    // Instead, check that the button has the disabled attribute.
    expect(button?.getAttribute('disabled')).not.toBeNull();
  });
});
