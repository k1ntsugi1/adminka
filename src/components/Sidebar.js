export default class Sidebar {

  subElements = {};
  activeNavItem = null

  constructor() {
    this.render();
  }

  get sidebarElement() {
    const wrapper = document.createElement('div');
    const bodyOfWrapper = `
        <aside class="sidebar">
					<h2 class="sidebar__title">
						<a href="/" data-page="dashboard">shop admin</a>
					</h2>
					<ul class="sidebar__nav" data-element="sidebarNav">
						<li class="active">
							<a href="/" data-page="dashboard">
								<i class="icon-dashboard"></i> <span>Панель управления</span>
							</a>
						</li>
						<li>
							<a href="/products" data-page="products">
								<i class="icon-products"></i> <span>Продукты</span>
							</a>
						</li>
						<li>
							<a href="/categories" data-page="categories">
								<i class="icon-categories"></i> <span>Категории</span>
							</a>
						</li>
						<li>
							<a href="/sales" data-page="sales">
								<i class="icon-sales"></i> <span>Продажи</span>
							</a>
						</li>
					</ul>
					<ul class="sidebar__nav sidebar__nav_bottom">
						<li>
							<button type="button" class="sidebar__toggler" data-element="sidebarToggler">
								<i class="icon-toggle-sidebar"></i> <span>Скрыть Панель</span>
							</button>
						</li>
					</ul>
				</aside>`;
    wrapper.innerHTML = bodyOfWrapper;
    return wrapper.firstElementChild;
  }

  setSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    console.log(elements)

    for (const element of elements) {
      const name = element.dataset.element;
      this.subElements[name] = element;
    }
  }

  toggleSidebarHandler = () => {
    document.body.classList.toggle('is-collapsed-sidebar');
  }

  setActiveNavItemHandler = (event) => {
    const target = event.target.closest('li');
    if (!target) {return;}

    this.activeNavItem.classList.remove('active');

    target.classList.add('active');
    this.activeNavItem = target;
  }

  setEventListeners() {
    const { sidebarToggler, sidebarNav } = this.subElements;
    sidebarNav.addEventListener('click', this.setActiveNavItemHandler);
    sidebarToggler.addEventListener('click', this.toggleSidebarHandler);
  }

  render() {
    this.element = this.sidebarElement;
    this.activeNavItem = this.element.querySelector('.active');
    this.setSubElements();
    this.setEventListeners();
  }

  remove() {
    this.element.remove();
    this.element = null;
  }

  destroy() {
    this.remove();
  }
}