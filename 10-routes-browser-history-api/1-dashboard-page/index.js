import RangePicker from './components/range-picker/src/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import Tooltip from '../../06-events-practice/2-tooltip/index.js';

import header from './bestsellers-header.js';


const firstDate = new Date();
const secondDate = new Date();

const monthOfSecondDate = secondDate.getMonth();
firstDate.setMonth(monthOfSecondDate - 1);


const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class DashboardPage {
  subElements = {}
  elements = []
  constructor(mainClass, range = {
    from: firstDate,
    to: secondDate
  }) {

    this.range = range;
    this.mainClass = mainClass;

    this.inputData = {
      rangePicker: [this.range],
      chart: [{range: this.range, link: '#', url: 'api/dashboard/'}], // dont fogget join url
      sortableTable: [header, {range: this.range, url: 'api/dashboard/bestsellers', isSortLocally: true}] 
    };

    this.containersForFillig = ['rangePicker', 'orders-chart', 'sales-chart', 'customers-chart', 'sortableTable'];

    this.components = [
      ['rangePicker', RangePicker, this.inputData.rangePicker],
      ['chart', ColumnChart, this.inputData.chart],
      ['sortableTable', SortableTable, this.inputData.sortableTable],
    ];
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

  async update() {
    console.log(this.inputData.rangePicker[0]);
    const progressbar = document.querySelector('.progress-bar');
    progressbar.hidden = false;
    const elements = await this.getElements();
    elements.forEach(([containerOfElement, element]) => {
      this.elements.push(element.element);
      containerOfElement.append(element.element);
    });
    progressbar.hidden = true;
  }

  async render() {
    this.element = this.dashbordTemplate();
    this.setSubElements();
    await this.update();
    (new Tooltip()).initialize();
    

    this.element.addEventListener('date-select', async (event) => {
      const { from, to } = event.detail;
      this.range.from = new Date(from);
      this.range.to = new Date(to);
      this.elements.forEach(element => {
        if (!element.toString().includes('Range')) {element.remove();}
        console.log(element);
      });
      await this.update();
    });
    return this.element;
  }
}
//
