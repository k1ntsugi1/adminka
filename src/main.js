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
	currentPathnameOfPage = window.location.pathname;
	
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
	  	this.urlsOfAJAX = {
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

	toggleProgressbar() {
	  const { progressBar } = this.subElements;
	  progressBar.hidden = !progressBar.hidden;
	}
  
	toggleSidebarHandler = () => {
	  document.body.classList.toggle('is-collapsed-sidebar');
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
				</aside>
				<section class="content" id="content"></section>
			</main>`;
	  wrapper.innerHTML = bodyOfWrapper;
	  return wrapper.firstElementChild;
	}


	getDataOfProductFormPage() {
	  const [id] = this.currentPathnameOfPage.match(/([a-z0-9_-]+$)/i) ?? [];
	  return {
	    mainClass: this,
	    productId: id === 'add' ? null : id,
	    urls: {...this.urlsOfAJAX, backendURL: BACKEND_URL}
	  };
	}

	getDataOfPlainPage() {
	  const { from, to } = this.range;
	  return {
	    mainClass: this,
	    range: {
	      from: from.toString(),
	      to: to.toString()
	    },
	    url: [this.urlsOfAJAX[this.currentPathnameOfPage], BACKEND_URL],
	  };
	  }

	updateShowingPage() {
	  this.showingPage?.destroy();
	  this.toggleProgressbar();

	  const [isFormPage] = this.currentPathnameOfPage.match(/\/products\/([a-z0-9_-]+)/i) ?? [];

	  const inputData = isFormPage 
	  	? this.getDataOfProductFormPage()
	    : this.getDataOfPlainPage(); 
	
	  const Constructor = isFormPage 
	    ? ProductFormPage
	  	: this.pages[this.currentPathnameOfPage]; //?? UndefinedPage;

	  this.showingPage = new Constructor(inputData);

	  this.contentContainer.append(this.showingPage.element);

	  this.toggleProgressbar();
	}

	changePageByCustomEventHandler = (event) => {
	  const { href } = event.detail;
	  this.currentPathnameOfPage = href;

	  this.updateShowingPage();
	}

	changePageByPushStateHandler = () => {
	  this.currentPathnameOfPage = document.location.pathname;
	  this.updateShowingPage();
	}

	selectPageHandler = (event) => {
	  event.preventDefault();

	  const elementA = event.target.closest('a');
	  
	  const href = elementA?.getAttribute('href') ?? '';

	  if (!elementA) {return;}
	  if (!href.startsWith('/')) {return;}

	  window.history.pushState(null, null, href);

	  event.target.dispatchEvent(new CustomEvent('page-selected', {
	    bubbles: true,
	    detail: { href }
	  }));
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

	setEventListeners() {
	  const { sidebarToggler } = this.subElements;
  
	  sidebarToggler.addEventListener('click', this.toggleSidebarHandler);
	  this.element.addEventListener('click', this.selectPageHandler);
	  this.element.addEventListener('page-selected', this.changePageByCustomEventHandler);
	  window.addEventListener('popstate', this.changePageByPushStateHandler);
  
	  }

	render() {
	  this.element = this.mainElement;
	  document.body.append(this.element);

	  this.contentContainer = document.querySelector('#content');

	  this.setSubElements();
	  this.setEventListeners();

	  this.updateShowingPage();
	}
}

