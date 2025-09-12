// header.js
import { decorateIcons } from '../../scripts/aem.js';
import {
  div, a, span, nav, img, input, button, form, ul, li, h3,
} from '../../scripts/dom-builder.js';

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
    ),
  );
  decorateIcons(header);
  return header;
}

function createSubHeader() {
  const subHeader = nav(
    {
      class: 'search-header p-4 text-center',
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

/**
 * Extracts navigation data from a container block
 * @param {Element} container The container element
 * @returns {Object} Navigation data with title and items
 */
function extractNavData(container) {
  const data = { title: '', items: [] };
  // Parse AEM Author specific nested div structure
  if (data.items.length === 0) {
    const allDivs = container.querySelectorAll('div');
    if (!data.title) {
      let foundTitle = false;
      allDivs.forEach((innerDiv) => {
        const divText = innerDiv.textContent.trim();
        const hasChildDivs = innerDiv.querySelector('div') !== null;
        const hasChildPs = innerDiv.querySelector('p') !== null;
        if (divText && !hasChildDivs && !hasChildPs && !foundTitle && divText.length < 50) {
          data.title = divText;
          foundTitle = true;
        }
      });
    }
    // Now look for paragraphs anywhere in the container (including nested)
    const allParagraphs = container.querySelectorAll('p');
    if (allParagraphs.length > 0) {
      for (let i = 0; i < allParagraphs.length; i += 2) {
        const titleP = allParagraphs[i];
        const linkP = allParagraphs[i + 1];
        if (titleP && linkP) {
          const title = titleP.textContent.trim();
          const url = linkP.textContent.trim();
          if (title && url) {
            data.items.push({ title, url });
          }
        }
      }
    }
  }
  return data;
}

/**
 * Builds a navigation category from a nav-container block
 * @param {Element} container The nav-container block
 * @returns {Element} Navigation category element
 */
function buildNavCategory(container) {
  const categoryData = extractNavData(container);
  if (!categoryData.title && categoryData.items.length === 0) {
    return null;
  }
  const categoryWrapper = div({ class: 'nav-category relative' });

  // Add category title
  if (categoryData.title) {
    const categoryTitle = h3({
      class: 'nav-category-title text-lg font-semibold cursor-pointer hover:text-blue-600 p-2',
    }, categoryData.title);
    categoryWrapper.appendChild(categoryTitle);
  }

  // Add navigation items
  if (categoryData.items.length > 0) {
    const itemsList = ul({
      class: 'nav-items hidden absolute top-full left-0 bg-white shadow-lg rounded-md min-w-48 z-10',
    });

    categoryData.items.forEach((item) => {
      const listItem = li({ class: 'nav-item' });
      const link = a({
        href: item.url || '#',
        class: 'nav-link block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 border-b border-gray-100 last:border-b-0',
      }, item.title);

      // Handle external links
      if (item.url && (item.url.startsWith('http') || item.url.startsWith('mailto'))) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }

      listItem.appendChild(link);
      itemsList.appendChild(listItem);
    });

    categoryWrapper.appendChild(itemsList);

    // Add hover functionality
    categoryWrapper.addEventListener('mouseenter', () => {
      itemsList.classList.remove('hidden');
    });

    categoryWrapper.addEventListener('mouseleave', () => {
      itemsList.classList.add('hidden');
    });
  }

  return categoryWrapper;
}

/**
 * Fallback method to build navigation from any content
 * @param {Element} headerBlock The header block
 * @returns {Element} Navigation element
 */
function buildNavigationFromContent(headerBlock) {
  const possibleNavBlocks = headerBlock.querySelectorAll('div, section');
  const headerNav = nav({ class: 'header-navigation flex gap-8' });

  possibleNavBlocks.forEach((block) => {
    const textContent = block.textContent.trim();
    if (textContent && textContent.length > 5) {
      const categoryData = extractNavData(block);
      if (categoryData.title || categoryData.items.length > 0) {
        const navCategory = buildNavCategory(block);
        if (navCategory) {
          headerNav.appendChild(navCategory);
        }
      }
    }
  });

  return headerNav;
}

/**
 * Processes navigation container blocks and builds navigation structure
 * @param {Element} headerBlock The header block containing navigation data
 * @returns {Element} Structured navigation element
 */
function buildNavigationFromBlocks(headerBlock) {
  const navContainers = headerBlock.querySelectorAll('.nav-container');

  if (navContainers.length === 0) {
    // Fallback
    return buildNavigationFromContent(headerBlock);
  }
  const headerNav = nav({ class: 'header-navigation flex gap-8' });
  navContainers.forEach((container) => {
    const navCategory = buildNavCategory(container);
    if (navCategory) {
      headerNav.appendChild(navCategory);
    }
  });
  return headerNav;
}

function buildButtonBlock(headerBlock) {
  const buttonHTMLBlock = headerBlock?.children[0];
  // const buttonHTMLBlock2 = buttonHTMLBlock?.children[0];
  if (buttonHTMLBlock) buttonHTMLBlock.className = 'build-button-block';
}

/**
 * Main header decoration function
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  try {
    // Fetch the header fragment (similar to the reference code)
    const resp = await fetch('/nav.plain.html');
    const html = await resp.text();

    // Create header container
    const headerBlock = div({
      class: 'header-container bg-white shadow-sm relative z-20',
    });
    headerBlock.innerHTML = html;
    buildButtonBlock(headerBlock);
    const headerButtonSection = headerBlock?.querySelector('.build-button-block');

    // create header + subheader
    const headerEl = createHeader();
    const subHeaderEl = createSubHeader();

    // Build navigation from the fetched content
    const navigation = buildNavigationFromBlocks(headerBlock);

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper fixed top-0 left-0 w-full bg-gray-800 text-white flex flex-col z-50';

    // append to wrapper (header first)
    navWrapper.append(headerEl);
    subHeaderEl.append(headerButtonSection);
    navWrapper.append(subHeaderEl);
    navWrapper.append(navigation);
    block.append(navWrapper);
  } catch (error) {
    console.error('Error building header:', error);

    // Fallback: try to build navigation from the block content directly
    const fallbackNav = buildNavigationFromContent(block);
    if (fallbackNav.children.length > 0) {
      block.innerHTML = '';
      block.appendChild(fallbackNav);
    }
  }

  return block;
}
