"use client";

import { useState } from "react";

export default function GetGrades() {
  const [courseId, setCourseId] = useState("");
  const [target, setTarget] = useState("");
  const [canvasToken, setCanvasToken] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // --- Submit to /needed_uniform
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcError(null);
    setResult(null);

    if (!courseId || !target) {
      setCalcError("Please provide a Course ID and Desired %.");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8001/needed_uniform?course_id=${courseId}&target=${target}`
      );
      if (!res.ok) throw new Error("Failed to fetch calculation.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setCalcError("Error fetching calculation.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center my-16 mx-auto max-w-xl p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Get Grades Needed to Reach a Desired Grade
      </h2>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Canvas Token */}
        <input
          type="password"
          placeholder="Canvas API Token"
          value={canvasToken}
          onChange={(e) => setCanvasToken(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Course ID */}
        <input
          type="number"
          placeholder="Course ID (1-10)"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Target */}
        <input
          type="number"
          placeholder="Desired Final % (0-100)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>
      </form>

      {calcError && <p className="text-red-600 mt-4">{calcError}</p>}

      {result && (
        <div className="w-full mt-8 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}