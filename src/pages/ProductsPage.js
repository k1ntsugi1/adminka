import SortableTable from '../components/SortableTable.js';
import header from '../store/product-header.js';

export default class ProductsPage {
  
    subElements = {}
  
    constructor({mainClass, range, url}) {
  
      const [path, backendURL] = url;
  
      this.mainClass = mainClass;
      this.path = path;
      this.backendURL = backendURL;
      this.range = {
        from: new Date(range.from),
        to: new Date(range.to)
      };
      
      this.inputData = [header, {
        range: this.range, 
        url: (new URL(this.path, this.backendURL)).toString(),
        isSortLocally: false,
        showingPage: 'ProductsPage',
      }]; 
  
      this.Constructor = SortableTable;
  
      this.render();
    }
  
    get ProductsElement() {
      const wrapper = document.createElement('div');
      const dashbord = `
        <div class="products-list">
            <div class="content__top-panel">
                <h1 class="page-title">Товары</h1>
                <a href="/products/add" class="button-primary">Добавить товар</a>
            </div>
            <div data-element="productsContainer" class="products-list__container"></div>
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
  
    async getElement() {
      const elementHTML = new this.Constructor(...this.inputData);
      return elementHTML;
    }
  
    async update() {
      this.mainClass.toggleProgressbar();
      const { productsContainer } = this.subElements;
  
      const component = await this.getElement();

      productsContainer.append(component.element);
  
      this.mainClass.toggleProgressbar();
    }
  

  
    async render() {
      this.element = this.ProductsElement;
  
      this.setSubElements();
  
      await this.update();
      
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
  
  