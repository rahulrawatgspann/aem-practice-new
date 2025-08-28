function initializeChat(config, container) {
  function checkAPI() {
    // More robust check for API availability
    if (typeof window.Comm100API !== 'undefined'
        && window.Comm100API
        && typeof window.Comm100API.get === 'function') {
      try {
        const status = window.Comm100API.get('livechat.button.status');
        console.log('Chat status:', status);

        if (status === 'online') {
          window.Comm100API.do('livechat.invitation.show', config.invitationId);
        }

        container.innerHTML = `<div class="chat-ready">Chat initialized (Status: ${status})</div>`;
        console.log('Chat initialized successfully');
      } catch (error) {
        console.warn('Chat initialization error:', error);
        // Retry after a longer delay
        setTimeout(checkAPI, 500);
      }
    } else {
      // API not ready, retry
      setTimeout(checkAPI, 200);
    }
  }

  // Start checking after a small delay
  setTimeout(checkAPI, 100);
}

function loadChatScript(config, container) {
  // Check if script already loaded globally
  if (window.Comm100API) {
    initializeChat(config, container);
    return;
  }

  // Check if we're already loading to prevent duplicates
  if (window.chatScriptLoading) {
    return;
  }

  window.chatScriptLoading = true;

  // Load the Comm100 script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://vue.comm100.com/livechat.ashx?siteId=${config.siteId}`;

  script.onload = () => {
    window.chatScriptLoading = false;
    initializeChat(config, container);
  };

  script.onerror = () => {
    window.chatScriptLoading = false;
    container.innerHTML = '<div class="chat-error">Failed to load chat service</div>';
  };

  document.head.appendChild(script);
}

export default function decorate(block) {
  const [configRow] = block.children;
  const config = {
    siteId: '1000020',
    invitationId: '621e6cd0-932a-41ad-bb21-dc2c8a4e81ba&scopingcampaignid',
  };

  // Parse configuration from block content
  if (configRow) {
    const cells = configRow.querySelectorAll('div');
    if (cells[0]) config.siteId = cells[0].textContent.trim() || config.siteId;
    if (cells[1]) config.invitationId = cells[1].textContent.trim() || config.invitationId;
  }

  // Clear the block content
  block.innerHTML = '';

  // Create container for the chat
  const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  chatContainer.innerHTML = '<div class="chat-status">Loading chat...</div>';
  block.appendChild(chatContainer);

  // Load the chat script
  loadChatScript(config, chatContainer);
}
