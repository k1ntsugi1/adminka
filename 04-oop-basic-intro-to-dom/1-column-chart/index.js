/**Исходя из Network (для образцового проекта):
*   1) response -  объект данных формата "ДАТА: ЧИСЛО" (UPD - буду передавать массив, чтобы не делать это в конструкторе или в методах),
*   2) request - url содержит какие данные мы хотим получить и с какой даты (sales || customers; from...)
    +
    В тестах сигнатура:
*   data: [], // values[]
*   label: '',
*   link: '',
*   value: 0
    ?formatHeading -> USD
**/


export default class ColumnChart {
  //static maxChartHeight = 50; // общее свойство, тесты не проходят, почему так не надо?

  constructor({data = [], label = '', link = '', value = 0, formatHeading = null} = {}) {
    this.data = data;
    this.totalValueOfData = value || this._getTotalValueOfData();
    //this.formatHeading = formatHeading === null ? (item) => item : formatHeading;
    this.title = label;
    this.linkOfTitle = link.length > 0 ? this._getLinkOfTitle() : '';
    
    this.chartHeight = 50;
    this.scale = data.length > 0 ? this.chartHeight / Math.max(...data) : 1;
      

    this.render();
  }
  _getTotalValueOfData() {
    const sum = this.data.reduce((acc, num)=> {
      acc += num;
      return acc;
    }, 0);
    return sum;
    //return Intl.NumberFormat(['en', 'ru'], {style: 'currency', currency: this.formatHeading}).format(sum);
  }
  _getLinkOfTitle() {
    return `<a class="column-chart__link" href="${this.link}">View all</a>`;
  }
  _createChart(value) { // => []
    return `<div style="--value: ${(value * this.scale).toFixed(0)}" data-tooltip="${Math.ceil(value / Math.max(...this.data) * 100)}%"></div>`;
  }
  _getColumnChartBody() {
    //console.log(this.data, this.scale);
    return this.data.map((value) => this._createChart(value)).join('');
  }
  get template() {
    const fragment = document.createElement('div');
    const bodyOfFragment = `
                <div class="column-chart" style="--chart-height: 50">
                    <div class="column-chart__title">
                        Total ${this.title}
                        ${this.linkOfTitle}
                    </div>
                    <div class="column-chart__container">
                        <div data-element="header" class="column-chart__header">
                            ${this.totalValueOfData}
                        </div>
                        <div data-element="body" class="column-chart__chart">
                          ${this.data.length > 0 ? this._getColumnChartBody() : ''}
                      </div>
                    </div>
                </div>
    `;
    fragment.innerHTML = bodyOfFragment;
    return fragment.firstElementChild;
  }
  render() {
    if (!this.elem) {this.element = this.template;}
    //console.log(this);
    return this.element;
  }
  update(newData = []) {
    this.remove();
    this.data = newData;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}

// const s = new ColumnChart({
//   data: [],
//   label: '',
//   link: '',
//   value: 0
// });

// console.log(JSON.stringify(s));