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

  it('draws each field in its recipient color with its label and badges', async () => {
    jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return 'listener';
    });
    const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>'});
    const builder = page.rootInstance as VerdocsBuilderFields;
    const el = page.doc.createElement('verdocs-field-textbox');
    const base = {name: 'f1', role_name: 'Preparer', type: 'textbox', required: true, readonly: true, label: '<img src=x>', placeholder: 'Hint'} as any;

    builder.decorateField(el, base);
    const face = el.querySelector('.vb-face');
    expect(el.classList.contains('vb-field')).toBe(true);
    expect(el.style.getPropertyValue('--vb-color')).toEqual('var(--verdocs-recipient-2)');
    expect(face.querySelector('.vb-label').textContent).toEqual('<img src=x>');
    expect(face.querySelector('img')).toBeNull();
    expect(face.querySelector('.vb-req')).not.toBeNull();
    expect(face.querySelector('.vb-badges i')).not.toBeNull();

    builder.decorateField(el, {...base, label: null, required: false, readonly: false});
    expect(el.querySelectorAll('.vb-face').length).toEqual(1);
    expect(el.querySelector('.vb-label').textContent).toEqual('Hint');
    expect(el.querySelector('.vb-req')).toBeNull();
    expect(el.querySelector('.vb-badges')).toBeNull();

    builder.decorateField(el, {...base, label: null, placeholder: null, type: 'date'});
    expect(el.querySelector('.vb-label').textContent).toEqual('Date');

    const box = page.doc.createElement('verdocs-field-checkbox');
    builder.decorateField(box, {...base, type: 'checkbox'});
    expect(box.querySelector('.vb-label')).toBeNull();
  });

  it('repeats recipient colors after eight', async () => {
    const roles = Array.from({length: 9}, (_, i) => ({name: `R${i + 1}`, sequence: i + 1, type: 'signer'}));
    jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback({...template, roles});
      return 'listener';
    });
    const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>'});
    const builder = page.rootInstance as VerdocsBuilderFields;
    expect([builder.roleNumber('R1'), builder.roleNumber('R8'), builder.roleNumber('R9')]).toEqual([1, 8, 1]);
    expect(builder.roleColor('R3')).toEqual('var(--verdocs-recipient-3)');
  });
});
