/**Исходя из Network (для образцового проекта):
*   1) response -  объект данных формата "ДАТА: ЧИСЛО" (UPD - буду передавать массив, чтобы не делать это в конструкторе или в методах),
*   2) request - url содержит какие данные мы хотим получить и с какой даты (sales || customers; from...)
    +
    В тестах сигнатура:
*   data: [], // values[] UPD - в задании как раз скзано что переадется массив
*   label: '',
*   link: '',
*   value: 0
    ?formatHeading -> USD
**/


export default class ColumnChart {
  static maxChartHeight = 50; // общее свойство;

  constructor({data = [], label: title = '', link = '', value = 0, formatHeading = item => `${item}`} = {}) {
    this.data = data;

    this.formatHeading = formatHeading;
    this.totalValueOfData = this._getTotalValueOfData(value); // Так и не понял, value может как передаться (тогда оставляем его), так и нет (тогда находим total)? 
    this.title = title;
    this.linkOfTitle = this._getLinkOfTitle(link);
    
    this.chartHeight = this.constructor.maxChartHeight;
    this.scale = this._getScale();
      
    this.render();
  }
  _getScale() {
    return this.data.length > 0 ? (this.chartHeight / Math.max(...this.data)) : 1;
  }
  _getTotalValueOfData(value) {
    let totalValue;
    if (value !== 0) {totalValue = value;}
    else {
      totalValue = this.data.reduce((acc, num)=> {
        acc += num;
        return acc;
      }, 0);
    }
    const formatedValue = new Intl.NumberFormat('en').format(totalValue);
    return this.formatHeading(formatedValue);
  }
  _getLinkOfTitle(link) {
    if (!link.length) {return '';}
    return `<a class="column-chart__link" href="${link}">View all</a>`;
  }
  _createChart(currentValue) { // => []
    const currentValueByScale = Math.floor(this.scale * currentValue);
    const currentValueByPercent = (currentValue / Math.max(...this.data) * 100).toFixed(0);
    return `<div style="--value: ${currentValueByScale}" data-tooltip="${currentValueByPercent}%"></div>`;
  }
  _getColumnChartBody() {
    return this.data.map((currentValue) => this._createChart(currentValue)).join('');
  }
  get _template() {
    const fragment = document.createElement('div');
    const bodyOfFragment = `
                <div class="column-chart ${!this.data.length && 'column-chart_loading'}" style="--chart-height: 50">
                    <div class="column-chart__title">
                        Total ${this.title}
                        ${this.linkOfTitle}
                    </div>
                    <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header">
                            ${this.totalValueOfData}
                        </div>
                        <div data-element="body" class="column-chart__chart">
                          ${this._getColumnChartBody()}
                      </div>
                    </div>
                </div>
    `;
    fragment.innerHTML = bodyOfFragment;
    return fragment.firstElementChild;
  }
  render() {
    if (!this.element) {this.element = this._template;}
    return this.element;
  }
  update(newData = []) {
    this.remove();
    this.data = newData;
    this.render();
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}

// На вопрос зачем я разбил все на методы - каждый метод выполняет только свою задачу и тогда, как мне кажется, читаемость кода лучше и понятнее ход действий.
// Правда чтобы понять как метод это делает, придется глазами поискать, поэтому, если класс с большим колличеством методов, то и искать придется дольше.
// Но с другой стороны, если нас интересует только интерфейс инстанса, то реализация через подобное разбиение на методы как по мне лучше.


//<---------------------------------------------------------Вопрос----------------------------------------------------->

// Что предпочтительнее? Если методы маленькие, то выносить их нет смысла и лучше прописывать в "больших"? Или это просто дело "вкуса и читаемости кода в целом"?

