import ProductForm from "../components/ProductForm";

export default class ProductFormPage {
    subElements= {}
    element = null

    constructor(productId, urls) {

      this.productId = productId;

      this.urlsForAJAX = {
        categoriesURL: (new URL(urls['/categories'], urls[backendURL])).toISOString(),
        productURL: (new URL(urls['/products'], urls[backendURL])).toISOString(),
        imageURL: '3/image'
      };
      this.render();
    }


    get ProductPage() {

    }
    setSubElements() {
      const elements = this.element.querySelectorAll('div[data-element]');

      for (const element of elements) {
        const name = element.dataset.element;
        this.subElements[name] = element;
      }

    }
    render() {
      this.element = ProductPage;
      this.setSubElements();
    }
}