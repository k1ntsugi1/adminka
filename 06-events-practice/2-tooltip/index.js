class Tooltip {
  constructor() {
    if (!Tooltip.instance) { Tooltip.instance = this; } 
    return Tooltip.instance;
  }

  render(dataOfTooltip = '') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip">${dataOfTooltip}</div>`;

    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  createTooltip(newDataOfTooltip) {
    this.element.textContent = newDataOfTooltip;
    document.body.append(this.element);
  }

  removeTooltip() {
    this.element?.remove();
  }

  destroy() {
    this.removeTooltip();
    this.removeEventListeners();
    this.element = null;
  }

  initialize () {
    this.render();
    this.addPointerOverListener();
    this.addPointerOutListener();
  }

  pointerOverHandler = (event) => {
    const tooltipTarget = event.target?.closest('[data-tooltip]');
    if (!tooltipTarget) {return;}
    
    const { dataset: 
      {
        tooltip: newDataOfTooltip,
      },
    } = tooltipTarget;

    this.createTooltip(newDataOfTooltip);
    this.addPointerMoveListener();
  }

  pointerOutHandler = () => {
    this.removeTooltip();
    this.removePointerMoveListener();
  }

  pointerMoveHandler = (event) => {
    const { clientX, clientY } = event;
    this.element.style.left = clientX + 10 + 'px';
    this.element.style.top = clientY + 15 + 'px';
  }

  addPointerMoveListener() {
    document.addEventListener('pointermove', this.pointerMoveHandler);
  }

  addPointerOutListener() {
    document.addEventListener('pointerout', this.pointerOutHandler);
  }

  addPointerOverListener() {
    document.addEventListener('pointerover', this.pointerOverHandler);
  }

  removePointerMoveListener() {
    document.removeEventListener('pointermove', this.pointerMoveHandler);
  }

  removePointerOverListener() {
    document.removeEventListener('pointerover', this.pointerOverHandler);
  }

  removePointerOutListener() {
    document.removeEventListener('pointerout', this.pointerOutHandler);
  }
  removeEventListeners() {
    this.removePointerOverListener();
    this.removePointerOutListener();
    this.removePointerMoveListener();
  }
}

export default Tooltip;
