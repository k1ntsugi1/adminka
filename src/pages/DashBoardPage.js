import RangePicker from '../components/RangePicker.js';
import SortableTable from '../components/SortableTable.js';
import ColumnChart from '../components/ColumnChart.js';
import Tooltip from '../components/Tooltip.js';

import header from '../store/bestsellers-header.js';

export default class DashboardPage {
  static containersForFillig = ['rangePicker', 'orders-chart', 'sales-chart', 'customers-chart', 'sortableTable'];

  subElements = {}
  elements = []

  constructor({mainClass, range, url}) {

    const [path, backendURL] = url;

    this.mainClass = mainClass;
    this.path = path;
    this.backendURL = backendURL;
    this.range = {
      from: new Date(range.from),
      to: new Date(range.to)
    };
    
    this.inputData = {
      rangePicker: [this.range],
      chart: [{range: this.range, link: '#'}], // dont fogget join pathname
      sortableTable: [header, {
        range: this.range, 
        url: (new URL(this.path + 'bestsellers', this.backendURL)).toString(),
        isSortLocally: true
      }] 
    };

    this.components = [
      ['rangePicker', RangePicker, this.inputData.rangePicker],
      ['chart', ColumnChart, this.inputData.chart],
      ['sortableTable', SortableTable, this.inputData.sortableTable],
    ];

    this.render();
  }

  get dashbordElement() {
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
    const elements = Object.entries(this.subElements).flatMap(([nameOfContainer, container]) => {
      if (!DashboardPage.containersForFillig.includes(nameOfContainer)) {return [];}

      const component = this.components.find(([name]) => nameOfContainer.includes(name));
    
      if (!component) {return [];}

      const [nameOfConstructor, Constructor, dataAsArray] = component;

      if (nameOfConstructor === 'chart') {
        const [typeOfChart] = nameOfContainer.match(/^[a-z0-9]+/);

        const data = {...dataAsArray[0]};
        data.label = typeOfChart;
        data.url = (new URL(this.path + typeOfChart, this.backendURL)).toString();

        const elementHTML = new Constructor(data);
        return [[container, elementHTML]];
      }

      const elementHTML = new Constructor(...dataAsArray);
      return [[container, elementHTML]];
    });
    return await Promise.all(elements);
  }

  async update() {
    this.mainClass.toggleProgressbar();


    const components = await this.getElements();

    components.forEach(([containerOfElement, element]) => {
      this.elements.push(element.element);
      containerOfElement.append(element.element);
    });

    this.mainClass.toggleProgressbar();
  }

  updateRange(newRange) {
    const { from, to } = newRange;
    
    this.range.from = new Date(from);
    this.range.to = new Date(to);

    this.mainClass.range.from = new Date(from);
    this.mainClass.range.to = new Date(to);
  }

  changeRangeHandler = (event) => {
    this.updateRange(event.detail);

    this.elements.forEach(element => {element.remove();});
    this.elements = [];

    this.update();
  }

  addEventListeners() {
    this.element.addEventListener('date-select', this.changeRangeHandler);
  }

  async render() {
    this.element = this.dashbordElement;

    this.setSubElements();

    await this.update();

    (new Tooltip()).initialize();
    this.addEventListeners();
    
    return this.element;
  }

  remove() {
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
  }
}
