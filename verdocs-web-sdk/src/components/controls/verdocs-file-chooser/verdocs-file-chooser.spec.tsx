import { newSpecPage } from '@stencil/core/testing';
import { VerdocsFileChooser } from './verdocs-file-chooser';

describe('verdocs-file-chooser', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsFileChooser],
      html: `<verdocs-file-chooser></verdocs-file-chooser>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with a custom endpoint', async () => {
    const page = await newSpecPage({
      components: [VerdocsFileChooser],
      html: `<verdocs-file-chooser endpoint="custom"></ververdocs-file-chooser>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits fileSelected event on file input change', async () => {
    const page = await newSpecPage({
      components: [VerdocsFileChooser],
      html: `<verdocs-file-chooser></verdocs-file-chooser>`,
    });
    const input = page.root.querySelector('input[type="file"]');
    const spy = jest.fn();
    page.root.addEventListener('fileSelected', spy);

    // Simulate file selection
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const event = {
      target: { files: [file] }
    };
    (page.rootInstance as any).handleFileChanged(event);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
    expect((page.rootInstance as any).file).toBe(file);
  });
});
