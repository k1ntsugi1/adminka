export default class ColumnChart {
  static maxChartHeight = 50;

  constructor({data = [], label: title = '', link = '', value = 0, formatHeading = item => `${item}`} = {}) {
    this.data = data;

    this.formatHeading = formatHeading;
    this.totalValueOfData = this._getTotalValueOfData(value); 
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
    return this.formatHeading(totalValue);
  }
  _getLinkOfTitle(link) {
    return !link.length
      ? ''
      : `<a class="column-chart__link" href="${link}">View all</a>`;
  }
  _createChart(currentValue) {
    const currentValueByScale = Math.floor(this.scale * currentValue);
    const currentValueByPercent = (currentValue / Math.max(...this.data) * 100).toFixed(0);
    return `<div style="--value: ${currentValueByScale}" data-tooltip="${currentValueByPercent}%"></div>`;
  }
  _getColumnChartBody() {
    return this.data.map((currentValue) => this._createChart(currentValue)).join('');
  }
  get _elementOfBodyColumnChart() {
    const element = document.createElement('div');
    const bodyOfElement = `
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
    element.innerHTML = bodyOfElement;
    return element.firstElementChild;
  }
  render() {
    if (!this.element) {this.element = this._fragmentOfBodyColumnChart;}
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

