class Tooltip {
  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    } 
    return Tooltip.instance;
  }

  render(dataOfTooltip = '') {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip" hidden>${dataOfTooltip}</div>`;

    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  showTooltip(newDataOfTooltip) {
    this.dataOftooltip = newDataOfTooltip;

    this.element.hidden = false;
    this.element.textContent = this.dataOftooltip;
    //document.body.append(this.element);
  }

  hideTooltip() {
    this.element.hidden = true;
    this.dataOftooltip = null;
    //document.body.removeChild(this.element);
  }

  destroy() {
    this.removeTooltipInDocument();
    this.removeEventListeners();
    this.element?.remove();
  }

  initialize () {
    this.render();
    this.addPointerOutListener();
  }

  pointerOutHandler = (event) => {
    const tooltipTarget = event.relatedTarget?.closest('[data-tooltip]');
    if (!tooltipTarget) {
      this.hideTooltip();
      this.removePointerMoveListener();
      return;
    }

    const { dataset: 
      {
        tooltip: newDataOfTooltip = null,
      },
    } = tooltipTarget;

    if (this.dataOftooltip === newDataOfTooltip) {return;}

    this.showTooltip(newDataOfTooltip);
    this.addPointerMoveListener();
  }

  pointerMoveHandler = (event) => {
    const { clientX, clientY } = event;
    this.element.style.left = clientX + 10 + 'px';
    this.element.style.top = clientY + 15 + 'px';
  }

  addPointerMoveListener() {
    document.addEventListener('pointermove', this.pointerMoveHandler);
  }

  removePointerMoveListener() {
    document.removeEventListener('pointermove', this.pointerMoveHandler);
  }

  addPointerOutListener() {
    document.addEventListener('pointerout', this.pointerOutHandler);
  }

  removePointerOutListener() {
    document.removeEventListener('pointerout', this.pointerOutHandler);
  }
  removeEventListeners() {
    this.removePointerOutListener();
    this.removePointerMoveListener();
  }
}

export default Tooltip;
