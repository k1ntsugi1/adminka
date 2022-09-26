import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
    static maxChartHeight = 50;

    constructor({
      label: title = '',
      range = {
        from: (new Date()).toISOString(),
        to: (new Date()).toISOString()
      },
      url = `/api/dashboard/${title}`,
      link = '#',
      formatHeading = item => `${item}`
    } = {}) {
      this.data = [];
      this.formatHeading = formatHeading;

      this.range = range;
      this.url = new URL(url, BACKEND_URL);
      this.updateURLByRange();

      this.title = title;
      this.linkOfTitle = this.getLinkOfTitle(link);

      this.chartHeight = this.constructor.maxChartHeight;
      this.scale = this.getScale();

      this.render();
    }
    getScale() {
      return this.data.length > 0 ? (this.chartHeight / Math.max(...this.data)) : 1;
    }
    getTotalValueOfData() {
      const totalValueOfData = this.data.reduce((acc, num) => {
        acc += num;
        return acc;
      }, 0);
      return this.formatHeading(totalValueOfData);
    }
    getLinkOfTitle(link) {
      return !link.length
        ? ''
        : `<a class="column-chart__link" href="${link}">View all</a>`;
    }
    createChart(currentValue) {
      const currentValueByScale = Math.floor(this.scale * currentValue);
      const currentValueByPercent = (currentValue / Math.max(...this.data) * 100).toFixed(0);
      return `<div style="--value: ${currentValueByScale}" data-tooltip="${currentValueByPercent}%"></div>`;
    }
    getColumnChartBody() {
      return this.data.map((currentValue) => this.createChart(currentValue)).join('');
    }
    get elementOfBodyColumnChart() {
      const element = document.createElement('div');
      const bodyOfElement = `
                  <div class="column-chart ${!this.data.length ? 'column-chart_loading' : ''}" style="--chart-height: ${ColumnChart.maxChartHeight}">
                      <div class="column-chart__title">
                          Total ${this.title}
                          ${this.linkOfTitle}
                      </div>
                      <div class="column-chart__container">
                          <div data-element="header" class="column-chart__header">
                              ${this.getTotalValueOfData()}
                          </div>
                          <div data-element="body" class="column-chart__chart">
                            ${this.getColumnChartBody()}
                        </div>
                      </div>
                  </div>
      `;
      element.innerHTML = bodyOfElement;
      return element.firstElementChild;
    }

    async getData() {
      try {
        const response = await fetch(this.url.toString());
        const JSONresponse = await response.json();
        return JSONresponse;
      } catch (error) {
        throw new Error(error);
      }

    }

    render() {
      this.element = this.elementOfBodyColumnChart;
      this.subElements = this.getSubElements();
      this.update();
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

    updateURLByRange() {
      this.url.searchParams.set('from', this.range.from);
      this.url.searchParams.set('to', this.range.to);
    }

    async update(from = this.range.from, to = this.range.to) {
      const { header, body } = this.subElements;
      this.range = { ...this.range, ...{from: from.toISOString(), to: to.toISOString()} };
      this.updateURLByRange();

      this.element.classList.add('column-chart_loading');
      const JSONData = await this.getData();

      this.data = Object.values(JSONData);
      this.scale = this.getScale();

      header.textContent = this.getTotalValueOfData();
      body.innerHTML = this.getColumnChartBody();

      this.element.classList.remove('column-chart_loading');
      return JSONData;
    }
    remove() {
        this.element?.remove();
    }
    destroy() {
      this.remove();
      this.element = null;
    }
}


