// /* eslint-disable */
import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import {
  div, a, span, nav, img, input, button, form,
  ul,
  li,
  h4,
} from '../../scripts/dom-builder.js';
import { applyClasses } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

function hideFlyoutMenu() {
  document.querySelector('#menu-flyout')?.classList.add('hidden');
}

function sortFlyoutMenus(menuPath) {
  const menuList = document.querySelector('#menu-flyout ul');
  const heading = menuPath.split('|');
  if (heading) document.querySelector('#menu-flyout h4').textContent = heading[heading.length - 1];
  [...menuList.children].forEach((menu) => {
    if (
      menu.getAttribute('data-content') !== menuPath
      && menu.getAttribute('data-content') !== menuPath
    ) {
      menu.classList.add('hidden');
    } else {
      menu.classList.remove('hidden');
      const href = menu.getAttribute('data-href');
      const backFlyout = document.querySelector('#back-flyout');
      const exploreFlyout = document.querySelector('#explore-flyout');
      const redirectLink = menu
        .getAttribute('data-content')
        .split('|')
        .slice(0, -1)
        .join('|');
      if (redirectLink) {
        backFlyout.setAttribute('data-redirect', redirectLink);
        backFlyout.classList.remove('hidden');
      } else backFlyout.classList.add('hidden');
      if (href) {
        exploreFlyout.setAttribute('href', href);
        exploreFlyout.classList.remove('hidden');
      } else exploreFlyout.classList.add('hidden');
    }
  });
}

function buildFlyoutMenus(headerBlock) {
  const allFlyout = headerBlock.querySelectorAll('.menu-flyout');
  const closeFlyout = button(
    { class: 'flex ml-auto mx-2 p-1 rounded hover:bg-gray-200/30' },
    span({
      class:
        'icon icon-x w-6 h-6 [&_svg>use]:stroke-2 [&_svg>use]:stroke-gray-500/70',
    }),
  );
  closeFlyout.addEventListener('click', hideFlyoutMenu);

  const backFlyout = button(
    { id: 'back-flyout', class: 'flex items-center gap-x-1 group' },
    span({
      class:
        'icon icon-arrow-left [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:translate-x-0.5',
    }),
    'Back',
  );
  backFlyout.addEventListener('click', () => sortFlyoutMenus(backFlyout.getAttribute('data-redirect')));

  const exploreFlyout = a(
    {
      id: 'explore-flyout',
      class: 'flex items-center gap-x-1 group',
      href: '#',
    },
    'Explore all',
    span({
      class:
        'icon icon-arrow-right [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:-translate-x-0.5',
    }),
  );

  const navigateActions = div(
    {
      class:
        'flex justify-between text-base text-danaherpurple-500 font-bold mx-2',
    },
    backFlyout,
    exploreFlyout,
  );

  decorateIcons(closeFlyout);
  decorateIcons(backFlyout);
  decorateIcons(exploreFlyout);

  const menuWrapper = ul({
    class:
      'h-[75vh] flex flex-col gap-y-2 mt-3 overflow-auto [&>li.active]:bg-danaherpurple-50 [&>li.active]:font-bold',
  });
  [...allFlyout].forEach((flyMenu) => {
    const contentText = flyMenu.children[0]?.textContent;
    const anchorHref = flyMenu.children[0].querySelector('a')?.href;

    [...flyMenu.children[1].children].map((flyMenuChild) => {
      const contextPath = `${contentText}|${flyMenuChild.textContent}`;
      const liTag = li({
        class:
          'inline-flex justify-between items-center hover:bg-danaherpurple-50 font-extralight text-base hover:font-medium tracking-wider px-2 py-2 select-none cursor-pointer [&>a]:w-full transition group',
        'data-content': contentText,
        ...(anchorHref && { 'data-href': anchorHref }),
      });
      if (flyMenuChild.querySelector('span.icon')) {
        liTag.setAttribute('data-redirect', contextPath);
        liTag.innerHTML += flyMenuChild.textContent;
        liTag.append(
          span({
            class:
              'icon icon-arrow-right shrink-0 [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-black w-4 h-4 group-hover:-translate-x-0.5',
          }),
        );
        liTag.addEventListener('click', () => sortFlyoutMenus(contextPath));
      } else {
        liTag.append(
          a(
            { href: flyMenuChild.querySelector('a')?.href },
            flyMenuChild.textContent,
          ),
        );
      }
      decorateIcons(liTag);
      menuWrapper.append(liTag);
      return flyMenuChild;
    });
    flyMenu.outerHTML = '';
  });

  const flyout = div(
    {
      id: 'menu-flyout',
      class:
        'w-full hidden fixed top-0 left-0 z-40 h-screen transition-all ease-out backdrop-brightness-50',
    },
    div(
      {
        class:
          'w-[360px] max-w-sm fixed h-full bg-white px-3 py-4 ease-out transition-all',
      },
      closeFlyout,
      h4(
        { class: 'text-2xl font-medium text-gray-900 mt-0 mx-2 mb-2' },
        'Flyout Menu Heading',
      ),
      navigateActions,
      div({ class: 'border-b border-black py-2 mx-2' }),
      menuWrapper,
    ),
  );
  flyout.addEventListener('click', (event) => {
    if (event.target.id === 'menu-flyout') hideFlyoutMenu();
  });
  return flyout;
}

// Header Component
function createHeader() {
  const header = nav(
    {
      class: 'logo-header w-full p-4 text-center',
      style: 'background: linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 15%, rgba(0, 96, 168, 1) 100%);',
    },
    // Left Section → Logo
    div(
      { class: 'flex items-center' },
      img({
        src: `${window.hlx.codeBasePath}/icons/phenomenex_logo.png`,
        alt: 'Phenomenex Logo',
        class: 'h-8',
      }),
    ),

    // Right Section → Links & Icons
    div(
      { class: 'flex items-center text-white text-sm' },
      a(
        { href: '#', class: 'flex items-center space-x-1 pl-1 pr-1', style: 'color: #ffffff' },
        span({ class: 'text-white' }, 'Sign in'),
      ),
      ' / ',
      a(
        { href: '#', class: 'flex items-center hover:underline pl-1 pr-1 text-white', style: 'color: #ffffff' },
        span('Register'),
        span({ class: 'icon icon-user' }),
      ),
      a(
        { href: '#', class: 'flex items-center space-x-1 hover:underline pl-4 pr-8', style: 'color: #ffffff' },
        span('India'),
        span({ class: 'icon icon-globe' }),
      ),
      button(
        { class: 'collapse', onclick: () => console.log('test'), id: 'header-actions' },
        span('='),
      ),
    ),
  );
  decorateIcons(header);
  return header;
}

function createSubHeader() {
  const subHeader = nav(
    {
      class: 'search-header w-full p-4 text-center',
    },
    // Left Section → Search Bar
    form(
      {
        class:
          'flex items-center w-1/2 min-w-[280px] rounded-full border-2 border-gray-300 bg-gray-100 px-2 py-2 box-border',
        style: 'border: 1px solid #0060a8; height: 50px',
      },
      input({
        type: 'text',
        placeholder: 'Search by Part No., Product, Application, or Keyword',
        class:
          'flex-grow px-4 py-2 bg-transparent focus:outline-none focus:ring-0 border-none appearance-none text-sm',
      }),
      button(
        { type: 'submit', class: 'p-2 flex items-center justify-center', style: 'background: unset' },
        span({ class: 'icon icon-search' }),
      ),
    ),
  );

  decorateIcons(subHeader);
  return subHeader;
}

function buildButtonBlock(headerBlock) {
  const buttonHTMLBlock = headerBlock?.children[0];
  if (buttonHTMLBlock) buttonHTMLBlock.className = 'build-button-block';
}

function buildNavBlock(headerBlock) {
  const navHTMLBlock = headerBlock?.children[1];
  if (navHTMLBlock) navHTMLBlock.className = 'build-nav-block';
}

/**
 * loads and decorates the header(s)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  console.log('🎈 ~ decorate ~ fragment: ~~~~~~~~~~~~~~~~~~~~ ', fragment);

  // decorate nav DOM
  block.textContent = '';
  const nav1 = document.createElement('nav');
  nav1.id = 'nav';
  while (fragment.firstElementChild) {
    console.log('🎈 ~ decorate ~ fragment: ~~~~~~~~~~~~~~~~~~~~ ', fragment);
    console.log('🎈 ~ decorate ~ fragment.firstElementChild: ~~~~~~~~~~~~~~~~~~~~ ', fragment.firstElementChild);
    // console.log(first)
    nav1.append(fragment.firstElementChild);
  }

  //
  const resp = await fetch('/nav.plain.html');
  const html = await resp.text();
  console.log('🎈 ~ decorate ~ html: ~~~~~~~~~~~~~~~~~~~~ ', html);

  // build header DOM
  const headerBlock = div({
    class: 'nav-container pt-0 pb-0 md:p-0 relative z-20',
  });
  headerBlock.innerHTML = html;
  buildButtonBlock(headerBlock);
  buildNavBlock(headerBlock);
  // console.log('🎈 ~ decorate ~ headerBlock: ~~~~~~~~~~~~~~~~~~~~ ', headerBlock);

  const headerButtonSection = headerBlock.querySelector('.build-button-block');
  const headerNavSection = headerBlock.querySelector('.build-nav-block');
  console.log('🎈 ~ decorate ~ headerNavSection: ~~~~~~~~~~~~~~~~~~~~ ', headerNavSection);
  applyClasses(headerNavSection, 'nav-header w-full p-4 text-center');

  const navContainers = headerNavSection?.querySelectorAll('.nav-container');
  const navMain = document.createElement('div');
  navMain.className = 'nav-main';
  const navItems = document.createElement('div');
  navItems.className = 'nav-items';
  const categories = [];

  // Process each nav container
  navContainers?.forEach((container, index) => {
    const divs = container.children;
    if (divs.length > 0) {
      // First div is the category
      const categoryText = divs[0].textContent;

      // Create category element
      const categoryElement = document.createElement('div');
      categoryElement.className = 'nav-category';
      categoryElement.textContent = categoryText;
      categoryElement.dataset.category = index;

      // Store category data
      const categoryData = {
        element: categoryElement,
        items: [],
      };

      // Process items (skip first div which is category)
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < divs.length; i++) {
        const itemText = divs[i].textContent;
        // const itemText = divs[i].textContent;
        const itemElement = document.createElement('div');
        itemElement.className = 'nav-item';
        itemElement.textContent = itemText;
        categoryData.items.push(itemElement);
      }

      categories.push(categoryData);
      navMain.appendChild(categoryElement);
    }
  });

  // Add event listeners
  categories.forEach((category) => {
    const categoryElement = category.element;

    categoryElement.addEventListener('mouseenter', () => {
      // Remove active class from all categories
      categories.forEach((cat) => cat.element.classList.remove('active'));

      // Add active class to current category
      categoryElement.classList.add('active');

      // Clear previous items
      navItems.innerHTML = '';

      // Add current category items
      category.items.forEach((item) => {
        navItems.appendChild(item.cloneNode(true));
      });

      // Show items
      navItems.classList.add('show');
    });
  });

  // Hide items when not hovering over navigation area
  const navigationArea = document.createElement('div');
  navigationArea.appendChild(navMain);
  navigationArea.appendChild(navItems);

  navigationArea.addEventListener('mouseleave', () => {
    navItems.classList.remove('show');
    categories.forEach((cat) => cat.element.classList.remove('active'));
  });

  // Replace original containers with new navigation
  navContainers?.forEach((container) => container.remove());

  // Insert new navigation before section-metadata
  const sectionMetadata = headerNavSection?.querySelector('.section-metadata');
  headerNavSection?.insertBefore(navigationArea, sectionMetadata);

  //
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper fixed top-0 left-0 w-full bg-gray-800 text-white flex flex-col z-50';

  // create header + subheader
  const headerEl = createHeader();
  const subHeaderEl = createSubHeader();

  // append to wrapper (header first)
  navWrapper.append(headerEl);
  subHeaderEl.append(headerButtonSection);
  navWrapper.append(subHeaderEl);
  if (headerNavSection) navWrapper.append(headerNavSection);

  const flyout = buildFlyoutMenus(headerBlock);

  // attach wrapper to block (so elements are in DOM for measurement)
  block.append(navWrapper);
  block.append(flyout);

  requestAnimationFrame(() => {
    try {
      const headerRect = headerEl.getBoundingClientRect();
      const subHeaderRect = subHeaderEl.getBoundingClientRect();

      // set top of subheader to header height
      subHeaderEl.style.top = `${Math.ceil(headerRect.height)}px`;

      // set body's padding-top to combined heights so page content is visible below fixed bars
      const total = Math.ceil(headerRect.height + subHeaderRect.height);
      document.body.style.paddingTop = `${total}px`;

      // defensive: ensure no horizontal scroll from these fixed bars
      document.documentElement.style.boxSizing = 'border-box';
      document.body.style.overflowX = 'hidden';
    } catch (e) {
      // ignore measurement errors in constrained environments
      // (but the elements are still present)
    }
  });

  return navWrapper;
}
