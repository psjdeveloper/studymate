"use client";
import React from "react";

export default function Flashcard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="bg-gray-950 text-center hover:text-amber-400 shadow-2xl rounded-2xl p-10 border border-gray-700 hover:border-amber-400 transition-all duration-300 w-80">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Flashcard</h1>
        <p className="text-gray-400 italic animate-pulse">Coming soon...</p>
      </div>
    </div>
  );
}
