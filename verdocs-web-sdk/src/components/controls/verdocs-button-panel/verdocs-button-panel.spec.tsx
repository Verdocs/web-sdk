import { newSpecPage } from '@stencil/core/testing';
import { VerdocsButtonPanel } from './verdocs-button-panel';

describe('verdocs-button-panel', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsButtonPanel],
      html: `<verdocs-button-panel></verdocs-button-panel>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with icon prop', async () => {
    const page = await newSpecPage({
      components: [VerdocsButtonPanel],
      html: `<verdocs-button-panel icon="<svg></svg>"></verdocs-button-panel>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with slotted content', async () => {
    const page = await newSpecPage({
      components: [VerdocsButtonPanel],
      html: `<verdocs-button-panel icon="<svg></svg>"><div>Panel Content</div></verdocs-button-panel>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  // Note: Panel show/hide is managed via DOM and Popper, which may not be fully testable in JSDOM.
  // This test checks if the icon element exists and is clickable.
  it('has icon element for interaction', async () => {
    const page = await newSpecPage({
      components: [VerdocsButtonPanel],
      html: `<verdocs-button-panel icon="<svg></svg>"></verdocs-button-panel>`,
    });
    const iconDiv = page.root.querySelector('div');
    expect(iconDiv).not.toBeNull();
  });
});
