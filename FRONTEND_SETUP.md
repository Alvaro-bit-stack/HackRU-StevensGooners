# Canvas AI Assistant - Frontend Setup

This Next.js frontend provides a web interface for your Canvas AI Assistant, allowing users to interact with the AI through a modern web application instead of a browser extension.

## Features

- 🤖 **AI Chat Interface**: Ask questions about your course content
- 📚 **Course Integration**: Connect to any Canvas course using Course ID and API token
- 🔍 **Course ID Helper**: Automatically extract Course ID from Canvas URLs
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Secure**: API tokens are handled securely and not stored

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Start Your Python Backend

Make sure your Python backend is running on `http://localhost:8000`:

```bash
cd backend
python main.py
```

### 4. Get Your Canvas Credentials

1. **Canvas API Token**:
   - Log into Canvas
   - Go to Account → Settings
   - Scroll to "Approved Integrations"
   - Click "+ New Access Token"
   - Copy the generated token

2. **Course ID**:
   - Go to your Canvas course
   - Copy the URL (e.g., `canvas.instructure.com/courses/12345`)
   - The Course ID is the number after `/courses/`

## How to Use

1. **Open the web app** at `http://localhost:3000`
2. **Follow the setup instructions** on the page
3. **Enter your Canvas credentials**:
   - Course ID (use the helper tool to extract it)
   - Canvas API Token
4. **Click "Connect to Canvas"**
5. **Start asking questions** about your course content!

## Example Questions

- "When is the next exam?"
- "What are the assignment requirements for HW3?"
- "Explain the grading policy"
- "What topics are covered in this week's lecture?"
- "What is the syllabus for this course?"

## Architecture

```
Frontend (Next.js) → API Route → Python Backend → Canvas API
     ↓                    ↓              ↓
User Interface → /api/canvas/ask → FastAPI → Canvas Course Data
```

## Components

- **CanvasAIAssistant**: Main chat interface
- **CourseIdHelper**: Tool to extract Course ID from URLs
- **SetupInstructions**: Step-by-step setup guide
- **API Route**: `/api/canvas/ask` - Proxies requests to Python backend

## Development

The frontend is built with:
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - Latest React features

## Deployment

To deploy this application:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify** or your preferred platform

3. **Update the API endpoint** in the components to point to your deployed backend

## Troubleshooting

- **"Failed to connect to AI assistant"**: Make sure your Python backend is running on port 8000
- **"Could not extract Course ID"**: Make sure you're using a valid Canvas course URL
- **CORS errors**: The Next.js API route handles CORS automatically

## Security Notes

- API tokens are not stored permanently
- All requests go through the Next.js API route for security
- Canvas data is processed locally on your machine
