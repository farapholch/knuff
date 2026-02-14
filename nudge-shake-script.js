// Nudge shake effect - for UNREAD or NEW nudges
(function() {
  const getMyUsername = () => {
    if (window.Meteor?.user) return Meteor.user()?.username;
    return null;
  };

  const style = document.createElement("style");
  style.textContent = `
    @keyframes nudge-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .nudge-shaking * {
      animation: nudge-shake 0.5s ease-in-out !important;
    }
  `;
  document.head.appendChild(style);

  // Load shaken IDs from localStorage
  const STORAGE_KEY = 'knuff_shaken';
  const getShaken = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch { return new Set(); }
  };
  const saveShaken = (set) => {
    const arr = [...set].slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  const shaken = getShaken();

  const observer = new MutationObserver((mutations) => {
    const myUsername = getMyUsername();
    if (!myUsername) return;

    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;

        const messages = node.matches?.('[data-mid]')
          ? [node]
          : Array.from(node.querySelectorAll?.('[data-mid]') || []);

        messages.forEach(msg => {
          const msgId = msg.getAttribute('data-mid');
          if (!msgId || shaken.has(msgId)) return;

          const isUnread = msg.getAttribute('data-unread') === 'true';
          
          // Check if message is new (within last 10 seconds)
          let isNew = false;
          const timeEl = msg.querySelector('time');
          if (timeEl) {
            const msgTime = new Date(timeEl.getAttribute('datetime')).getTime();
            isNew = (Date.now() - msgTime) < 10000;
          }

          // Only process if unread OR new
          if (!isUnread && !isNew) return;

          const text = msg.textContent || "";
          const nudgeMatch = text.match(/(\w+) knuffade @(\w+)/);

          if (nudgeMatch && nudgeMatch[2].toLowerCase() === myUsername.toLowerCase()) {
            shaken.add(msgId);
            saveShaken(shaken);
            document.body.classList.add("nudge-shaking");
            setTimeout(() => document.body.classList.remove("nudge-shaking"), 500);
          }
        });
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
