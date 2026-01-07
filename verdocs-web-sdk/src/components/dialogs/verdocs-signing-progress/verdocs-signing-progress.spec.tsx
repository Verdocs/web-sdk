import {newSpecPage} from '@stencil/core/testing';
import {VerdocsSigningProgress} from './verdocs-signing-progress';

describe('verdocs-signing-progress', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsSigningProgress],
      html: '<verdocs-signing-progress></verdocs-signing-progress>',
    });
    expect(page.root).toBeTruthy();
    expect(page.root.shadowRoot).toBeNull(); // It's not shadow, it uses scoped styles? standard check usually suffice
  });

  it('calculates progress correctly', async () => {
    const page = await newSpecPage({
      components: [VerdocsSigningProgress],
      html: '<verdocs-signing-progress current="1" total="2"></verdocs-signing-progress>',
    });
    expect(page.root).toBeTruthy();
    const text = page.root.querySelector('.progress-text');
    expect(text.textContent).toBe('1/2');
  });
});
