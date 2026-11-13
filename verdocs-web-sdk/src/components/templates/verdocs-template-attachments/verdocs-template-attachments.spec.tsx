import {newSpecPage} from '@stencil/core/testing';
import {VerdocsTemplateAttachments} from './verdocs-template-attachments';
import {Store} from '../../../utils/Datastore';

const template = {
  id: 'T1',
  roles: [],
  documents: [
    {id: 'B', name: 'second.pdf', order: 2, pages: 2, size: 2048, mime: 'application/pdf', created_at: '2026-11-13T00:00:01Z'},
    {id: 'A', name: 'first.pdf', order: 1, pages: 4, size: 1048576 * 2, mime: 'application/pdf', created_at: '2026-11-13T00:00:00Z'},
  ],
  fields: [{name: 'sig', document_id: 'A'}],
};

const render = async (data: any = template) => {
  jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
    callback(data);
    return 'listener';
  });

  const page = await newSpecPage({
    components: [VerdocsTemplateAttachments],
    html: '<verdocs-template-attachments template-id="T1"></verdocs-template-attachments>',
  });
  return {page, attachments: page.rootInstance as VerdocsTemplateAttachments};
};

describe('verdocs-template-attachments', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateAttachments],
      html: '<verdocs-template-attachments></verdocs-template-attachments>',
    });
    expect(page.root).toBeTruthy();
  });

  it('lists documents in their signing order', async () => {
    const {page} = await render();
    const names = Array.from(page.root.querySelectorAll('.attachment .filename')).map(el => el.getAttribute('title'));
    expect(names).toEqual(['first.pdf', 'second.pdf']);
  });

  it('moves a document and saves its new position', async () => {
    jest.spyOn(Store, 'updateTemplate').mockImplementation((_id, updated) => updated);
    const {attachments} = await render();
    const patch = jest.fn().mockResolvedValue({data: template});
    (attachments.endpoint.api as any).patch = patch;

    await attachments.moveDocument('B', 0);

    expect(patch).toHaveBeenCalledWith('/v2/template-documents/B', {order: 1});
  });

  it('does not offer to delete the only document', async () => {
    const {attachments} = await render({...template, documents: [template.documents[1]]});

    attachments.handleDelete(template.documents[1] as any);

    expect(attachments.showDeleteError).toBe(true);
    expect(attachments.confirmDeleteDocument).toBeNull();
  });

  it('skips files that are not PDF or Word documents', async () => {
    const {attachments} = await render();
    const post = attachments.endpoint.api.post as jest.Mock;
    post.mockClear();

    attachments.queueFiles([new File(['x'], 'photo.png')]);

    expect(attachments.uploads).toEqual([]);
    expect(post).not.toHaveBeenCalled();
  });
});
