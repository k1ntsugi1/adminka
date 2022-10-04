import RangePicker from '../../08-forms-fetch-api-part-2/2-range-picker/index.js';
import SortableTable from '../../07-async-code-fetch-api-part-1/2-sortable-table-v3/index.js';
import ColumnChart from '../../07-async-code-fetch-api-part-1/1-column-chart/index.js';
import Tooltip from '../../06-events-practice/2-tooltip/index.js';

import DashboardPage from './index.js';

import header from './bestsellers-header.js';


const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  static currentPage

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

    this.pages = {
        '/': 
    }
  }






  setSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      const name = element.dataset.element;
      this.subElements[name] = element;
    }
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

