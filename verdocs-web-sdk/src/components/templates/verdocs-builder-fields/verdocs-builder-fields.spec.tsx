import {getTemplate} from '@verdocs/js-sdk';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsBuilderFields} from './verdocs-builder-fields';
import {Store} from '../../../utils/Datastore';

const template = {
  id: 'T1',
  roles: [
    {name: 'Taxpayer', sequence: 2, type: 'signer'},
    {name: 'Preparer', sequence: 1, type: 'signer'},
  ],
  documents: [],
  fields: [],
};

describe('verdocs-builder-fields', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsBuilderFields],
      html: '<verdocs-builder-fields></verdocs-builder-fields>',
    });
    expect(page.root).toBeTruthy();
  });

  it('uses the first role when the template is already cached', async () => {
    // A cached template arrives synchronously, before the first render.
    jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return 'listener';
    });

    const page = await newSpecPage({
      components: [VerdocsBuilderFields],
      html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>',
    });
    const builder = page.rootInstance as VerdocsBuilderFields;
    (page.doc as any).elementsFromPoint = () => [];

    expect(builder.paletteRoleName()).toEqual('Preparer');

    builder.startPaletteDrag({clientX: 0, clientY: 0, preventDefault: () => {}} as any, 'textbox');
    expect(builder.showMustSelectRole).toBeFalsy();
    expect(builder.paletteDrag?.roleName).toEqual('Preparer');
    builder.endPaletteDrag();

    builder.selectedRoleName = 'Taxpayer';
    expect(builder.paletteRoleName()).toEqual('Taxpayer');

    builder.template = {...template, roles: [template.roles[1]]} as any;
    expect(builder.paletteRoleName()).toEqual('Preparer');
  });

  it('reloads a cached template so roles added elsewhere appear', async () => {
    const cached = {...template, roles: [template.roles[1]]};
    (getTemplate as jest.Mock).mockResolvedValueOnce(template);
    jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, getter: any, forceReload, callback: any) => {
      callback(cached);
      if (forceReload) {
        getter().then(callback);
      }
      return 'listener';
    });

    const page = await newSpecPage({
      components: [VerdocsBuilderFields],
      html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>',
    });
    await page.waitForChanges();

    expect(page.rootInstance.sortedRoles().map((role: any) => role.name)).toEqual(['Preparer', 'Taxpayer']);
  });

  it('stops listening when removed and listens again when reattached', async () => {
    const subscribe = jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return `listener-${subscribe.mock.calls.length}`;
    });
    const delListener = jest.spyOn(Store.store, 'delListener');

    const page = await newSpecPage({
      components: [VerdocsBuilderFields],
      html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>',
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
