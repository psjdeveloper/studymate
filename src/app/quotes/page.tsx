"use client";
import React, { useEffect, useState } from "react";

export default function Quotes() {
  const [quote, setQuote] = useState<string>("Loading your motivation...");

  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => setQuote(data.content))
      .catch((err) => {
        console.error("Failed to fetch quote", err);
        setQuote("Stay motivated and keep pushing forward!");
      });
  }, []);

  const fetchNewQuote = () => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => setQuote(data.content))
      .catch(() => setQuote("Keep your spirit high!"));
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-neutral-900 text-white p-6">
      <div className="max-w-xl text-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 transition hover:shadow-amber-400/20">
        <h1 className="text-3xl font-bold mb-6 text-amber-400">
          Motivational Quotes ✨
        </h1>
        <p className="text-lg italic text-gray-200 mb-6 transition-all duration-300">
          “{quote}”
        </p>
        <button
          onClick={fetchNewQuote}
          className="px-5 py-2 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 active:scale-95 transition-all"
        >
          New Quote
        </button>
      </div>
    </section>
  );
}
