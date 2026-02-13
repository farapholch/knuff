// Nudge shake effect - robust version
// Add this to Rocket.Chat: Admin → Layout → Custom Scripts → Custom Script for Logged In Users
(function() {
  const STORAGE_KEY = "rc_nudge_seen";
  const seen = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  
  const saveSeen = () => {
    const arr = [...seen].slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  // Track current room to reset timer on room change
  let currentRoom = window.location.pathname;
  let initialLoadDone = false;
  
  const resetTimer = () => {
    initialLoadDone = false;
    setTimeout(() => { initialLoadDone = true; }, 2000);
  };
  
  // Watch for room changes
  setInterval(() => {
    if (window.location.pathname !== currentRoom) {
      currentRoom = window.location.pathname;
      resetTimer();
    }
  }, 500);
  
  resetTimer();

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
        if (node.nodeType === 1) {
          const text = node.textContent || "";
          if (text.includes("knuffade")) {
            // Use the nudge text itself as ID (e.g. "lillpelle knuffade @user")
            const match = text.match(/(\w+ knuffade @\w+)/);
            const msgId = match ? match[1] + "_" + currentRoom : text.substring(0, 100);
            
            if (!seen.has(msgId)) {
              seen.add(msgId);
              saveSeen();
              document.body.classList.add("nudge-shaking");
              setTimeout(() => document.body.classList.remove("nudge-shaking"), 500);
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
