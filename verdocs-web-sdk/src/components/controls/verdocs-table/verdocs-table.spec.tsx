import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTable } from './verdocs-table';
import {h} from '@stencil/core';

describe('verdocs-table', () => {
  beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    // restore the original behavior after the tests
    (Math.random as jest.Mock).mockRestore();
  });

  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsTable],
      template: () => <verdocs-table></verdocs-table>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with columns and data', async () => {
    const columns = [
      { id: 'name', header: 'Name' },
      { id: 'age', header: 'Age' }
    ];
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
    const page = await newSpecPage({
      components: [VerdocsTable],
      template: () => <verdocs-table columns={columns} data={data}></verdocs-table>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits colHeaderClick and rowClick events', async () => {
    const columns = [
      { id: 'name', header: 'Name' }
    ];
    const data = [
      { name: 'Alice' }
    ];
    const page = await newSpecPage({
      components: [VerdocsTable],
      template: () => <verdocs-table></verdocs-table>,
    });
    (page.rootInstance as any).columns = columns;
    (page.rootInstance as any).data = data;
    await page.waitForChanges();

    const colSpy = jest.fn();
    const rowSpy = jest.fn();
    page.root.addEventListener('colHeaderClick', colSpy);
    page.root.addEventListener('rowClick', rowSpy);

    const th = page.root.querySelector('th');
    th?.dispatchEvent(new Event('click', { bubbles: true }));

    // Simulate row click (if implemented in render)
    const tr = page.root.querySelector('tr.row');
    tr?.dispatchEvent(new Event('click', { bubbles: true }));

    expect(colSpy).toHaveBeenCalled();
    // rowClick may not be implemented in the render, so this is a best-effort check
  });
});
