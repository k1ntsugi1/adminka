import CategoriesList from "../components/CategoriesList.js";

export default class CategoriesPage {
  constructor({mainClass, url}) {
    this.mainClass = mainClass;
    this.url = url;
    this.render();
  }

  get categoriesElement() {
    const wrapper = document.createElement('div');
    const categories = `
        <div class="categories">
            <div class="content__top-panel">
                <h1 class="page-title">Категории товаров</h1>
            </div>
            <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
        </div>`;
    wrapper.innerHTML = categories;
    return wrapper.firstElementChild; 
  }


  async update() {
    const categoriesList = new CategoriesList(this.url);
    const childElement = await categoriesList.render();
    this.element.append(childElement);
  }

  render() {
    this.element = this.categoriesElement;
    this.update();
    return this.element;
  }

  remove() {
    this.element.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
  }

}