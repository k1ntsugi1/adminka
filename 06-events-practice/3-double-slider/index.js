export default class DoubleSlider {

  constructor({
    min = 0,
    max = 100,
    formatValue = value => `${value}`,
    selected = {
      from: min,
      to: max,
    }
  } = {}) {
    this.formatValue = formatValue;
    this.min = min;
    this.max = max;
    this.range = this.max - this.min;
    this.from = selected.from;
    this.to = selected.to;

    this.progressData = {
      left: ((this.from - min) / (this.range)) * 100,
      right: ((max - this.to) / (this.range)) * 100,
      nameOfSide: '',
    };

    this.getValueOfDrop = {
      left(thisOfDuobleSlider, clientX) {
          
        const {widthOfSlider, leftShiftOfSlider} = thisOfDuobleSlider;
        const { right } = thisOfDuobleSlider.progressData;
        const suppositiveValueOfDrop = +((clientX - leftShiftOfSlider) / widthOfSlider * 100).toFixed(0);

        if (suppositiveValueOfDrop < 0 || suppositiveValueOfDrop > right) {return null;}
        thisOfDuobleSlider.progressData.left = suppositiveValueOfDrop;
        return suppositiveValueOfDrop;
      },
      right(thisOfDuobleSlider, clientX) {
        const {widthOfSlider, leftShiftOfSlider} = thisOfDuobleSlider;
        const { left } = thisOfDuobleSlider.progressData;
        const suppositiveValueOfDrop = +((widthOfSlider - clientX + leftShiftOfSlider) / widthOfSlider * 100).toFixed(0);
    
        if (suppositiveValueOfDrop < 0 || suppositiveValueOfDrop > (100 - left)) {return null;}
        thisOfDuobleSlider.progressData.right = 100 - suppositiveValueOfDrop;

        return suppositiveValueOfDrop;
      }
    };

    this.render(); 
  }

  render() {
    const { left, right } = this.progressData;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = (
      `<div class="range-slider">
            <span data-element="from">${this.formatValue(this.from)}</span>
            <div class="range-slider__inner">
                <span data-element="progress" class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
                <span data-element="left" class="range-slider__thumb-left" style="left: ${left}%"></span>
                <span data-element="right" class="range-slider__thumb-right" style="right: ${right}%"></span>
            </div>
            <span data-element="to">${this.formatValue(this.to)}</span>
       </div>`
    );
    this.element = wrapper.firstElementChild;
    this.slider = this.element.querySelector('.range-slider__inner');
    this.subElements = this.getSubElements();
    this.slider.addEventListener('pointerdown', this.pointerDownHandler);
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    for (let element of elements) {
      const name = element.dataset.element;
      result[name] = element;
    }
    return result;
  }

  update(valueOfDrop) {
    const { nameOfSide } = this.progressData;

    const target = nameOfSide === 'left' ? this.subElements.from : this.subElements.to;
    const thumb = this.subElements[nameOfSide];
    const progress = this.subElements.progress;
    console.log(valueOfDrop);
    [progress.style[nameOfSide], thumb.style[nameOfSide]] = [`${valueOfDrop}%`, `${valueOfDrop}%`];
    target.textContent = this.formatValue(this.min + (this.range / 100 * this.progressData[nameOfSide]));
  }

  pointerMoveHandler = (event) => {
    const { nameOfSide } = this.progressData;
    const { clientX } = event;
    const valueOfDrop = this.getValueOfDrop[nameOfSide](this, clientX);
    if (valueOfDrop === null) {return;}
    this.update(valueOfDrop);
  }

  pointerUpHandler = () => {
    document.removeEventListener('pointerup', this.pointerUpHandler);
    document.removeEventListener('pointermove', this.pointerMoveHandler);
  }

  pointerDownHandler = (event) => {
    event.preventDefault();
    if (event.target === this.subElements.progress) { return; }

    this.progressData.nameOfSide = event.target.dataset.element;
    
    const widthOfSliderBorder = this.slider.clientLeft;
    this.widthOfSlider = this.slider.getBoundingClientRect().width - widthOfSliderBorder;
    this.leftShiftOfSlider = this.slider.getBoundingClientRect().left;

    document.addEventListener('pointermove', this.pointerMoveHandler);
    document.addEventListener('pointerup', this.pointerUpHandler);
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this.element.removeEventListener('pointerdown', this.pointerDownHandler);
  }
}
