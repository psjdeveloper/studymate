"use client";
import React, { useState, useEffect } from "react";

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch search results from DuckDuckGo
  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`)
      .then((res) => res.json())
      .then((data) => {
        // DuckDuckGo returns "RelatedTopics" for most search results
        setResults(data.RelatedTopics || []);
      })
      .catch((err) => console.error("Search failed:", err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-6 text-amber-400">Study Search 🔍</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the web..."
        className="w-full max-w-md p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
      />

      {loading && <p className="mt-4 text-gray-400">Searching...</p>}

      <div className="mt-6 w-full max-w-2xl space-y-3">
        {results.length > 0 ? (
          results.map((item: any, i) =>
            item.Text ? (
              <a
                key={i}
                href={item.FirstURL}
                target="_blank"
                className="block bg-white/10 p-4 rounded-xl hover:bg-white/20 transition border border-white/10"
              >
                <h2 className="font-semibold text-amber-300">{item.Text}</h2>
              </a>
            ) : null
          )
        ) : (
          !loading && <p className="text-gray-500 mt-6">No results yet. Try searching!</p>
        )}
      </div>
    </section>
  );
}
