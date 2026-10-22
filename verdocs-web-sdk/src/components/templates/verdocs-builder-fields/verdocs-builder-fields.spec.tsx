import {getTemplate} from '@verdocs/js-sdk';
import {newSpecPage} from '@stencil/core/testing';
import {VerdocsBuilderFields} from './verdocs-builder-fields';
import {Store} from '../../../utils/Datastore';
import {drawRecipientField} from '../../../utils/RecipientFields';
import {getFieldId} from '../../../utils/utils';

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

  describe('Inspector', () => {
    const radio = (name: string, extra = {}) => ({name, role_name: 'Preparer', type: 'radio', group: 'filing', default: 'false', page: 1, ...extra});
    const inspectorTemplate = {
      ...template,
      fields: [
        {name: 'name', role_name: 'Preparer', type: 'textbox', label: 'Client name', page: 1, required: true, readonly: false},
        radio('single', {default: 'true'}),
        radio('joint'),
        radio('other-role', {role_name: 'Taxpayer', default: 'true'}),
        {name: 'state', role_name: 'Preparer', type: 'dropdown', page: 1, options: [{id: 'oh', label: 'Ohio'}]},
      ],
    };

    const renderBuilder = async () => {
      jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
        callback(inspectorTemplate);
        return 'listener';
      });
      const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>'});
      const builder = page.rootInstance as VerdocsBuilderFields;
      const saveField = jest.spyOn(builder, 'saveField').mockResolvedValue(undefined);
      return {page, builder, saveField};
    };

    it('shows the field type and name at the top', async () => {
      const {page, builder} = await renderBuilder();
      builder.selectedFieldName = 'name';
      builder.inspectorOpen = true;
      await page.waitForChanges();

      expect(page.root.querySelector('.insp-badge').textContent).toEqual('Text box');
      expect(page.root.querySelector('.insp-title').textContent).toEqual('Client name');
    });

    it('checks a new API name before saving it', async () => {
      const {builder, saveField} = await renderBuilder();
      const field = builder.findField('name');

      await builder.saveFieldName(field, 'joint');
      expect(builder.nameError).toContain('already exists');
      await builder.saveFieldName(field, '   ');
      expect(builder.nameError).toEqual('Enter a field name.');
      await builder.saveFieldName(field, 'name');
      expect(builder.nameError).toEqual('');
      expect(saveField).not.toHaveBeenCalled();

      builder.selectedFieldName = 'name';
      await builder.saveFieldName(field, 'client-name');
      expect(saveField).toHaveBeenCalledWith('name', {name: 'client-name'});
      // saveField is mocked, so the rename never lands and the selection goes back.
      expect(builder.selectedFieldName).toEqual('name');
    });

    it('clears the other pre-selected radio in the same group and recipient', async () => {
      const {builder, saveField} = await renderBuilder();

      await builder.savePreselected(builder.findField('joint'), 'joint');
      expect(saveField.mock.calls).toEqual([
        ['joint', {default: 'true'}],
        ['single', {default: 'false'}],
      ]);
    });

    it('offers the text formats signing checks, keeping one set elsewhere', async () => {
      const {page, builder, saveField} = await renderBuilder();
      builder.selectedFieldName = 'name';
      builder.inspectorOpen = true;
      await page.waitForChanges();

      const select = page.root.querySelector('select[name="validator"]') as any;
      const formatValues = () =>
        [...page.root.querySelectorAll('select[name="validator"] option')].map((option: any) => option.getAttribute('value') ?? option.value);
      expect(formatValues()).toEqual(['', 'email', 'phone']);
      select.value = 'email';
      select.dispatchEvent(new (page.win as any).Event('change'));
      expect(saveField).toHaveBeenCalledWith('name', {validator: 'email'});

      builder.template = {...builder.template, fields: [{...builder.findField('name'), validator: 'number'}]} as any;
      await page.waitForChanges();
      expect(formatValues()).toEqual(['', 'email', 'phone', 'number']);
    });

    it('saves options without blank rows, filling a missing ID from the label', async () => {
      const {builder, saveField} = await renderBuilder();

      builder.saveOptions(builder.findField('state'), [
        {id: 'oh', label: 'Ohio'},
        {id: '', label: 'New York'},
        {id: '', label: ''},
      ]);
      expect(saveField).toHaveBeenCalledWith('state', {options: [{id: 'oh', label: 'Ohio'}, {id: 'new-york', label: 'New York'}]});
    });

    it('puts corner handles on a selected field that resizes', async () => {
      const {page, builder} = await renderBuilder();
      for (const name of ['name', 'state']) {
        const el = page.doc.createElement('div');
        el.id = `verdocs-doc-fld-${name}`;
        if (name === 'name') {
          el.appendChild(page.doc.createElement('div')).className = 'edge-right';
        }
        page.root.appendChild(el);
      }

      builder.selectField('name');
      const corners = [...page.root.querySelectorAll('#verdocs-doc-fld-name > .vb-corner')].map((corner: any) => corner.className);
      expect(corners).toEqual(['edge-top edge-left vb-corner', 'edge-top edge-right vb-corner', 'edge-bottom edge-left vb-corner', 'edge-bottom edge-right vb-corner']);

      builder.selectField('state');
      expect(page.root.querySelectorAll('.vb-corner').length).toEqual(0);
    });

    it('turns Read-only off when Required goes on, and the reverse', async () => {
      const {builder, saveField} = await renderBuilder();

      builder.toggleRequired({name: 'a', required: false, readonly: true} as any);
      builder.toggleReadonly({name: 'b', required: true, readonly: false} as any);
      expect(saveField.mock.calls).toEqual([
        ['a', {required: true, readonly: false}],
        ['b', {readonly: true, required: false}],
      ]);
    });
  });

  describe('Radio groups', () => {
    const option = (name: string, extra = {}) => ({name, role_name: 'Preparer', type: 'radio', group: 'filing', default: 'false', page: 1, x: 50, height: 14, ...extra});
    const groupTemplate = {
      ...template,
      fields: [
        option('joint', {y: 620}),
        option('single', {y: 700, default: 'true'}),
        option('separate', {y: 500, x: 60}),
        option('spouse-single', {role_name: 'Taxpayer', y: 650}),
        option('other', {group: 'other', y: 300}),
        option('loose', {group: null, y: 100}),
      ],
    };

    const renderGroups = async () => {
      jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
        callback(groupTemplate);
        return 'listener';
      });
      const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields template-id="T1"></verdocs-builder-fields>'});
      const builder = page.rootInstance as VerdocsBuilderFields;
      const saveField = jest.spyOn(builder, 'saveField').mockResolvedValue(undefined);
      const addField = jest.spyOn(builder, 'addField').mockResolvedValue(undefined);
      return {page, builder, saveField, addField};
    };

    const names = (fields: any[]) => fields.map(field => field.name);

    it('groups radios by group and recipient, top to bottom', async () => {
      const {builder} = await renderGroups();
      expect(names(builder.groupMembers(builder.findField('joint')))).toEqual(['single', 'joint', 'separate']);
      expect(names(builder.groupMembers(builder.findField('loose')))).toEqual(['loose']);
    });

    it('applies group settings to every option', async () => {
      const {builder, saveField} = await renderGroups();
      await builder.toggleRequired(builder.findField('joint'));
      expect(saveField.mock.calls).toEqual([
        ['single', {required: true, readonly: false}],
        ['joint', {required: true, readonly: false}],
        ['separate', {required: true, readonly: false}],
      ]);
    });

    it('adds the next option under the last one, giving a loose radio a group first', async () => {
      const {builder, saveField, addField} = await renderGroups();

      await builder.addOption(builder.findField('joint'));
      expect(addField.mock.calls[0][0]).toMatchObject({group: 'filing', role_name: 'Preparer', page: 1, x: 60, y: 480, default: 'false', label: null});

      await builder.addOption(builder.findField('loose'));
      expect(saveField).toHaveBeenCalledWith('loose', {group: 'choice1'});
      expect(addField.mock.calls[1][0]).toMatchObject({group: 'choice1', y: 80});
    });

    it('renames a group, letting a loose radio join one but not merging two', async () => {
      const {builder, saveField} = await renderGroups();

      await builder.saveGroupName(builder.findField('joint'), 'other');
      expect(builder.groupError).toBeTruthy();
      expect(saveField).not.toHaveBeenCalled();

      await builder.saveGroupName(builder.findField('joint'), 'Filing Status');
      expect(saveField.mock.calls.map(call => call[1])).toEqual([{group: 'filingstatus'}, {group: 'filingstatus'}, {group: 'filingstatus'}]);

      saveField.mockClear();
      await builder.saveGroupName(builder.findField('loose'), 'other');
      expect(saveField.mock.calls).toEqual([['loose', {group: 'other'}]]);
    });

    it('lines options up on their left edges and spaces them evenly', async () => {
      const {builder, saveField} = await renderGroups();

      await builder.arrangeGroup(builder.findField('joint'), 'align');
      expect(saveField.mock.calls.map(call => call.slice(0, 2))).toEqual([['separate', {x: 50, y: 500}]]);

      saveField.mockClear();
      await builder.arrangeGroup(builder.findField('joint'), 'space');
      expect(saveField.mock.calls.map(call => call.slice(0, 2))).toEqual([['joint', {x: 50, y: 600}]]);
    });

    it('draws the selected group with its order and a button to add an option', async () => {
      const {page, builder, addField} = await renderGroups();
      const layer = page.doc.createElement('div');
      page.root.appendChild(layer);
      for (const field of groupTemplate.fields) {
        const el = page.doc.createElement('div');
        el.id = getFieldId(field as any);
        el.setAttribute('fieldname', field.name);
        el.appendChild(page.doc.createElement('span')).className = 'vb-face';
        layer.appendChild(el);
      }
      const fieldEl = (name: string) => page.doc.getElementById(`verdocs-doc-fld-${name}`);

      builder.selectField('joint');
      expect(fieldEl('joint').classList.contains('verdocs-field-selected')).toBe(true);
      expect(['single', 'separate', 'spouse-single'].map(name => fieldEl(name).classList.contains('vb-group-member'))).toEqual([true, true, false]);
      expect(['single', 'joint', 'separate'].map(name => fieldEl(name).querySelector('.vb-order')?.textContent)).toEqual(['1', '2', '3']);

      (layer.querySelector('.vb-add-option') as HTMLElement).click();
      expect(addField).toHaveBeenCalledTimes(1);

      builder.selectField('loose');
      expect(page.root.querySelectorAll('.vb-group-member').length).toEqual(0);
      expect(page.root.querySelectorAll('.vb-order').length).toEqual(1);
    });
  });

  it('switches contrast with its prop', async () => {
    const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields contrast="high"></verdocs-builder-fields>'});
    const contrastClasses = () => page.root.className.split(' ').filter(name => name.startsWith('contrast-'));
    expect(contrastClasses()).toEqual(['contrast-high']);

    page.root.contrast = 'normal';
    await page.waitForChanges();
    expect(contrastClasses()).toEqual(['contrast-normal']);

    page.root.contrast = 'auto';
    await page.waitForChanges();
    expect(contrastClasses()).toEqual([]);
  });

  it('shows the recipient number once per radio group', async () => {
    const page = await newSpecPage({components: [VerdocsBuilderFields], html: '<verdocs-builder-fields></verdocs-builder-fields>'});
    const fields = [
      {name: 'r1', type: 'radio', group: 'filing', role_name: 'Spouse'},
      {name: 'r2', type: 'radio', group: 'filing', role_name: 'Spouse'},
      {name: 'note', type: 'textbox', role_name: 'Spouse'},
    ] as any[];
    const draw = (field: any) => {
      const el = page.doc.createElement('div');
      drawRecipientField(el, field, {roles: [{name: 'Taxpayer'}, {name: 'Spouse'}], fields} as any);
      return el.querySelector('.vb-marker')?.textContent ?? null;
    };

    expect(fields.map(draw)).toEqual(['2', null, '2']);
  });
});
