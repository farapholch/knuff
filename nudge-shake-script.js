// Nudge shake effect - only when YOU are nudged (robust)
// Add this to Rocket.Chat: Admin → Layout → Custom Scripts → Custom Script for Logged In Users
(function() {
  const STORAGE_KEY = "rc_nudge_seen";
  const seen = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  
  const saveSeen = () => {
    const arr = [...seen].slice(-500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

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

  const observer = new MutationObserver((mutations) => {
    const myUsername = getMyUsername();
    if (!myUsername) return;
    
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const text = node.textContent || "";
          
          // Check if this is a nudge directed at ME
          const nudgeMatch = text.match(/(\w+) knuffade @(\w+)/);
          if (nudgeMatch && nudgeMatch[2].toLowerCase() === myUsername.toLowerCase()) {
            // Use consistent ID: "sender_knuffade_target_roompath"
            const msgId = nudgeMatch[1] + "_knuffade_" + nudgeMatch[2] + "_" + window.location.pathname;
            
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
