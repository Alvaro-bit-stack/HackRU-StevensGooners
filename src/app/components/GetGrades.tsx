"use client";

import { useState } from "react";

export default function GetGrades() {
  const [inputText, setInputText] = useState("");
  const [canvasToken, setCanvasToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate grade input
    const validGrades = ["A", "B", "C", "D", "F"];
    if (!validGrades.includes(inputText.toUpperCase())) {
      alert("Invalid grade! Please enter only A, B, C, D, or F.");
      return;
    }

    alert(`You submitted: ${inputText.toUpperCase()}\nCanvas Token: ${canvasToken}`);
  };

  return (
    <section className="flex flex-col items-center justify-center my-16 mx-auto max-w-xl p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Get Grades Needed to Score Some x Grade Letter 
      </h2>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Main input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Letter Grade you want to achieve (A-F)"
          className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
