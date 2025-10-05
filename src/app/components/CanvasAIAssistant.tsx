"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

export default function CanvasAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [canvasToken, setCanvasToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !courseId.trim() || !canvasToken.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      console.log('Sending request to backend:', { course_id: parseInt(courseId), question: inputText });
      
      const response = await fetch('/api/canvas/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: parseInt(courseId),
          question: inputText
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.answer_html || result.error || "Sorry, I couldn't process your question. Please try again.",
        type: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsConnected(true);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Error connecting to AI assistant: ${error instanceof Error ? error.message : 'Unknown error'}. Please check that your Python backend is running on localhost:8000`,
        type: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      const result = await response.json();
      console.log('Backend health check:', result);
      return true;
    } catch (error) {
      console.error('Backend not reachable:', error);
      return false;
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <section className="flex flex-col items-center justify-center my-16 mx-auto max-w-4xl p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Canvas AI Assistant
      </h2>
      
      <p className="text-gray-600 mb-8 text-center max-w-2xl">
        Ask questions about your course content, assignments, syllabus, and more. 
        The AI will analyze your Canvas course materials to provide accurate answers.
      </p>

      {/* Connection Setup */}
      {!isConnected && (
        <div className="w-full max-w-2xl mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Setup Required</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canvas Course ID
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter your Canvas course ID (found in the course URL)"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: If your course URL is canvas.instructure.com/courses/12345, enter "12345"
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canvas API Token
              </label>
              <input
                type="password"
                value={canvasToken}
                onChange={(e) => setCanvasToken(e.target.value)}
                placeholder="Enter your Canvas API token"
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API token from Canvas → Account → Settings → Approved Integrations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isConnected && (
        <div className="w-full max-w-4xl">
          {/* Chat Messages */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg mb-2">👋 Welcome to your Canvas AI Assistant!</p>
                <p>Ask me anything about your course content, assignments, or syllabus.</p>
                <div className="mt-4 text-sm">
                  <p className="font-semibold">Try asking:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>"When is the next exam?"</li>
                    <li>"What are the assignment requirements?"</li>
                    <li>"Explain the grading policy"</li>
                    <li>"What topics are covered in this week's lecture?"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about your course..."
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>

          {/* Clear Chat Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Clear Chat
            </button>
          </div>
        </div>
      )}

      {/* Connect Button */}
      {!isConnected && courseId.trim() && canvasToken.trim() && (
        <div className="flex gap-4">
          <button
            onClick={async () => {
              const isBackendRunning = await testBackendConnection();
              if (isBackendRunning) {
                const testMessage: Message = {
                  id: Date.now().toString(),
                  text: "✅ Backend is running! You can now ask questions.",
                  type: 'ai',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, testMessage]);
              } else {
                const errorMessage: Message = {
                  id: Date.now().toString(),
                  text: "❌ Backend is not running. Please start your Python backend with: <code>python main.py</code>",
                  type: 'ai',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Test Backend
          </button>
          <button
            onClick={() => setIsConnected(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Connect to Canvas
          </button>
        </div>
      )}
    </section>
  );
}
