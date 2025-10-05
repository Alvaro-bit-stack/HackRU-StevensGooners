"use client";

import { useState } from "react";

export default function CourseIdHelper() {
  const [canvasUrl, setCanvasUrl] = useState("");
  const [extractedId, setExtractedId] = useState<string | null>(null);

  const extractCourseId = (url: string) => {
    // Pattern to match Canvas course URLs
    const patterns = [
      /\/courses\/(\d+)/,  // Standard Canvas URL pattern
      /course\/(\d+)/,     // Alternative pattern
      /id=(\d+)/,         // Query parameter pattern
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleExtract = () => {
    const courseId = extractCourseId(canvasUrl);
    setExtractedId(courseId);
  };

  const copyToClipboard = () => {
    if (extractedId) {
      navigator.clipboard.writeText(extractedId);
      alert("Course ID copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-yellow-50 rounded-lg border border-yellow-200 mb-8">
      <h3 className="text-xl font-semibold text-yellow-800 mb-4">
        🔍 Need Help Finding Your Course ID?
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your Canvas course URL here:
          </label>
          <input
            type="url"
            value={canvasUrl}
            onChange={(e) => setCanvasUrl(e.target.value)}
            placeholder="https://your-school.instructure.com/courses/12345"
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          onClick={handleExtract}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Extract Course ID
        </button>

        {extractedId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">
              ✅ Course ID Found: <span className="font-mono bg-green-100 px-2 py-1 rounded">{extractedId}</span>
            </p>
            <button
              onClick={copyToClipboard}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        {canvasUrl && !extractedId && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              ❌ Could not extract Course ID from this URL. Please make sure it's a valid Canvas course URL.
            </p>
            <p className="text-sm text-red-600 mt-2">
              Example: https://your-school.instructure.com/courses/12345
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold mb-2">How to find your Course ID:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to your Canvas course page</li>
          <li>Copy the URL from your browser's address bar</li>
          <li>Paste it in the field above</li>
          <li>Click "Extract Course ID"</li>
        </ol>
      </div>
    </div>
  );
}
