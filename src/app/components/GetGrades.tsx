"use client";

import { useState } from "react";

export default function GetGrades() {
  const [courseId, setCourseId] = useState<string>("");
  const [targetPercent, setTargetPercent] = useState<string>("");
  const [canvasToken, setCanvasToken] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep dummy data for fallback/preview
  const dummyData = {
    original_category_scores: { Homework: 85, Quizzes: 78, Exams: 88 },
    task_breakdown: {
      Homework: { completed: 6, remaining: 4 },
      Quizzes: { completed: 3, remaining: 2 },
      Exams: { completed: 1, remaining: 1 },
    },
    needed_future_averages: { Homework: 90, Quizzes: 92, Exams: 89 },
    projected_final_category_scores: { Homework: 88, Quizzes: 85, Exams: 89 },
    projected_final_grade: 87.1,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const parsedCourseId = Number(courseId);
    const parsedTarget = Number(targetPercent);

    if (!Number.isFinite(parsedCourseId) || parsedCourseId <= 0) {
      setLoading(false);
      setError("Enter a valid positive Course ID.");
      return;
    }

    if (!Number.isFinite(parsedTarget) || parsedTarget < 0 || parsedTarget > 100) {
      setLoading(false);
      setError("Target % must be a number between 0 and 100.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_GRADING_API_URL || "http://localhost:8001";
      const url = `${baseUrl}/needed_uniform?course_id=${parsedCourseId}&target=${parsedTarget}`;

      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Optionally send token if backend ever requires it
          Authorization: canvasToken ? `Bearer ${canvasToken}` : "",
        },
      });

      if (!resp.ok) {
        throw new Error(`Request failed (${resp.status})`);
      }

      const data = await resp.json();
      setResult(data);
    } catch (err: any) {
      setError("Backend unavailable. Showing dummy data.");
      setResult(dummyData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center my-16 mx-auto max-w-xl p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Calculate Needed Averages for Target Final %
      </h2>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Course ID input (number) */}
        <input
          type="number"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Course ID (number)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Target final % input (number) */}
        <input
          type="number"
          value={targetPercent}
          onChange={(e) => setTargetPercent(e.target.value)}
          placeholder="Target final grade % (0-100)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={0}
          max={100}
          step={1}
        />

        {/* Canvas Token input */}
        <input
          type="password"
          value={canvasToken}
          onChange={(e) => setCanvasToken(e.target.value)}
          placeholder="Enter your Canvas API token"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}
        {!result && (
          <div className="text-sm text-gray-500">
            No results yet. Submit to fetch, or backend errors will show dummy data.
          </div>
        )}
        {result && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Projected Final Grade</h3>
                <div className="text-2xl font-bold text-blue-700">
                  {typeof result.projected_final_grade === "number" ? `${result.projected_final_grade}%` : "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200">
                <div className="px-4 py-2 border-b bg-gray-50 font-semibold">Original Category Scores</div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-1">Category</th>
                        <th className="py-1">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.original_category_scores && Object.entries(result.original_category_scores).map(([cat, val]: any) => (
                        <tr key={`orig-${cat}`} className="border-t">
                          <td className="py-1 pr-4 capitalize">{cat}</td>
                          <td className="py-1">{typeof val === "number" ? `${val}%` : val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-4 py-2 border-b bg-gray-50 font-semibold">Needed Future Averages</div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-1">Category</th>
                        <th className="py-1">Needed Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.needed_future_averages && Object.entries(result.needed_future_averages).map(([cat, val]: any) => (
                        <tr key={`need-${cat}`} className="border-t">
                          <td className="py-1 pr-4 capitalize">{cat}</td>
                          <td className="py-1">{typeof val === "number" ? `${val}%` : val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-4 py-2 border-b bg-gray-50 font-semibold">Projected Final Category Scores</div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-1">Category</th>
                        <th className="py-1">Projected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.projected_final_category_scores && Object.entries(result.projected_final_category_scores).map(([cat, val]: any) => (
                        <tr key={`proj-${cat}`} className="border-t">
                          <td className="py-1 pr-4 capitalize">{cat}</td>
                          <td className="py-1">{typeof val === "number" ? `${val}%` : val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200">
                <div className="px-4 py-2 border-b bg-gray-50 font-semibold">Task Breakdown</div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-1">Category</th>
                        <th className="py-1">Completed</th>
                        <th className="py-1">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.task_breakdown && Object.entries(result.task_breakdown).map(([cat, counts]: any) => (
                        <tr key={`task-${cat}`} className="border-t">
                          <td className="py-1 pr-4 capitalize">{cat}</td>
                          <td className="py-1">{counts?.completed ?? "—"}</td>
                          <td className="py-1">{counts?.remaining ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
