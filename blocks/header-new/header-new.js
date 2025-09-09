import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  // Toggle mobile menu visibility
  const mobileMenu = nav.querySelector('.nav-sections');
  if (mobileMenu) {
    if (expanded) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('block');
    } else {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('block', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'shadow-lg', 'z-50');
    }
  }

  // Enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
    });
  }
}

/**
 * Create search component
 */
function createSearchComponent() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'flex-1 max-w-2xl mx-8';

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'relative flex items-center bg-white rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search by Part No., Product, Application, or Keyword';
  searchInput.className = 'flex-1 px-6 py-3 text-gray-700 bg-transparent border-0 rounded-l-full focus:outline-none focus:ring-0 placeholder-gray-500';

  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'px-6 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-r-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  searchButton.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"></path>
    </svg>
  `;

  searchWrapper.append(searchInput, searchButton);
  searchContainer.append(searchWrapper);

  return searchContainer;
}

/**
 * Create action buttons (Quick Order, Request Quote, Cart)
 */
function createActionButtons() {
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'hidden md:flex items-center space-x-4';

  // Quick Order button
  const quickOrderBtn = document.createElement('button');
  quickOrderBtn.className = 'flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium';
  quickOrderBtn.innerHTML = `
    <span>Quick Order</span>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  `;

  // Request Quote button
  const requestQuoteBtn = document.createElement('button');
  requestQuoteBtn.className = 'flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium border border-blue-300 hover:border-blue-400';
  requestQuoteBtn.innerHTML = `
    <span>Request Quote</span>
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  `;

  // Cart button
  const cartBtn = document.createElement('button');
  cartBtn.className = 'flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium';
  cartBtn.innerHTML = `
    <span>Cart</span>
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 0 0 5.414 17H19M7 13v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"></path>
    </svg>
  `;

  actionsContainer.append(quickOrderBtn, requestQuoteBtn, cartBtn);
  return actionsContainer;
}

/**
 * Loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Clear block content
  block.textContent = '';

  // Create main nav container
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.className = 'relative bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg';

  // Create nav wrapper with proper layout
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  // Create main nav content container
  const navContent = document.createElement('div');
  navContent.className = 'flex items-center justify-between h-16';

  // Process fragment content
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Apply classes to nav sections
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) {
      section.classList.add(`nav-${c}`);

      // Apply specific styling based on section type
      if (c === 'brand') {
        section.className = 'nav-brand flex items-center';
      } else if (c === 'sections') {
        section.className = 'nav-sections hidden md:flex items-center space-x-6';
      } else if (c === 'tools') {
        section.className = 'nav-tools flex items-center space-x-4';
      }
    }
  });

  // Style brand section
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.className = 'flex items-center space-x-2';

    // Create Phenomenex logo/brand
    const brandContainer = document.createElement('div');
    brandContainer.className = 'flex items-center space-x-2';

    const logo = document.createElement('div');
    logo.className = 'w-8 h-8 bg-red-600 rounded-full flex items-center justify-center';
    logo.innerHTML = '<span class="text-white font-bold text-lg">P</span>';

    const brandText = document.createElement('span');
    brandText.className = 'text-white font-bold text-xl tracking-wide';
    brandText.textContent = 'phenomenex';

    brandContainer.append(logo, brandText);
    navBrand.innerHTML = '';
    navBrand.append(brandContainer);

    // Remove button classes if they exist
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = 'flex items-center space-x-2 hover:opacity-90 transition-opacity duration-200';
      brandLink.closest('.button-container')?.classList.remove('button-container');
    }
  }

  // Style navigation sections
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.className = 'nav-sections hidden md:flex items-center space-x-1';

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      navSection.className = 'relative group';

      // Style main nav links
      const link = navSection.querySelector('a');
      if (link) {
        link.className = 'px-3 py-2 text-white hover:text-blue-200 hover:bg-blue-800 rounded-md transition-colors duration-200 font-medium whitespace-nowrap';
      }

      // Handle dropdown menus
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');

        // Style dropdown container
        const dropdown = navSection.querySelector('ul');
        if (dropdown) {
          dropdown.className = 'absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50';

          // Style dropdown items
          dropdown.querySelectorAll('li').forEach((item) => {
            item.className = 'hover:bg-gray-50';
            const dropdownLink = item.querySelector('a');
            if (dropdownLink) {
              dropdownLink.className = 'block px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200';
            }
          });
        }

        // Add dropdown arrow
        if (link) {
          link.innerHTML += `
            <svg class="ml-1 w-4 h-4 inline-block transform group-hover:rotate-180 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          `;
        }
      }

      // Handle click events for mobile
      navSection.addEventListener('click', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');

          const dropdown = navSection.querySelector('ul');
          if (dropdown) {
            dropdown.classList.toggle('hidden');
          }
        }
      });
    });
  }

  // Create hamburger menu for mobile
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger md:hidden';
  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation" class="p-2 text-white hover:text-blue-200 hover:bg-blue-800 rounded-md transition-colors duration-200">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  `;

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Create user account section
  const userSection = document.createElement('div');
  userSection.className = 'hidden md:flex items-center space-x-4 text-white';

  const signInLink = document.createElement('a');
  signInLink.href = '#';
  signInLink.className = 'flex items-center space-x-1 hover:text-blue-200 transition-colors duration-200';
  signInLink.innerHTML = `
    <span>Sign in / Register</span>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
    </svg>
  `;

  const locationLink = document.createElement('a');
  locationLink.href = '#';
  locationLink.className = 'flex items-center space-x-1 hover:text-blue-200 transition-colors duration-200';
  locationLink.innerHTML = `
    <span>India</span>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path>
    </svg>
  `;

  userSection.append(signInLink, locationLink);

  // Assemble the nav content
  navContent.append(hamburger, navBrand);

  // Add search component
  const searchComponent = createSearchComponent();
  navContent.append(searchComponent);

  // Add action buttons
  const actionButtons = createActionButtons();
  navContent.append(actionButtons, userSection);

  navWrapper.append(navContent);

  // Add mobile sections (hidden by default)
  if (navSections) {
    navSections.className = 'nav-sections hidden absolute top-full left-0 w-full bg-blue-700 border-t border-blue-600 md:static md:flex md:items-center md:space-x-1 md:bg-transparent md:border-0';
    navWrapper.append(navSections);
  }

  nav.append(navWrapper);
  nav.setAttribute('aria-expanded', 'false');

  // Prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  block.append(nav);
}
