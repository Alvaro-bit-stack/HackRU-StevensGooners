// Enhanced course ID detection
function detectCourseId() {
  const urlMatch = window.location.pathname.match(/\/courses\/(\d+)/);
  if (urlMatch) {
    const courseId = urlMatch[1];
    console.log("🎓 Canvas Study AI: Detected course ID:", courseId);
    
    // Store course ID and additional info
    chrome.storage.local.set({ 
      currentCourseId: courseId,
      courseUrl: window.location.href,
      lastDetected: Date.now()
    });
    
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      type: "COURSE_DETECTED",
      courseId: courseId,
      url: window.location.href
    });
    
    return courseId;
  }
  return null;
}

// Initial detection
detectCourseId();

// Listen for URL changes (SPA navigation)
let lastUrl = window.location.href;
new MutationObserver(() => {
  const url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    detectCourseId();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_COURSE_ID") {
    const courseId = detectCourseId();
    sendResponse({ courseId: courseId });
  }
});
