// add delayed functionality here
function initializeChat() {
  function checkAPI() {
    // More robust check for API availability
    if (typeof window.Comm100API !== 'undefined'
      && window.Comm100API
      && typeof window.Comm100API.get === 'function') {
      try {
        const status = window.Comm100API.get('livechat.button.status');
        console.log('🎈 ~ checkAPI ~ status: ~~~~~~~~~~~~ ', status);
        if (status === 'online') {
          window.Comm100API.do('livechat.invitation.show', '621e6cd0-932a-41ad-bb21-dc2c8a4e81ba&scopingcampaignid');
        }
        console.log('Chat initialized successfully');
      } catch (error) {
        // eslint-disable-next-line no-console
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

export default function loadChatScript() {
  // Check if already loaded
  if (window.chatLoaded) return;
  window.chatLoaded = true;

  // Load script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://vue.comm100.com/livechat.ashx?siteId=1000020';
  script.onload = () => {
    // Initialize chat after script loads
    initializeChat();
  };
  script.onerror = () => console.warn('Failed to load chat script');
  document.head.appendChild(script);
}
