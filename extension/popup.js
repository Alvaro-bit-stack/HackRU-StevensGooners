const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const chatContainer = document.getElementById("chat");
const loader = document.getElementById("loader");

askButton.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) return;

  // Show user message
  appendMessage(question, "user");
  questionInput.value = "";
  loader.style.display = "block";

  // Get current course ID from content script
  const data = await chrome.storage.local.get("currentCourseId");
  const courseId = data.currentCourseId;

  if (!courseId) {
    alert("Course ID not detected!");
    loader.style.display = "none";
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, question })
    });

    const result = await response.json();
    if (result.answer_html) {
      appendMessage(result.answer_html, "ai");
    } else {
      appendMessage("Sorry, I couldn't get a response. Please try again.", "ai");
    }
  } catch (err) {
    appendMessage("Error fetching answer.", "ai");
    console.error(err);
  } finally {
    loader.style.display = "none";
  }
});

function appendMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = text;
  chatContainer.prepend(msg); // newest messages at bottom
}
