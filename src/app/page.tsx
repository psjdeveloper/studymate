"use client";
import React from "react";
import Link from "next/link";
import { ListTodo, Timer, BookOpen, Brain, Search, Home as HomeIcon } from "lucide-react";

export default function Home() {
  const features = [
    { title: "To-Do List", href: "/todo", icon: <ListTodo size={28} /> },
    { title: "Pomodoro Timer", href: "/timer", icon: <Timer size={28} /> },
    { title: "Motivation Quotes", href: "/quotes", icon: <Brain size={28} /> },
    { title: "Flashcards", href: "/flashcards", icon: <BookOpen size={28} /> },
    { title: "Study Search", href: "/search", icon: <Search size={28} /> },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-neutral-900 text-white p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">
          Welcome to <span className="text-amber-400">StudyMate</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Your all-in-one student productivity hub 🚀
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group relative flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg p-6 hover:bg-white/20 transition duration-300 hover:scale-105"
          >
            <div className="mb-3 text-amber-400 group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h2 className="text-xl font-semibold mb-1">{f.title}</h2>
            <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to open
            </p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm flex items-center gap-2">
        <HomeIcon size={14} /> Made with ❤️ by Students, for Students
      </footer>
    </section>
  );
}
