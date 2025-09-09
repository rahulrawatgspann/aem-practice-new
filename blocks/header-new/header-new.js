// /* eslint-disable */
import { decorateIcons } from '../../scripts/aem.js';
import {
  div, a, span, nav, img, input, button, form,
} from '../../scripts/dom-builder.js';

// Header Component
function createHeader() {
  const header = nav(
    {
      class: 'fixed top-0 left-0 right-0 w-[100vw] max-w-screen overflow-x-hidden bg-blue-700 flex items-center justify-between px-4 md:px-6 py-2 box-border z-50',
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
      class: 'fixed left-0 right-0 w-[100vw] max-w-screen bg-white flex items-center justify-between px-6 py-3 border-b border-gray-200 box-border z-40',
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
    // Right Section → Quick Links
    div(
      { class: 'flex items-center space-x-6 text-sm text-blue-700' },
      a(
        {
          href: '#',
          class: 'flex items-center space-x-1 hover:underline',
          style: 'color: #0060a8',
        },
        span('Quick Order'),
        span({ class: 'icon icon-bolt' }),
      ),
      a(
        {
          href: '#',
          class: 'flex items-center space-x-1 hover:underline',
          style: 'color: #0060a8',
        },
        span('Request Quote'),
        span({ class: 'icon icon-chat' }),
      ),
      a(
        {
          href: '#',
          class: 'flex items-center space-x-1 hover:underline text-gray-700 pr-8',
          style: 'color: #0060a8',
        },
        span('Cart'),
        span({ class: 'icon icon-cart' }),
      ),
    ),
  );

  decorateIcons(subHeader);
  return subHeader;
}

/**
 * loads and decorates the header(s)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // create header + subheader
  const headerEl = createHeader();
  const subHeaderEl = createSubHeader();

  // append to wrapper (header first)
  navWrapper.append(headerEl);
  navWrapper.append(subHeaderEl);

  // attach wrapper to block (so elements are in DOM for measurement)
  block.append(navWrapper);

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
