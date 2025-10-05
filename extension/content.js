// Get course ID from the URL
const urlMatch = window.location.pathname.match(/\/courses\/(\d+)/);
if (urlMatch) {
  const courseId = urlMatch[1];
  console.log("Detected course ID:", courseId);

  // Send course ID to popup or background
  chrome.storage.local.set({ currentCourseId: courseId });
}
