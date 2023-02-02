import {Component, Element, Event, EventEmitter, h, Host, Prop} from '@stencil/core';

const getTop = (el: any) => el.offsetTop + (el.parentElement && getTop(el.parentElement));
const getLeft = (el: any) => el.offsetLeft + (el.parentElement && getLeft(el.parentElement));

// @see https://stackoverflow.com/a/49186677/1812436
const getScrollParent = node => {
  const regex = /(auto|scroll)/;
  const parents = (_node, ps) => {
    if (_node.parentNode === null) {
      return ps;
    }
    return parents(_node.parentNode, ps.concat([_node]));
  };

  const style = (_node, prop) => getComputedStyle(_node, null).getPropertyValue(prop);
  const overflow = _node => style(_node, 'overflow') + style(_node, 'overflow-y') + style(_node, 'overflow-x');
  const scroll = _node => regex.test(overflow(_node));

  const scrollParent = _node => {
    if (!(_node instanceof HTMLElement || _node instanceof SVGElement)) {
      return;
    }

    const ps = parents(_node.parentNode, []);

    for (let i = 0; i < ps.length; i += 1) {
      if (scroll(ps[i])) {
        return ps[i];
      }
    }

    return document.scrollingElement || document.documentElement;
  };

  return scrollParent(node);
};

export interface IOption {
  id: string;
  icon: string;
  tooltip: string;
}

/**
 * Floating Action Button style menu. For proper placement, this should be added to the DOM inside a container that is set to
 * `overflow-y: scroll;`. The component will detect that placement and position itself in the bottom-right corner on top of the
 * container. It will be absolutely positioned so it will be unaffected by scrolling the container.
 */
@Component({
  tag: 'verdocs-floating-menu',
  styleUrl: 'verdocs-floating-menu.scss',
  shadow: false,
})
export class VerdocsFloatingMenu {
  @Element()
  el: HTMLElement;

  /**
   * The role that this contact will be assigned to.
   */
  @Prop() options: IOption[] = [];

  /**
   * Event fired when a menu option is clicked.
   * Web Component events need to be "composed" to cross the Shadow DOM and be received by parent frameworks.
   */
  @Event({composed: true}) optionSelected: EventEmitter<IOption>;

  menuContainer: HTMLElement = null;
  scrollParent: HTMLElement = null;
  scrollParentParent: HTMLElement = null;

  componentDidLoad() {
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'verdocs-floating-menu';

    let el = document.createElement('div');
    el.className = 'trigger';
    el.innerText = '+';
    this.menuContainer.append(el);

    el = document.createElement('div');
    el.className = 'options';
    this.menuContainer.append(el);

    const localhandleSelect = this.handleSelect.bind(this);
    this.options.forEach(option => {
      const childEl = document.createElement('div');
      childEl.className = 'option';
      childEl.addEventListener('click', () => localhandleSelect(option));
      el.append(childEl);

      const iconEl = document.createElement('verdocs-toolbar-icon');
      iconEl.setAttribute('icon', option.icon);
      iconEl.setAttribute('text', option.tooltip);
      iconEl.setAttribute('placement', 'left');
      childEl.append(iconEl);
    });

    document.body.append(this.menuContainer);

    this.scrollParent = getScrollParent(this.el);
    if (this.scrollParent) {
      this.scrollParentParent = this.scrollParent.parentElement;
      this.repositionTrigger(this.scrollParent);
    }
  }

  disconnectedCallback() {
    this.menuContainer?.remove();
  }

  handleSelect(option: IOption) {
    this.optionSelected?.emit(option);
    const el = document.getElementById('verdocs-floating-menu');
    if (el) {
      el.className = 'force-closed';
      setTimeout(() => {
        el.className = '';
      }, 100);
    }
  }

  repositionTrigger(scrollParent: HTMLElement) {
    const scrollParentParent = scrollParent.parentElement;
    if (scrollParentParent) {
      const bounds = scrollParentParent.getBoundingClientRect();
      const menu = document.getElementById('verdocs-floating-menu');
      if (menu) {
        menu.style.bottom = `${document.documentElement.clientHeight - (document.documentElement.scrollTop + bounds.bottom) + 10}px`;
        menu.style.left = `${bounds.right - 80}px`;
      }
    }
  }

  render() {
    return <Host />;
  }
}
