export default class RangePicker {

  subElements = {}
  rangeSelected = true
  isOpenedRangePicker = false

  constructor({
    from = new Date(),
    to = new Date()
  } = {}) {

    this.range = [from, to];

    const firstDate = new Date(to);
    const secondDate = new Date(to);
    const monthOfSecondDate = secondDate.getMonth();

    firstDate.setMonth(monthOfSecondDate - 1);
    

    this.shownMonth = {
      firstDate: firstDate,
      secondDate: secondDate,
    };
    this.render();
  }

  getRangeInput() {
    const [from, to] = this.range;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
    return (
      ` <span data-element="from">${from.toLocaleDateString('ru', options)}</span> -
        <span data-element="to">${to.toLocaleDateString('ru', options)}</span>`
    );
  }

  getBtnOfRangeCell(date) {
    const [from, to] = this.range;
    const classNames = ['rangepicker__cell'];
  
    const dateInMillSec = date.getTime();
    const fromInMillSec = from.getTime();
    
    if (dateInMillSec === fromInMillSec) {classNames.push('rangepicker__selected-fromadfadsfasdf');}
    if (this.rangeSelected) {
      const toInMillSec = to.getTime();
      if (dateInMillSec === toInMillSec) {classNames.push('rangepicker__selected-to');}
      if (dateInMillSec > fromInMillSec && dateInMillSec < toInMillSec) {classNames.push('rangepicker__selected-between');}
    }
    return (
      `<button type="button" 
               class="${classNames.join(' ')}"
               data-value="${date}"
        >
            ${date.getDate()}
        </button>`
    );
  }

  getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return 32 - new Date(year, month, 32).getDate();
  }

  getRangeCell(date) {
    const currentDate = new Date(date);
    const daysInMonthForFrom = this.getDaysInMonth(currentDate);
    const supportingArrow = Array(daysInMonthForFrom).fill(0);
    
    return supportingArrow.map((_, index) => {
      const day = index + 1;
      currentDate.setDate(day);
      return this.getBtnOfRangeCell(currentDate);
    }).join('');
  }

  getCalendar(date) {
    return (
      ` <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
                <time datetime="November">${date.toLocaleDateString('ru', {month: 'long'})}</time>
            </div>
            <div class="rangepicker__day-of-week">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <div class="rangepicker__date-grid">
                ${this.getRangeCell(date)}
            </div>
        </div>`
    );
  }

  getSelector() {
    const { firstDate, secondDate } = this.shownMonth;
    return (
      ` <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left" data-element="controlLeft"></div>
        <div class="rangepicker__selector-control-right" data-element="controlRight"></div>
        ${this.getCalendar(firstDate)}
        ${this.getCalendar(secondDate)}`
    );
  }

  getElement() {
    const wrapper = document.createElement('div');
    const rangePickerElement = (
      `<div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
                ${this.getRangeInput()}
            </div>
            <div class="rangepicker__selector" data-element="selector"></div>
       </div>`
    );
    wrapper.innerHTML = rangePickerElement;
    return wrapper.firstElementChild;
  }

  switchShownDate(kindOfControlElement) {
    const { firstDate, secondDate } = this.shownMonth;

    const currentMonthOfFrom = firstDate.getMonth();
    const currentMonthOfTo = secondDate.getMonth();

    const switcher = {
      controlLeft: () => {
        firstDate.setMonth(currentMonthOfFrom - 1);
        secondDate.setMonth(currentMonthOfTo - 1);
      },
      controlRight: () => {
        firstDate.setMonth(currentMonthOfFrom + 1);
        secondDate.setMonth(currentMonthOfTo + 1);
      }
    };
    switcher[kindOfControlElement]();
  }

  switchRange(newDate) {
    const { input } = this.subElements;

    const index = this.rangeSelected ? 0 : 1;
    this.range[index] = newDate;

    if (this.range[0].getTime() > newDate.getTime()) {
      this.range = this.range.reverse();
    }

    this.rangeSelected = this.rangeSelected === true ? false : true;

    if (this.rangeSelected) { 
      input.innerHTML = this.getRangeInput();
      this.element.dispatchEvent(new CustomEvent('date-select', {
        bubles: true,
        detail: this.range,
      }));
      this.closeRangePicker();
    }
  }

  selectorHandler = (event) => {
    const { selector } = this.subElements;

    const target = event.target; 
    const {element: datasetElemet, value: datasetValue} = target.dataset; 

    if (datasetElemet && datasetElemet.includes('control')) {this.switchShownDate(datasetElemet);}
    if (datasetValue) {this.switchRange(new Date(datasetValue));}

    selector.innerHTML = this.getSelector();
  }


  closeRangePicker() {
    const { selector } = this.subElements;

    this.element.classList.remove('rangepicker_open');
    this.isOpenedRangePicker = false;

    selector.innerHTML = '';
  }

  openRangePicker() {
    const { selector } = this.subElements;

    this.element.classList.add('rangepicker_open');
    this.isOpenedRangePicker = true;

    selector.innerHTML = this.getSelector();
  }

  toggleOfOpenHandler = (event) => {
    const { input } = this.subElements;
    const pathsOfElements = event.composedPath();

    if (
      !pathsOfElements.includes(this.element)
      || pathsOfElements.includes(input) && this.isOpenedRangePicker
    ) { 
      this.closeRangePicker();
      return;
    }

    this.openRangePicker();

  }

  removeEventListeners() {
    document.removeEventListener('click', this.toggleOfOpenHandler, true);
  }

  addEventListeners() {
    const { selector } = this.subElements;
    selector.addEventListener('click', this.selectorHandler);
    document.addEventListener('click', this.toggleOfOpenHandler, true);
  }

  getSubElements() {
    const result = {};
    const dataElements = this.element.querySelectorAll('[data-element]');

    for (const dataElement of dataElements) {
      const name = dataElement.dataset.element;
      result[name] = dataElement;
    }
    return result;
  }

  render() {
    this.element = this.getElement();
    this.subElements = this.getSubElements();
    this.addEventListeners();
  }

  remove() {
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}
