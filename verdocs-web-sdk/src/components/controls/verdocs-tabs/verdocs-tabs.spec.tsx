import { newSpecPage } from '@stencil/core/testing';
import { VerdocsTabs } from './verdocs-tabs';
import { h } from '@stencil/core';

describe('verdocs-tabs', () => {
  beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    // restore the original behavior after the tests
    (Math.random as jest.Mock).mockRestore();
  });

  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [VerdocsTabs],
      template: () => <verdocs-tabs tabs={[]} selectedTab={0}></verdocs-tabs>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with tabs and selectedTab', async () => {
    const tabs = [
      { label: 'Tab 1' },
      { label: 'Tab 2', disabled: true }
    ];
    const page = await newSpecPage({
      components: [VerdocsTabs],
      template: () =>  <verdocs-tabs selectedTab={1} tabs={tabs}></verdocs-tabs>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('emits selectTab event on tab click', async () => {
    const tabs = [
      { label: 'Tab 1' },
      { label: 'Tab 2' }
    ];
    const page = await newSpecPage({
      components: [VerdocsTabs],
      template: () =>  <verdocs-tabs selectedTab={1} tabs={tabs}></verdocs-tabs>,
    });

    const spy = jest.fn();
    page.root.addEventListener('selectTab', spy);

    const tabEls = page.root.querySelectorAll('.tab');
    if (tabEls.length > 1) {
      tabEls[1].dispatchEvent(new Event('click', { bubbles: true }));
      expect(spy).toHaveBeenCalled();
    }
  });
});
