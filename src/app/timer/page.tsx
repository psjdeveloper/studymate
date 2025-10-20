"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, Briefcase } from "lucide-react";

type Mode = "focus" | "shortBreak" | "longBreak";

export default function PomodoroPro() {
  const DURATIONS: Record<Mode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState<number>(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Handle timer end
  useEffect(() => {
    if (timeLeft === 0) {
      new Audio("/notification.mp3").play().catch(() => {});
      setIsRunning(false);

      if (mode === "focus") {
        setSessionCount((c) => c + 1);
        if ((sessionCount + 1) % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("focus");
      }
    }
  }, [timeLeft]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(DURATIONS[mode]);
    setIsRunning(false);
  };

  const progress = ((DURATIONS[mode] - timeLeft) / DURATIONS[mode]) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-neutral-900 text-white">
      <div className="w-[350px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          {mode === "focus" && "Focus Session"}
          {mode === "shortBreak" && "Short Break ☕"}
          {mode === "longBreak" && "Long Break 🌿"}
        </h1>

        <div className="text-6xl font-mono">{formatTime(timeLeft)}</div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? "Pause" : "Start"}
          </button>

          <button
            onClick={handleReset}
            className="border border-white px-4 py-2 rounded-xl hover:bg-white/20 transition flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => switchMode("focus")}
            className={`px-3 py-1 rounded-md border ${
              mode === "focus" ? "bg-white text-black" : "border-white/30"
            }`}
          >
            <Briefcase size={16} className="inline mr-1" /> Focus
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`px-3 py-1 rounded-md border ${
              mode === "shortBreak" ? "bg-white text-black" : "border-white/30"
            }`}
          >
            <Coffee size={16} className="inline mr-1" /> Short
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`px-3 py-1 rounded-md border ${
              mode === "longBreak" ? "bg-white text-black" : "border-white/30"
            }`}
          >
            🌿 Long
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Completed sessions: {sessionCount}
        </p>
      </div>
    </div>
  );
}
