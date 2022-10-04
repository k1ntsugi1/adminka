import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import Tooltip from '../../06-events-practice/2-tooltip/index.js';

import header from './bestsellers-header.js';


const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  static currentPage

  subElements = {}
  template = {};
  pathnameOfPageURL = window.location.pathname;

  constructor() {
    if (Page.currentPage) {return Page.currentPage;}
    Page.currentPage = this;

    const firstDate = new Date();
    const secondDate = new Date();

    const monthOfSecondDate = secondDate.getMonth();
    firstDate.setMonth(monthOfSecondDate - 1);

    this.range = {
      to: secondDate,
      from: firstDate
    };

    this.currentTemplate = {
      '/': this.dashbordTemplate,
      '/products': this.productsTemplate,
      '/categories': this.categoriesTemplate,
      '/sales': this.salesTemplate, 
    };

    this.inputDataAsArrayOfConstructors = this.getInputDataAsArrayOfConstructors();
    this.containersForFillig = this.getContainersForFillig();

    this.components = [
      ['rangePicker', RangePicker, this.inputDataAsArrayOfConstructors.rangePicker],
      ['chart', ColumnChart, this.inputDataAsArrayOfConstructors.chart],
      ['sortableTable', SortableTable, this.inputDataAsArrayOfConstructors.sortableTable],
    ];
  }

  getInputDataAsArrayOfConstructors() {
    const getter = {
      '/': () => {
        return {
          rangePicker: [Page.currentPage.range],
          chart: [{range: Page.currentPage.range, link: '#', url: 'api/dashboard/'}], // dont fogget join url
          sortableTable: [header, {range: Page.currentPage.range, url: 'api/dashboard/bestsellers', isSortLocally: true}] 
        };
      }
    };
    return getter[this.pathnameOfPageURL]();
  }

  getContainersForFillig() {
    const getter = {
      '/': () => {
        return ['rangePicker', 'orders-chart', 'sales-chart', 'customers-chart', 'sortableTable'];
      }
    };
    return getter[this.pathnameOfPageURL]();
  }

  updatePathnameOfPageURL() {
    this.pathnameOfPageURL = window.location.pathname;
    this.inputDataAsArrayOfConstructors = this.getInputDataAsArrayOfConstructors();
    this.containersForFillig = this.getContainersForFillig();
    this.render();
  }

  dashbordTemplate() {
    const wrapper = document.createElement('div');
    const dashbord = `
        <div class="dashboard">
            <div class="content__top-panel">
                <h2 class="page-title">Dashboard</h2>
                <div data-element="rangePicker"></div>
            </div>
            <div data-element="chartsRoot" class="dashboard__charts">
                <div data-element="orders-chart" class="dashboard__chart_orders"></div>
                <div data-element="sales-chart" class="dashboard__chart_sales"></div>
                <div data-element="customers-chart" class="dashboard__chart_customers"></div>
            </div>

            <h3 class="block-title">Best sellers</h3>

            <div data-element="sortableTable"></div>
        </div>`;
    wrapper.innerHTML = dashbord;
    return wrapper.firstElementChild;
  }

  setSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      const name = element.dataset.element;
      this.subElements[name] = element;
    }
  }

  async getElements() {
    const elements = Object.entries(this.subElements).flatMap(([nameOfContainer, containerOfElement]) => {
      if (!this.containersForFillig.includes(nameOfContainer)) {return [];}

      const component = this.components.find(([name]) => nameOfContainer.includes(name));
    
      if (!component) {return [];}

      const [nameOfConstructor, Constructor, dataAsArray] = component;
      if (nameOfConstructor === 'chart') {
        const typeOfChart = nameOfContainer.match(/^[a-z0-9]+/)[0];
        const data = {...dataAsArray[0]};
        data.label = typeOfChart;
        data.url += typeOfChart;
        const elementHTML = new Constructor(data);
        return [[containerOfElement, elementHTML]];
      }
      const elementHTML = new Constructor(...dataAsArray);
      return [[containerOfElement, elementHTML]];
    });
    return await Promise.all(elements);
  }

  async render() {
    this.element = this.currentTemplate[this.pathnameOfPageURL]();
    this.setSubElements();
    const elements = await this.getElements();
    elements.forEach(([containerOfElement, element]) => {containerOfElement.append(element.element);});
    if(this.pathnameOfPageURL === '/') (new Tooltip()).initialize();
    return this.element;
  }
}

