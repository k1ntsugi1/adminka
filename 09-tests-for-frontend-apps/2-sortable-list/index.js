export default class SortableList {
  constructor({items}) {
    this.items = this.addClasses(items);
    this.render();
  }

  addClasses(items) {
    return items.map((element) => {
      element.classList.add('sortable-list__item');
      element.setAttribute('data-element', 'sortableItem');
      return element;
    });
  }

  getElement() {
    const element = document.createElement('div');
    element.classList.add('sortable-list');
    element.setAttribute('data-element', 'sortableList');
    element.append(...this.items);
    return element;
  }

  getProps(styles, neededStyles) {
    const filteredStyle = neededStyles.map(styleName => { return [[styleName], styles[styleName]]; });
    return Object.fromEntries(filteredStyle);
  }

  setProps(element, styles) {
    Object.entries(styles).forEach(([styleName, value]) => {
      element.style[styleName] = value + 'px'; 
    });
  }

  deleteProps(element, styles) {
    styles.forEach(styleName => element.style[styleName] = '');
  }

  getPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('sortable-list__placeholder');
    return placeholder;
  }

  setShifts(element) {
    this.leftShift = element.offsetLeft + element.offsetWidth / 2;
    this.topShift = element.offsetTop + element.offsetHeight / 2;
  }

  handlerDrop = () => {
    this.element.replaceChild(this.sortableItem, this.placeholder);
    this.sortableItem.classList.remove('sortable-list__item_dragging');
    this.deleteProps(this.sortableItem, ['left', 'top', 'width', 'height']);

    document.removeEventListener('pointermove', this.handlerMove);
    document.removeEventListener('pointerup', this.handlerDrop);
  }

  handlerMove = (event) => {
    const { clientX, clientY } = event;
    const left = clientX - this.leftShift;
    const top = clientY - this.topShift;

    this.setProps(this.sortableItem, {left, top});
    const {zIndex: zIndexOfSortableItem} = getComputedStyle(this.sortableItem);

    this.sortableItem.style.zIndex = -1000;
    const belowElement = document.elementFromPoint(clientX, clientY);
    this.sortableItem.style.zIndex = zIndexOfSortableItem;

    if (!belowElement) {return;}

    const placeOfDrop = belowElement.closest('[data-element="sortableItem"]');

    if (placeOfDrop && placeOfDrop !== this.sortableItem && placeOfDrop !== this.placeholder) {
      const { left, top } = placeOfDrop.getBoundingClientRect();
      const { left: currentLeft, top: currentTop } = this.sortableItem.getBoundingClientRect();

      if ((Math.abs(currentLeft - left) < 10) && (Math.abs(currentTop - top) < 10)) {
        if (currentTop - top < 0) {
          placeOfDrop.before(this.placeholder);
          return;
        }
        placeOfDrop.after(this.placeholder);
      }
    }
  }

  handlerDrag = (event) => {
    if (!event.target.closest('[data-grab-handle]')) { return; }

    this.sortableItem = event.target.closest('[data-element="sortableItem"]');
    this.placeholder = this.getPlaceholder();

    const stylesForPositioning = this.sortableItem.getBoundingClientRect();

    const stylesOfSortableTarget = this.getProps(stylesForPositioning, ['left', 'top', 'width', 'height']);
    const stylesOfPlaceholder = this.getProps(stylesForPositioning, ['width', 'height']);

    this.setProps(this.sortableItem, stylesOfSortableTarget);
    this.setProps(this.placeholder, stylesOfPlaceholder);

    this.setShifts(event.target);

    this.sortableItem.classList.add('sortable-list__item_dragging');
    this.sortableItem.after(this.placeholder);

    document.addEventListener('pointermove', this.handlerMove);
    document.addEventListener('pointerup', this.handlerDrop);
  }

  handlerRemove = (event) => {
    const target = event.target;
    if (!target.closest('[data-delete-handle]')) {return;}
    target.closest('[data-element="sortableItem"]').remove();
  }

  render() {
    this.element = this.getElement();
    this.element.addEventListener('pointerdown', this.handlerDrag);
    this.element.addEventListener('pointerdown', this.handlerRemove);
  }

  remove() {
    this.element.remove();
    this.sortableItem = null;
    this.leftShift = 0;
    this.topShift = 0;
  }
  destroy() {
    this.remove();
  }
}
