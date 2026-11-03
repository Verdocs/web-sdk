import {newSpecPage} from '@stencil/core/testing';
import {VerdocsBuilder} from './verdocs-builder';
import {Store} from '../../../utils/Datastore';

const template = {id: 'T1', roles: [], documents: [], fields: []};

describe('verdocs-builder', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders without crashing', async () => {
    const page = await newSpecPage({
      components: [VerdocsBuilder],
      html: '<verdocs-builder></verdocs-builder>',
    });
    expect(page.root).toBeTruthy();
  });

  it('keeps one template listener across step changes', async () => {
    const subscribe = jest.spyOn(Store, 'subscribe').mockImplementation((_table, _row, _getter, _force, callback: any) => {
      callback(template);
      return `listener-${subscribe.mock.calls.length}`;
    });
    const delListener = jest.spyOn(Store.store, 'delListener');

    const page = await newSpecPage({
      components: [VerdocsBuilder],
      html: '<verdocs-builder template-id="T1" step="preview"></verdocs-builder>',
    });

    page.root.step = 'roles';
    await page.waitForChanges();
    page.root.step = 'preview';
    await page.waitForChanges();

    expect(subscribe).toHaveBeenCalledTimes(3);
    expect(delListener.mock.calls).toEqual([['listener-1'], ['listener-2']]);

    page.root.remove();
    await page.waitForChanges();
    expect(delListener).toHaveBeenLastCalledWith('listener-3');
  });
});
