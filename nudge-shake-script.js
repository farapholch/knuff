// Nudge shake effect - only new messages
// Add this to Rocket.Chat: Admin → Layout → Custom Scripts → Custom Script for Logged In Users
(function() {
  const startTime = Date.now();
  let initialLoadDone = false;
  
  // Wait for initial page load
  setTimeout(() => { initialLoadDone = true; }, 3000);

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
          document.body.classList.add("nudge-shaking");
          setTimeout(() => document.body.classList.remove("nudge-shaking"), 500);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
