/**
 * Helper for more concisely generating DOM Elements with attributes and children
 * @param {string} tag HTML tag of the desired element
 * @param  {[Object?, ...(HTMLElement)[]]} items: First item can optionally be an object of,
 *  attributes everything else is a child element
 * @returns {HTMLElement} The constructred DOM Element
 */
export function domEl(tag, ...items) {
  const element = document.createElement(tag);
  if (!items || items.length === 0) return element;
  if (!(items[0] instanceof Element || items[0] instanceof HTMLElement) && typeof items[0] === 'object') {
    const [attributes, ...rest] = items;
    // eslint-disable-next-line no-param-reassign
    items = rest;
    Object.entries(attributes).forEach(([key, value]) => {
      if (!key.startsWith('on')) {
        element.setAttribute(key, Array.isArray(value) ? value.join(' ') : value);
      } else {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      }
    });
  }
  items.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    item = item instanceof Element || item instanceof HTMLElement
      ? item : document.createTextNode(item);
    element.appendChild(item);
  });
  return element;
}
/*
  More short hand functions can be added for very common DOM elements below.
  domEl function from above can be used for one off DOM element occurrences.
*/
export const div = (...items) => domEl('div', ...items);
export const p = (...items) => domEl('p', ...items);
export const a = (...items) => domEl('a', ...items);
export const h1 = (...items) => domEl('h1', ...items);
export const h2 = (...items) => domEl('h2', ...items);
export const h3 = (...items) => domEl('h3', ...items);
export const h4 = (...items) => domEl('h4', ...items);
export const h5 = (...items) => domEl('h5', ...items);
export const h6 = (...items) => domEl('h6', ...items);
export const ul = (...items) => domEl('ul', ...items);
export const ol = (...items) => domEl('ol', ...items);
export const li = (...items) => domEl('li', ...items);
export const i = (...items) => domEl('i', ...items);
export const img = (...items) => domEl('img', ...items);
export const span = (...items) => domEl('span', ...items);
export const form = (...items) => domEl('form', ...items);
export const input = (...items) => domEl('input', ...items);
export const label = (...items) => domEl('label', ...items);
export const button = (...items) => domEl('button', ...items);
export const iframe = (...items) => domEl('iframe', ...items);
export const nav = (...items) => domEl('nav', ...items);
export const fieldset = (...items) => domEl('fieldset', ...items);
export const article = (...items) => domEl('article', ...items);
export const strong = (...items) => domEl('strong', ...items);
export const select = (...items) => domEl('select', ...items);
export const option = (...items) => domEl('option', ...items);
export const table = (...items) => domEl('table', ...items);
export const tbody = (...items) => domEl('tbody', ...items);
export const thead = (...items) => domEl('thead', ...items);
export const tr = (...items) => domEl('tr', ...items);
export const td = (...items) => domEl('td', ...items);
export const th = (...items) => domEl('th', ...items);
export const time = (...items) => domEl('time', ...items);
export const section = (...items) => domEl('section', ...items);
export const hr = (...items) => domEl('hr', ...items);
export const caption = (...items) => domEl('caption', ...items);
export const picture = (...items) => domEl('picture', ...items);
export const source = (...items) => domEl('source', ...items);
