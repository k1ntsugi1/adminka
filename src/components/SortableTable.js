export default class SortableTable {
  subElements = {}
  statusOfLoading = 'fulfilled'
  data = []

  constructor(headerConfig, { 
    url = `/api/dashboard/bestsellers`,
    sorted: {
      id: field = headerConfig.find(cell => cell.sortable).id,
      order = 'asc'
    } = {},
    range: {
      from = (new Date('2022-08-28')).toISOString(),
      to = (new Date('2022-09-27')).toISOString() 
    } = {},
    isSortLocally = false,
  } = {}) {

    this.paramOfSort = {
      field,
      order,
      start: 0,
      end: 30,
      from,
      to
    };
    this.isSortLocally = isSortLocally;
    this.headerConfig = headerConfig;

    this.cells = this.headerConfig.map(item => item.id);
    this.url = new URL(url);

    this.templates = this.headerConfig.reduce((acc, headerItem) => {
      if (headerItem.template) {
        const { id, template } = headerItem;
        acc[id] = template;
      }
      return acc;
    }, {});

    this.render();
  }

  getArrowOfSort() {
    return (
      `<span class="sortable-table__sort-arrow">
        <span class="sortable-table__sort-arrow_${this.paramOfSort.order}"></span>
      </span>`
    );
  }

  getLoadingLine() {
    return (
      `<div data-elem="loading" class="loading-line sortable-table__loading-line"></div>`
    );
  }

  getMessageForEmptyDataOfLoading() {
    return (
      `<div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>`
    );
  }

  getCellOfTableHeader({ title, sortable, id }) {
    const isSortedCell = id === this.paramOfSort.field;
    const [dataOrder, elementOfSort] = isSortedCell 
      ? [`data-order="${this.paramOfSort.order}"`, this.getArrowOfSort()]
      : ['', ''];
    return (
      `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${dataOrder}">
        <span>${title}</span>
        ${elementOfSort}
      </div>`
    );
  }

  getTableHeader() {
    const elementsOfTableHeader = this.headerConfig.map(cellItem => this.getCellOfTableHeader(cellItem)).join('');
    return elementsOfTableHeader;
  }

  getCellOfTableBody(value, key) {
    return this.templates[key] 
      ? this.templates[key](value)
      : `<div class="sortable-table__cell">${value}</div>`;
  }

  getRowOfTableBody(rowItem) {
    return (
      `<a href="/products/${rowItem.id}" class="sortable-table__row">
        ${this.cells.map(key => this.getCellOfTableBody(rowItem[key], key)).join('')}
      </a>`
    );
  }

  getTableBody() {
    const elementsOfTableBody = this.data.map((rowItem => this.getRowOfTableBody(rowItem))).join('');
    return elementsOfTableBody;
  }

  getTableElement() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = (
      `<div class="sortable-table sortable-table_loading">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getTableHeader()}
        </div>
        <div data-element="body" class="sortable-table__body"></div>
        ${this.getLoadingLine()}
        ${this.getMessageForEmptyDataOfLoading()}
      </div>`
    );
    return wrapper.firstElementChild;
  }

  updateElement() {
    const { body, header } = this.subElements;
    header.innerHTML = this.getTableHeader();
    body.innerHTML = this.getTableBody();
  }

  updateQueryStringOfURL({ from, to, field, order, start, end } = this.paramOfSort) {
    this.url.searchParams.set('from', from);
    this.url.searchParams.set('to', to);
    this.url.searchParams.set('_sort', field);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);
  }

  sortByHeaderHandler = (event) => {
    if (this.statusOfLoading === 'pending') {return;}
    const sortableTarget = event.target.closest('div[data-sortable="true"]');
    if (!sortableTarget) {return;}
    let { dataset: 
      { 
        order = 'asc',  
        id: field
      } 
    } = sortableTarget;
    if (this.paramOfSort.field === field) {
      order = this.paramOfSort.order === 'asc' ? 'desc' : 'asc';
    }
    this.paramOfSort = {...this.paramOfSort, ...{field, order} };
    this.sort();
  }

  scrollHandler = () => {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    const windowHeight = document.documentElement.clientHeight;
    const scrolled = window.pageYOffset + windowHeight;
    const limitOfScrolling = scrollHeight - windowHeight / 6;

    if (scrolled > limitOfScrolling && this.statusOfLoading === 'fulfilled') {
      this.paramOfSort.end = this.paramOfSort.end + 30;
      this.getDataFromServer().then(data => { 
        this.data = data;
        this.updateElement();
      }); 
    }
  };

  resetParamsOfSortHandler = (startParams) => async () => {
    this.paramOfSort = startParams;
    this.data = await this.getDataFromServer();
    this.updateElement();
  }

  addEventListeners() {
    const { header, emptyPlaceholder} = this.subElements;
    header.addEventListener('pointerdown', this.sortByHeaderHandler);
    document.addEventListener('scroll', this.scrollHandler);
    emptyPlaceholder.addEventListener('click', this.resetParamsOfSortHandler({...this.paramOfSort}));
  }

  removeEventListeners() {
    const { header, emptyPlaceholder } = this.subElements; 
    header.removeEventListener('pointerdown', this.sortByHeaderHandler);
    document.removeEventListener('scroll', this.scrollBodyOfTableHandler);
    emptyPlaceholder.removeEventListener('click', this.resetParamsOfSortHandler({...this.paramOfSort}));
  }

  getSubElements() {
    const result = {};
    const subElements = this.element.querySelectorAll('div[data-element]');
    for (const subElement of subElements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }

  async render() {
    this.element = this.getTableElement();
    this.subElements = this.getSubElements();
    this.addEventListeners();

    this.data = await this.getDataFromServer();
    this.updateElement();
  }

  switchStatusOfLoading() {
    const switcherStatusOfLoading = {
      pending: () => {
        this.element.classList.remove('sortable-table_loading');
        this.statusOfLoading = 'fulfilled';
      },
      fulfilledWithEmptyValue: () => {
        this.element.classList.remove('sortable-table_loading');
        this.element.classList.add('sortable-table_empty');
        this.statusOfLoading = 'fulfilled';
      },
      fulfilled: () => {
        this.element.classList.add('sortable-table_loading');
        this.element.classList.remove('sortable-table_empty');
        this.statusOfLoading = 'pending';
      },
    };
    switcherStatusOfLoading[this.statusOfLoading]();
  }

  async getDataFromServer() {
    this.switchStatusOfLoading();
    this.updateQueryStringOfURL();

    const response = await fetch(this.url.toString());
    const sortedata = await response.json();

    if (!sortedata.length) { this.statusOfLoading = 'fulfilledWithEmptyValue';}
    this.switchStatusOfLoading();

    return sortedata;
  }

  async sortOnServer() {
    return await this.getDataFromServer();
  }

  sortOnClient() {
    const { field, order } = this.paramOfSort;
    const paramOfShift = order === 'asc' ? 1 : -1;

    const sortedData = [...this.data].sort((firstItem, secondItem) => {
      firstItem = firstItem[field];
      secondItem = secondItem[field];

      const resultOfComparing = typeof firstItem === 'string' 
        ? firstItem.localeCompare(secondItem, ["ru", "en"], {caseFirst: 'upper', number: true})
        : firstItem - secondItem;
      return resultOfComparing * paramOfShift;
    });
    return sortedData;
  }

  async sort() {
    if (this.isSortLocally) {
      this.data = this.sortOnClient();
    } else {
      this.data = await this.sortOnServer();
    }
    this.updateElement();
  }

  async update(from = this.paramOfSort.from, to = this.paramOfSort.to) {
    this.paramOfSort = {...this.paramOfSort, ...{from: from.toISOString(), to: to.toISOString()}};
    this.data = await this.getDataFromServer();
    this.updateElement();
  }

  remove() {
    this.element?.remove();
    this.element = null;
    this.subElements = {};
  }
  destroy() {
    this.remove();

  }
}


