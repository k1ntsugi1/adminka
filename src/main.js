import DashboardPage from "./pages/DashBoardPage.js";
// import SalesPage from './src/pages/SalesPage.js';
// import CategoriesPage from './src/pages/CategoriesPage.js';
// import ProductsPage from './src/pages/ProductPage.js';
// import UndefinedPage from './src/pages/UndefinedPage.js';

// import header from './bestsellers-header.js';


const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
	static currentAdminPage

	range = {}
	subElements = {}
	contentContainer = null
	showingPage = null
	currentHrefOfPage = window.location.pathname;

	constructor() {
	  if (Page.currentAdminPage) { return Page.currentAdminPage; }
	  Page.currentAdminPage = this;

	  this.range = this.createRange();

	    this.pages = {
	      '/': DashboardPage,
	    //   '/products': ProductsPage,
	    //   '/categories': CategoriesPage,
	    //   '/sales': SalesPage
	    };
	  	    this.urls = {
	      '/': 'api/dashboard/',
	    //   '/products': ProductsPage,
	    //   '/categories': CategoriesPage,
	    //   '/sales': SalesPage
	    };
	  this.render();
	}

	createRange() {
	  const firstDate = new Date();
	  const secondDate = new Date();

	  const monthOfSecondDate = secondDate.getMonth();
	  firstDate.setMonth(monthOfSecondDate - 1);

	  return { from: firstDate, to: secondDate };
	}

	get mainElement() {
	  const wrapper = document.createElement('div');
	  const bodyOfWrapper = `
			<main class="main">
				<div class="progress-bar" data-element="progressBar" hidden>
					<div class="progress-bar__line"></div>
				</div>
				<aside class="sidebar">
					<h2 class="sidebar__title">
						<a href="/" data-page="dashboard">shop admin</a>
					</h2>
					<ul class="sidebar__nav" data-element="sidebarNav">
						<li>
							<a href="/" data-page="dashboard">
								<i class="icon-dashboard"></i> <span>Dashboard</span>
							</a>
						</li>
						<li>
							<a href="/products" data-page="products">
								<i class="icon-products"></i> <span>Products</span>
							</a>
						</li>
						<li>
							<a href="/categories" data-page="categories">
								<i class="icon-categories"></i> <span>Categories</span>
							</a>
						</li>
						<li>
							<a href="/sales" data-page="sales">
								<i class="icon-sales"></i> <span>Sales</span>
							</a>
						</li>
					</ul>
					<ul class="sidebar__nav sidebar__nav_bottom">
						<li>
							<button type="button" class="sidebar__toggler" data-element="sidebarToggler">
								<i class="icon-toggle-sidebar"></i> <span>Toggle sidebar</span>
							</button>
						</li>
					</ul>
				</aside>
				<section class="content" id="content"></section>
			</main>`;
	  wrapper.innerHTML = bodyOfWrapper;
	  return wrapper.firstElementChild;
	}

	async updateShowingPage() {
	  this.showingPage?.destroy();
	  this.toggleProgressbar();

	  const urlOfAJAX = this.urls[this.currentHrefOfPage] ?? '';
	  const Constructor = this.pages[this.currentHrefOfPage] ?? UndefinedPage;
	  const { from, to } = this.range;

	  this.showingPage = await new Constructor({
	    mainClass: this,
	    range: {
	      from: from.toString(),
	      to: to.toString()
	    },
	    url: [urlOfAJAX, BACKEND_URL],
	  });

	  console.log(this.contentContainer)
	  this.contentContainer.append(this.showingPage.element);

	  this.toggleProgressbar();
	}

	toggleSidebarHandler = () => {
	  document.body.classList.toggle('is-collapsed-sidebar');
	}

	changePageHandler = (event) => {
	  this.currentHrefOfPage = event.state.href;
	  this.updateShowingPage();
	}

	selectPageHandler = (event) => {
	  event.preventDefault();

	  const hrefElementOfPage = event.target.closest('[data-page]');
	  if (!hrefElementOfPage) {return;}

	  const href = hrefElementOfPage.getAttribute('href');
	  window.history.pushState({href}, null, href);
	}

	addEventListeners() {
	  const { sidebarToggler } = this.subElements;
	  console.log(sidebarToggler);
	  sidebarToggler.addEventListener('click', this.toggleSidebarHandler);
	  this.element.addEventListener('click', this.selectPageHandler);
	  this.element.addEventListener('popstate', this.changePageHandler);

	}

	setSubElements() {
	  const hrefElementsOfPages = document.querySelectorAll('[data-pages]');
	  const elements = document.querySelectorAll('[data-element]');

	  for (const hrefElement of hrefElementsOfPages) {
	    const name = hrefElement.dataset.page;
	    this.subElements[name] = hrefElement;
	  }

	  for (const element of elements) {
	    const name = element.dataset.element;
	    this.subElements[name] = element;
	  }
	}

	toggleProgressbar() {
	  const { progressBar } = this.subElements;
	  progressBar.hidden = !progressBar.hidden;
	}

	async render() {
	  this.element = this.mainElement;
	  document.body.append(this.element);

	  this.contentContainer = document.querySelector('#content');
	  this.setSubElements();

	  await this.updateShowingPage();
	  this.addEventListeners();
	}
}

