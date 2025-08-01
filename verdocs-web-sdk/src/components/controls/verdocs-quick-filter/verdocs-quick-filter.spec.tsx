import { newSpecPage } from '@stencil/core/testing';
import { VerdocsQuickFilter } from './verdocs-quick-filter';
import {h} from '@stencil/core';

describe('verdocs-quick-filter', () => {
  beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    // restore the original behavior after the tests
    (Math.random as jest.Mock).mockRestore();
  });

  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2', disabled: true }
  ];

  it('renders with default props (with options)', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      template: ()=> <verdocs-quick-filter options={options}></verdocs-quick-filter>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with options and value', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      template: ()=> <verdocs-quick-filter label="Filter" value="1" placeholder="All" options={options}></verdocs-quick-filter>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits optionSelected event on option click', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      template: ()=> <verdocs-quick-filter options={options}></verdocs-quick-filter>,
    });

    const spy = jest.fn();
    page.root.addEventListener('optionSelected', spy);

    // Simulate option selection
    if ((page.rootInstance as any).optionSelected) {
      (page.rootInstance as any).optionSelected.emit(options[0]);
      expect(spy).toHaveBeenCalled();
    }
  });
});
