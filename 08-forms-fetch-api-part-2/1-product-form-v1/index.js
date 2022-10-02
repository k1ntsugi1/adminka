import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_CLIENT = 'https://imgur.com/';

const BACKEND_URL = 'https://course-js.javascript.ru';


export default class ProductForm {
  data = {}
  subElements = {}
  statusForm = 'saving'

  constructor(
    productId,
    {
      categoriesURL = '/api/rest/categories',
      productURL = `/api/rest/products`
    } = {}
  ) {
    this.productId = productId;

    this.urls = {
      categories: new URL(categoriesURL, BACKEND_URL)
    };

    if (this.productId) {
      this.urls.product = new URL(productURL, BACKEND_URL);
      this.urls.product.searchParams.set('id', this.productId);
      this.statusForm = 'updating';
    }

    this.urls.categories.searchParams.set('_sort', 'weigh');
    this.urls.categories.searchParams.set('_refs', 'subcategory');

  }


  getTitle() {
    const { title = '' } = this.data.product ?? {};
    return (
      `<fieldset>
        <label class="form-label">Название товара</label>
        <input required="" 
               type="text"
               name="title"
               class="form-control"
               placeholder="Название товара"
               value=${title}
               autofocus>
      </fieldset>`
    );
  }

  getDescription() {
    const { description = '' } = this.data.product ?? {};
    return (
      `<label class="form-label">Описание</label>
       <textarea required="" 
                 class="form-control" 
                 name="description" 
                 data-element="productDescription" 
                 placeholder="Описание товара">
        ${escapeHtml(description)}
       </textarea>`
    );
  }

  getImage(image) {
    const { source, url } = image;
    return (
      `<li class="products-edit__imagelist-item sortable-list__item" style="">
      <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
      <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
      <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${url}">
        <span>${source}</span>
      </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button>
    </li>`
    );
  }

  getImages() {
    const { images = '' } = this.data.product ?? {};
    return (
      ` <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list">
            ${images.map(this.getImage)}
          </ul>
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline">
          <span>Загрузить</span>
        </button>`
    );
  }

  getCategory(category) {
    const { title: titleOfCat, subcategories } = category;


    const options = subcategories.map(({id, title: titleOfSubCat}) => {
      const text = `${escapeHtml(`${titleOfCat} > ${titleOfSubCat}`)}`;
      return (
        `<option value="${id}">${text}</option>`
      );
    }).join('');

    return options;
  }

  getCategories() {
    const { categories = [] } = this.data;
    return (
      `<label class="form-label">Категория</label>
      <select class="form-control" name="subcategory">
        ${categories.map(this.getCategory).join('')}
      </select>`
    );
  }

  getPrice() {
    const { price = '' } = this.data.product ?? {};
    return (
      `<fieldset>
        <label class="form-label">Цена ($)</label>
        <input required="" 
               type="number"
               name="price"
               class="form-control"
               placeholder="100"
               value=${price}>
      </fieldset>`
    );
  }

  getDiscount() {
    const { discount = ''} = this.data.product ?? {};
    return (
      `<fieldset>
        <label class="form-label">Скидка ($)</label>
        <input required="" 
               type="number" 
               name="discount" 
               class="form-control" 
               placeholder="0"
               value=${discount}>
      </fieldset>`
    );
  }

  getQuantity() {
    const { quantity = ''} = this.data.product ?? {};
    return (
      `<label class="form-label">Количество</label>
       <input required="" 
              type="number"
              class="form-control"
              name="quantity"
              placeholder="1"
              value=${quantity}>`
    );
  }

  getStatus() {
    const { status = 1 } = this.data.product ?? {};
    return (
      `<label class="form-label">Статус</label>
        <select class="form-control" name="status" value=${status}>
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>`
    );
  }

  getElement() {
    const wrapper = document.createElement('div');
    const form = (
      `<div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            ${this.getTitle()}
          </div>
          <div class="form-group form-group__wide">
            ${this.getDescription()}
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            ${this.getImages()}
          </div>
          <div class="form-group form-group__half_left">
            ${this.getCategories()}
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            ${this.getPrice()}
            ${this.getDiscount()}
          </div>
          <div class="form-group form-group__part-half">
            ${this.getQuantity()}
          </div>
          <div class="form-group form-group__part-half">
            ${this.getStatus()}
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>`
    );
    wrapper.innerHTML = form;
    return wrapper.firstElementChild;
  }

  setSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    elements.forEach((element) => {
      const name = element.dataset.element;
      this.subElements[name] = element;
    });
  }

  async getData() {
    const keysOfUrls = Object.keys(this.urls);
    const valuesOfUrls = Object.values(this.urls);

    const dataOfResponses = valuesOfUrls.map(url => {

      const dataOfCurrentUrl = fetch(url.toString()).then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('server Error');
        }
      }).catch((error) => {
        console.log('ERROR', error);
        return {};
      });
      
      return dataOfCurrentUrl;
    });

    const responses = await Promise.all(dataOfResponses);

    const entriesOfResponses = responses.map((response, index) => {
      response = index === 1 ? response[0] : response;
      const key = keysOfUrls[index];
      return [key, response];
    });

    return Object.fromEntries(entriesOfResponses);
  }

  submitHandler = (event) => {
    event.preventDefault();

    const element = this.element;
    const { productForm } = this.subElements;
    const formData = new FormData(productForm);
    
    const handler = {
      'updating': () => {
        element.dispatchEvent(new CustomEvent('product-updated', {
          bubles: true,
          detail: formData,
        }));
      },
      'saving': () => {
        element.dispatchEvent(new CustomEvent('product-saved', {
          bubles: true,
          detail: formData,
        }));
      }
    };
    handler[this.statusForm]();
  }

  addEventListeners() {
    const { productForm } = this.subElements;
    productForm.addEventListener('submit', this.submitHandler);
  }

  async render() {
    this.data = await this.getData();
    this.element = this.getElement();

    this.setSubElements();
    this.addEventListeners();
  }

  remove() {
    this.element?.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
  }
}
