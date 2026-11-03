import { getTemplate } from '@verdocs/js-sdk';
import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTemplateFields } from './verdocs-template-fields';
import { Store } from '../../../utils/Datastore';

const template = {
  id: 'T1',
  roles: [
    { name: 'Taxpayer', sequence: 2, type: 'signer' },
    { name: 'Preparer', sequence: 1, type: 'signer' },
  ],
  documents: [],
  fields: [],
};

describe('verdocs-template-fields', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsTemplateFields],
      html: '<verdocs-template-fields></verdocs-template-fields>',
    });
    expect(page.root).toBeTruthy();
  });

  it('reloads a cached template so roles added elsewhere appear', async () => {
    const cached = { ...template, roles: [template.roles[1]] };
    (getTemplate as jest.Mock).mockResolvedValueOnce(template);
    jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, getter: any, forceReload, callback: any) => {
      callback(cached);
      if (forceReload) {
        getter().then(callback);
      }
      return 'listener';
    });

    const page = await newSpecPage({
      components: [VerdocsTemplateFields],
      html: '<verdocs-template-fields template-id="T1"></verdocs-template-fields>',
    });
    await page.waitForChanges();

    expect(page.rootInstance.template.roles.map((role: any) => role.name)).toEqual(['Taxpayer', 'Preparer']);
  });

  it('stops listening when removed and listens again when reattached', async () => {
    const subscribe = jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return `listener-${subscribe.mock.calls.length}`;
    });
    const delListener = jest.spyOn(Store.store, 'delListener');

    const page = await newSpecPage({
      components: [VerdocsTemplateFields],
      html: '<verdocs-template-fields template-id="T1"></verdocs-template-fields>',
    });
    const el = page.root;

    el.remove();
    await page.waitForChanges();
    expect(delListener).toHaveBeenCalledWith('listener-1');

    page.body.appendChild(el);
    await page.waitForChanges();
    expect(subscribe).toHaveBeenCalledTimes(2);
  });
});
