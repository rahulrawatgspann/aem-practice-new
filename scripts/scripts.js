import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  toClassName,
  getMetadata,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

const TEMPLATE_LIST = [
  'test-sample', // console
  'first-template', // welcome
  'page-style-template', // style
  'self-contained-template', // header, footer,
  'blog-page',
];

async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    if (TEMPLATE_LIST.includes(template)) {
      const templateName = template;
      const mod = await import(`../templates/${templateName}/${templateName}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateTemplates(main);
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

// function initializeChat() {
//   function checkAPI() {
//     // More robust check for API availability
//     if (typeof window.Comm100API !== 'undefined'
//       && window.Comm100API
//       && typeof window.Comm100API.get === 'function') {
//       try {
//         const status = window.Comm100API.get('livechat.button.status');
//         if (status === 'online') {
//           window.Comm100API.do('livechat.invitation.show', '621e6cd0-932a-41ad-bb21-dc2c8a4e81ba&scopingcampaignid');
//         }
//         console.log('Chat initialized successfully');
//       } catch (error) {
//         console.warn('Chat initialization error:', error);
//         // Retry after a longer delay
//         setTimeout(checkAPI, 500);
//       }
//     } else {
//       // API not ready, retry
//       setTimeout(checkAPI, 200);
//     }
//   }
//   // Start checking after a small delay
//   setTimeout(checkAPI, 100);
// }

// function loadChatScript() {
//   // Check if already loaded
//   if (window.chatLoaded) return;
//   window.chatLoaded = true;

//   // Load script
//   const script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.async = true;
//   script.src = 'https://vue.comm100.com/livechat.ashx?siteId=1000020';
//   script.onload = () => {
//     // Initialize chat after script loads
//     initializeChat();
//   };
//   script.onerror = () => console.warn('Failed to load chat script');
//   document.head.appendChild(script);
// }

function createFallbackChatButton() {
  console.log('Creating fallback chat button...');
  const chatButton = document.createElement('div');
  chatButton.id = 'fallback-chat-button';
  chatButton.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      padding: 15px 20px;
      border-radius: 25px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
    ">
      Chat with us
    </div>
  `;
  chatButton.onclick = () => {
    if (window.Comm100API && typeof window.Comm100API.do === 'function') {
      try {
        window.Comm100API.do('livechat.window.show');
        console.log('Manually opened chat window');
      } catch (error) {
        console.error('Could not open chat manually:', error);
        alert('Chat service is currently unavailable. Please try again later.');
      }
    } else {
      console.error('Comm100API not available for manual chat opening');
      alert('Chat service is loading. Please wait a moment and try again.');
    }
  };
  document.body.appendChild(chatButton);
}

function initializeChatSafely() {
  if (!window.Comm100API) {
    console.log('Comm100API not available, retrying...');
    setTimeout(initializeChatSafely, 1000);
    return;
  }

  try {
    console.log('Attempting to get chat status...');
    // Try different API calls to see what works
    if (typeof window.Comm100API.get === 'function') {
      const status = window.Comm100API.get('livechat.button.status');
      console.log('Chat button status:', status);
    } else {
      console.log('Comm100API.get is not a function');
    }
    if (typeof window.Comm100API.do === 'function') {
      // Try to show the button first
      window.Comm100API.do('livechat.button.show');
      console.log('Called livechat.button.show');
      // Wait a moment then try to show invitation
      setTimeout(() => {
        try {
          const status = window.Comm100API.get('livechat.button.status');
          console.log('Status after showing button:', status);
          if (status === 'online') {
            window.Comm100API.do('livechat.invitation.show', '621e6cd0-932a-41ad-bb21-dc2c8a4e81ba&scopingcampaignid');
            console.log('Invitation shown for online status');
          } else {
            console.log('Chat is not online, status:', status);
            // Try showing button anyway for testing
            window.Comm100API.do('livechat.window.show');
            console.log('Tried showing chat window directly');
          }
        } catch (error) {
          console.error('Error in delayed initialization:', error);
        }
      }, 1000);
    } else {
      console.log('Comm100API.do is not a function');
    }
  } catch (error) {
    console.error('Chat initialization error:', error);
  }
  // Check again after 3 seconds to see if widget appeared
  setTimeout(() => {
    const comm100Elements = document.querySelectorAll('*[id*="comm100"], *[class*="comm100"], iframe[src*="comm100"], *[id*="c100"], *[class*="c100"]');
    console.log('Elements found after initialization:', comm100Elements.length);
    if (comm100Elements.length === 0) {
      console.warn('No chat widget elements found after initialization');
      createFallbackChatButton();
    }
  }, 3000);
}

function debugAndInitializeChat() {
  console.log('=== Comm100 Debug Info ===');
  console.log('Comm100API exists:', !!window.Comm100API);
  if (window.Comm100API) {
    console.log('Comm100API methods:', Object.getOwnPropertyNames(window.Comm100API));
    console.log('Comm100API type:', typeof window.Comm100API);
  }
  // Check for any Comm100-related elements in DOM
  const comm100Elements = document.querySelectorAll('*[id*="comm100"], *[class*="comm100"], iframe[src*="comm100"], *[id*="c100"], *[class*="c100"]');
  console.log('Found Comm100 elements:', comm100Elements.length);
  comm100Elements.forEach((el, i) => {
    console.log(`Element ${i}:`, el.tagName, el.id, el.className, 'Visible:', !el.hidden && window.getComputedStyle(el).display !== 'none');
  });
  // Try to initialize
  initializeChatSafely();
}

function loadChatScript() {
  // Check if already loaded
  if (window.chatLoaded) return;
  window.chatLoaded = true;

  // Load script
  console.log('Loading Comm100 chat script...');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://vue.comm100.com/livechat.ashx?siteId=1000020';
  script.onload = () => {
    // Initialize chat after script loads
    console.log('Comm100 script loaded successfully');
    setTimeout(debugAndInitializeChat, 2000);
  };
  script.onerror = () => console.error('Failed to load chat Comm100 script');
  document.head.appendChild(script);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
  // Load chat after 4 seconds
  window.setTimeout(() => {
    loadChatScript();
  }, 4000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
