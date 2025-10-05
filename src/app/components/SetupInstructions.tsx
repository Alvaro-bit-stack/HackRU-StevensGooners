"use client";

export default function SetupInstructions() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">
        🚀 Getting Started with Canvas AI Assistant
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">Step 1: Get Your Canvas API Token</h4>
          <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
            <li>Log into your Canvas account</li>
            <li>Go to Account → Settings</li>
            <li>Scroll down to "Approved Integrations"</li>
            <li>Click "+ New Access Token"</li>
            <li>Give it a name (e.g., "AI Assistant")</li>
            <li>Copy the generated token</li>
          </ol>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-700 mb-2">Step 2: Find Your Course ID</h4>
          <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
            <li>Go to your Canvas course page</li>
            <li>Look at the URL in your browser</li>
            <li>Find the number after "/courses/"</li>
            <li>Example: canvas.instructure.com/courses/12345</li>
            <li>The Course ID is: 12345</li>
          </ol>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>Make sure your Python backend is running on localhost:8000</li>
          <li>Your Canvas API token should have read permissions</li>
          <li>The AI will analyze your course files, pages, and assignments</li>
          <li>All data processing happens locally - your information stays private</li>
        </ul>
      </div>
    </div>
  );
}
