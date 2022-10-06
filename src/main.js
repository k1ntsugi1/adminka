import DashboardPage from "./pages/DashBoardPage.js";
import SalesPage from './pages/SalesPage.js';
import CategoriesPage from './pages/CategoriesPage.js';
import ProductsPage from './pages/ProductsPage.js';
import ProductFormPage from './pages/ProductFormPage.js';
// import UndefinedPage from './pages/UndefinedPage.js';


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
	      '/products': ProductsPage,
	      '/categories': CategoriesPage,
	      '/sales': SalesPage
	    };
	  	this.urls = {
	      '/': 'api/dashboard/',
	       '/products': 'api/rest/products',
	       '/categories': '/api/rest/categories',
	       '/sales': 'api/rest/orders',
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

	async setProductFormPage() {
 
	  const id = this.currentHrefOfPage.match(/([a-z0-9_-]+$)/i)[0] ?? null;
	  const Constructor = ProductFormPage;

	  this.showingPage = await new Constructor({
	    mainClass: this,
	    productId: id === 'add' ? null : id,
	    urls: {...this.urls, backendURL: BACKEND_URL}
	  });
	  this.contentContainer.append(this.showingPage.element);
	  this.toggleProgressbar();
	  console.log(this.showingPage);
	}

	async updateShowingPage() {
	  this.showingPage?.destroy();
	  this.toggleProgressbar();
	  
	  const [isFormPage] = this.currentHrefOfPage.match(/\/products\/([a-z0-9_-]+)/i) ?? [];
	  if (isFormPage) {
	    await this.setProductFormPage();
	    return;
	  }
	  
	  const urlOfAJAX = this.urls[this.currentHrefOfPage] ?? '/undefined';

	  const Constructor = this.pages[this.currentHrefOfPage]; //?? UndefinedPage;

	  const { from, to } = this.range;

	  this.showingPage = await new Constructor({
	    mainClass: this,
	    range: {
	      from: from.toString(),
	      to: to.toString()
	    },
	    url: [urlOfAJAX, BACKEND_URL],
	  });

	  this.contentContainer.append(this.showingPage.element);

	  this.toggleProgressbar();
	}

	toggleSidebarHandler = () => {
	  document.body.classList.toggle('is-collapsed-sidebar');
	}

	changePageHandlerByCustomEvent = (event) => {
		
	  const { href } = event.detail;
	  this.currentHrefOfPage = href;

	  this.updateShowingPage();
	}

	changePageHandlerByPushState = () => {
	  this.currentHrefOfPage = document.location.pathname;
	  this.updateShowingPage();
	}

	selectPageHandler = (event) => {
	  event.preventDefault();

	  const hrefElementOfPage = event.target.closest('[data-page]');
	  
	  if (!hrefElementOfPage) {return;}

	  const href = hrefElementOfPage.getAttribute('href');

	  window.history.pushState(null, null, href);

	  event.target.dispatchEvent(this.createCustomEventOfUpdatingHref(href));
	}

	createCustomEventOfUpdatingHref(href) {
	  return new CustomEvent('updatedHref', {
	    bubbles: true,
	    detail: { href }
		  });
	}

	addEventListeners() {
	  const { sidebarToggler } = this.subElements;

	  sidebarToggler.addEventListener('click', this.toggleSidebarHandler);
	  this.element.addEventListener('click', this.selectPageHandler);
	  this.element.addEventListener('updatedHref', this.changePageHandlerByCustomEvent);
	  window.addEventListener('popstate', this.changePageHandlerByPushState);

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

