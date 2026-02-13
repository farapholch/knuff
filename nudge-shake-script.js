// Nudge shake effect - with localStorage persistence
// Add this to Rocket.Chat: Admin → Layout → Custom Scripts → Custom Script for Logged In Users
(function() {
  const STORAGE_KEY = "rc_nudge_seen";
  const seen = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  
  const saveSeen = () => {
    const arr = [...seen].slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  let initialLoadDone = false;
  setTimeout(() => { initialLoadDone = true; }, 2000);

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

  const observer = new MutationObserver((mutations) => {
    if (!initialLoadDone) return;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.textContent && node.textContent.includes("knuffade")) {
          // Find message ID from parent elements
          const msgEl = node.closest("[data-qa-id], [data-id], [id*='message']") || node;
          const msgId = msgEl.getAttribute("data-qa-id") || msgEl.getAttribute("data-id") || msgEl.id || node.textContent.substring(0, 80);
          
          if (!seen.has(msgId)) {
            seen.add(msgId);
            saveSeen();
            document.body.classList.add("nudge-shaking");
            setTimeout(() => document.body.classList.remove("nudge-shaking"), 500);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
