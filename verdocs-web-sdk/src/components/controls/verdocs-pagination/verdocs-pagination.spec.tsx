import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { VerdocsQuickFilter } from './verdocs-pagination';

describe('verdocs-pagination', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      html: `<verdocs-pagination></verdocs-pagination>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with custom selectedPage, itemCount, and perPage', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      template: () => <verdocs-pagination selectedPage={2} itemCount={100} perPage={20}></verdocs-pagination>,
    });
    expect(page.root).toMatchSnapshot();
    expect(page.rootInstance.selectedPage).toBe(2);
    expect(page.rootInstance.itemCount).toBe(100);
    expect(page.rootInstance.perPage).toBe(20);
  });

  it('emits selectPage event on page button click', async () => {
    const page = await newSpecPage({
      components: [VerdocsQuickFilter],
      template: () => <verdocs-pagination selectedPage={1} itemCount={50} perPage={10}></verdocs-pagination>,
    });
    const spy = jest.fn();
    page.root.addEventListener('selectPage', spy);

    // Simulate clicking the second page button
    const pageButtons = page.root.querySelectorAll('.page-button');
    if (pageButtons.length > 1) {
      pageButtons[1].dispatchEvent(new Event('click', { bubbles: true }));
      expect(spy).toHaveBeenCalled();
    }
  });
});
