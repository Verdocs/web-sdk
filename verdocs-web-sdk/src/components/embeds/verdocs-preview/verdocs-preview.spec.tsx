import { newSpecPage } from '@stencil/core/testing';
import { VerdocsPreview } from './verdocs-preview';
import { Store } from '../../../utils/Datastore';

const field = { name: 'f1', role_name: 'Signer', template_id: 'T1', document_id: 'D1', type: 'textbox', page: 1, x: 10, y: 10, width: 100, height: 15, required: true, readonly: false, label: 'Name' };
const template = { id: 'T1', roles: [{ name: 'Signer', sequence: 1, type: 'signer' }], documents: [], fields: [field] };

// Renders the preview and fires its page-rendered handler for a page whose controls layer sits inside the preview.
const renderPreview = async (attrs = '', before?: (doc: Document) => void) => {
  jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
    callback(template);
    return 'listener';
  });
  const page = await newSpecPage({ components: [VerdocsPreview], html: `<verdocs-preview template-id="T1" ${attrs}></verdocs-preview>` });
  const layer = page.doc.createElement('div');
  layer.id = 'page-1-controls';
  page.root.appendChild(layer);
  before?.(page.doc);
  page.rootInstance.handlePageRendered({ detail: { documentId: 'D1', pageNumber: 1, containerId: 'page-1', xScale: 1.5, yScale: 1.5 } });
  return page;
};

describe('verdocs-preview', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsPreview],
      html: '<verdocs-preview></verdocs-preview>',
    });
    expect(page.root).toBeTruthy();
  });

  it('draws fields in their recipient color by default', async () => {
    const page = await renderPreview();
    const el = page.root.querySelector('#verdocs-doc-fld-f1') as HTMLElement;

    expect(el.classList.contains('vb-field')).toBe(true);
    expect(el.style.getPropertyValue('--vb-color')).toEqual('var(--verdocs-recipient-1)');
    expect(el.style.getPropertyValue('--vb-scale')).toEqual('1.5');
    expect(el.querySelector('.vb-label').textContent).toEqual('Name');
  });

  it('keeps the theme look when asked', async () => {
    const page = await renderPreview('field-style="theme"');
    const el = page.root.querySelector('#verdocs-doc-fld-f1') as HTMLElement;

    expect(el).not.toBeNull();
    expect(el.classList.contains('vb-field')).toBe(false);
    expect(el.querySelector('.vb-face')).toBeNull();
  });

  it('leaves a same-named field in another component alone', async () => {
    let other: HTMLElement;
    await renderPreview('', doc => {
      other = doc.createElement('verdocs-field-textbox');
      other.id = 'verdocs-doc-fld-f1';
      doc.body.appendChild(other);
    });

    expect(other.classList.contains('vb-field')).toBe(false);
    expect(other.querySelector('.vb-face')).toBeNull();
  });
});
