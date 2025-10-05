// DOM elements
const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const chatContainer = document.getElementById("chat");
const buttonText = document.getElementById("buttonText");
const buttonLoader = document.getElementById("buttonLoader");
const statusIndicator = document.getElementById("status");
const statusText = document.getElementById("statusText");
const setupSection = document.getElementById("setupSection");
const mainSection = document.getElementById("mainSection");
const testConnectionBtn = document.getElementById("testConnection");
const clearChatBtn = document.getElementById("clearChat");
const courseInfo = document.getElementById("courseInfo");

// State
let isConnected = false;
let isLoading = false;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await checkConnection();
  await updateCourseInfo();
  showWelcomeMessage();
});

// Test connection to backend
testConnectionBtn.addEventListener("click", async () => {
  await checkConnection();
});

// Ask button functionality
askButton.addEventListener("click", async () => {
  if (isLoading) return;
  
  const question = questionInput.value.trim();
  if (!question) return;

  await askQuestion(question);
});

// Enter key support
questionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    askButton.click();
  }
});

// Clear chat
clearChatBtn.addEventListener("click", () => {
  chatContainer.innerHTML = "";
  showWelcomeMessage();
});

async function checkConnection() {
  setStatus("loading", "Testing connection...");
  
  try {
    // First test if backend is running
    const healthResponse = await fetch("http://localhost:8000/health");
    if (!healthResponse.ok) {
      throw new Error("Backend not responding");
    }
    
    setStatus("success", "Backend connected");
    isConnected = true;
    setupSection.style.display = "none";
    mainSection.style.display = "flex";
  } catch (error) {
    setStatus("error", "Backend offline");
    isConnected = false;
    setupSection.style.display = "flex";
    mainSection.style.display = "none";
    console.error("Connection test failed:", error);
  }
}

async function askQuestion(question) {
  if (!isConnected) {
    await checkConnection();
    if (!isConnected) return;
  }

  // Get current course ID from content script
  const data = await chrome.storage.local.get("currentCourseId");
  const courseId = data.currentCourseId;

  if (!courseId) {
    appendMessage("❌ Course ID not detected! Make sure you're on a Canvas course page.", "ai");
    return;
  }

  // Show user message
  appendMessage(question, "user");
  questionInput.value = "";
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: parseInt(courseId), question })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.answer_html) {
      appendMessage(result.answer_html, "ai");
    } else if (result.error) {
      appendMessage(`❌ ${result.error}`, "ai");
    } else {
      appendMessage("Sorry, I couldn't get a response. Please try again.", "ai");
    }
  } catch (err) {
    console.error("Error:", err);
    appendMessage(`❌ Error connecting to AI assistant: ${err.message}. Make sure your Python backend is running on localhost:8000`, "ai");
  } finally {
    setLoading(false);
  }
}

function setStatus(type, text) {
  statusIndicator.className = `status-indicator ${type}`;
  statusText.textContent = text;
}

function setLoading(loading) {
  isLoading = loading;
  askButton.disabled = loading;
  buttonText.style.display = loading ? "none" : "inline";
  buttonLoader.style.display = loading ? "block" : "none";
  
  if (loading) {
    setStatus("loading", "AI is thinking...");
  } else {
    setStatus("success", "Ready");
  }
}

function appendMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = text;
  chatContainer.prepend(msg);
  
  // Auto-scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showWelcomeMessage() {
  if (chatContainer.children.length === 0) {
    const welcomeDiv = document.createElement("div");
    welcomeDiv.className = "welcome-message";
    welcomeDiv.innerHTML = `
      <h4>👋 Welcome to Canvas Study AI!</h4>
      <p>Ask me anything about your course content, assignments, or syllabus.</p>
      <div class="example-questions">
        <h5>💡 Try asking:</h5>
        <ul>
          <li>"When is the next exam?"</li>
          <li>"What are the assignment requirements?"</li>
          <li>"Explain the grading policy"</li>
          <li>"What topics are covered this week?"</li>
        </ul>
      </div>
    `;
    chatContainer.appendChild(welcomeDiv);
  }
}

async function updateCourseInfo() {
  const data = await chrome.storage.local.get("currentCourseId");
  const courseId = data.currentCourseId;
  
  if (courseId) {
    courseInfo.textContent = `Course: ${courseId}`;
  } else {
    courseInfo.textContent = "Course: Not detected";
  }
}
