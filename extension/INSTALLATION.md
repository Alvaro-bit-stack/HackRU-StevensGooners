# Canvas Study AI - Browser Extension

A powerful AI assistant for Canvas courses that helps students by analyzing course content, assignments, and syllabus to answer questions.

## 🚀 Features

- **Smart Course Detection**: Automatically detects your current Canvas course
- **AI-Powered Q&A**: Ask questions about course content, assignments, and syllabus
- **Real-time Chat**: Interactive chat interface with your course AI assistant
- **Cross-Platform**: Works with any Canvas instance (instructure.com, canvaslms.com, etc.)
- **Privacy-Focused**: All processing happens locally on your machine

## 📋 Prerequisites

1. **Python Backend Running**: Make sure your Python backend is running on `localhost:8000`
2. **Canvas API Access**: You need Canvas API credentials (API token and course access)

## 🔧 Installation

### Step 1: Load the Extension

1. **Open Chrome/Edge**: Go to `chrome://extensions/` (or `edge://extensions/`)
2. **Enable Developer Mode**: Toggle the "Developer mode" switch in the top right
3. **Load Unpacked**: Click "Load unpacked" and select the `extension` folder
4. **Pin Extension**: Click the puzzle piece icon and pin "Canvas Study AI"

### Step 2: Start Your Backend

```bash
cd backend
python main.py
```

Make sure you see: `Uvicorn running on http://127.0.0.1:8000`

### Step 3: Test the Extension

1. **Go to a Canvas course**: Navigate to any Canvas course page
2. **Click the extension icon**: You should see the Canvas Study AI popup
3. **Test connection**: Click "Test Connection" to verify backend connectivity
4. **Start asking questions**: Try "When is the next exam?" or "What are the assignment requirements?"

## 🎯 How to Use

### Basic Usage

1. **Navigate to Canvas**: Go to any Canvas course page
2. **Open Extension**: Click the Canvas Study AI icon in your browser toolbar
3. **Ask Questions**: Type your question and click "Ask AI"
4. **Get Answers**: The AI will analyze your course content and provide answers

### Example Questions

- "When is the next exam?"
- "What are the requirements for HW3?"
- "Explain the grading policy"
- "What topics are covered this week?"
- "What is the syllabus for this course?"
- "What are the assignment deadlines?"

## 🔧 Troubleshooting

### Extension Not Working

1. **Check Backend**: Make sure Python backend is running on port 8000
2. **Check Console**: Open browser dev tools (F12) and check for errors
3. **Reload Extension**: Go to `chrome://extensions/` and click the reload button
4. **Check Permissions**: Ensure the extension has access to Canvas pages

### "Backend Offline" Error

1. **Start Backend**: Run `python main.py` in the backend directory
2. **Check Port**: Ensure nothing else is using port 8000
3. **Test Connection**: Click "Test Connection" in the extension popup
4. **Check Firewall**: Make sure your firewall allows localhost connections

### "Course ID Not Detected" Error

1. **Refresh Page**: Reload the Canvas course page
2. **Check URL**: Make sure you're on a course page (URL contains `/courses/`)
3. **Wait for Detection**: The extension needs a moment to detect the course
4. **Manual Check**: Look at the course URL - it should contain a number after `/courses/`

### AI Not Responding

1. **Check Backend Logs**: Look at the Python console for errors
2. **Verify API Keys**: Make sure your Canvas API token is valid
3. **Check Course Access**: Ensure you have access to the course content
4. **Try Different Question**: Some questions might not have answers in the course materials

## 🛠️ Development

### File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
├── content.js             # Content script for course detection
├── icon.png               # Extension icon
└── INSTALLATION.md        # This file
```

### Key Components

- **popup.html**: The main interface users see
- **popup.js**: Handles user interactions and API calls
- **content.js**: Detects course ID from Canvas pages
- **manifest.json**: Defines extension permissions and behavior

### Customization

- **Styling**: Edit `popup.css` to change the appearance
- **Functionality**: Modify `popup.js` to add new features
- **Detection**: Update `content.js` to change course detection logic

## 🔒 Privacy & Security

- **Local Processing**: All AI processing happens on your local machine
- **No Data Collection**: The extension doesn't collect or store personal data
- **Secure API**: Uses your own Canvas API credentials
- **Open Source**: All code is visible and auditable

## 📞 Support

If you encounter issues:

1. **Check the console**: Open browser dev tools (F12) for error messages
2. **Verify setup**: Ensure backend is running and accessible
3. **Test permissions**: Make sure the extension has Canvas access
4. **Restart everything**: Close browser, restart backend, reload extension

## 🎉 Success!

Once everything is working, you'll have a powerful AI assistant that can help you with:

- Understanding course requirements
- Finding assignment information
- Explaining grading policies
- Getting exam dates and topics
- Analyzing course materials

Happy studying! 🎓
