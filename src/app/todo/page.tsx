"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Trash2, Plus } from "lucide-react";

type Priority = "low" | "medium" | "high";
type Task = { id: string; text: string; done: boolean; priority: Priority };

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<"all" | "done" | "active">("all");
  const [sortBy, setSortBy] = useState<"added" | "priority">("added");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [greetingName, setGreetingName] = useState("");

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tasks_v2");
      if (saved) setTasks(JSON.parse(saved));
      const name = localStorage.getItem("studymate_name");
      if (name) setGreetingName(name);
    } catch (e) {
      console.error("Failed to load saved tasks", e);
    }
  }, []);

  // Save tasks
  useEffect(() => {
    try {
      localStorage.setItem("tasks_v2", JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  }, [tasks]);

  // Save name
  useEffect(() => {
    try {
      localStorage.setItem("studymate_name", greetingName);
    } catch (e) {
      /* ignore */
    }
  }, [greetingName]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const t: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: newTask.trim(),
      done: false,
      priority: newPriority,
    };
    setTasks((p) => [...p, t]);
    setNewTask("");
  };

  const handleDeleteTask = (id: string) => setTasks((p) => p.filter((t) => t.id !== id));
  const toggleTaskDone = (id: string) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id: string, text: string, priority: Priority) => {
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, text, priority } : t)));
    setEditingId(null);
  };

  const filtered = tasks.filter((t) => (filter === "all" ? true : filter === "done" ? t.done : !t.done));
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "added") return 0; // keep insertion order
    const rank: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
    return rank[b.priority] - rank[a.priority];
  });

  const progress = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-wide">📝 To-Do</h2>
          <div className="text-sm text-gray-300">Progress: {progress}%</div>
        </div>

        {/* Greeting */}
        <div className="flex items-center gap-3">
          <span className="text-lg">Hello{greetingName ? `, ${greetingName}` : ""} 👋</span>
          <input
            aria-label="Your name"
            type="text"
            placeholder="Your name"
            value={greetingName}
            onChange={(e) => setGreetingName(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-md px-2 py-1 text-white text-sm"
          />
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <div className="flex-grow flex items-center gap-2">
            <input
              aria-label="New task"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add a new task..."
              className="flex-grow bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
            />

            <select aria-label="New task priority" value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)} className="bg-black/30 border border-white/10 text-white rounded-md px-2 py-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button aria-label="Add task" onClick={handleAddTask} className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
              <Plus size={16} /> Add
            </button>

            <select aria-label="Filter tasks" value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-black/30 border border-white/10 text-white rounded-md px-2 py-2">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
            </select>

            <select aria-label="Sort tasks" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-black/30 border border-white/10 text-white rounded-md px-2 py-2">
              <option value="added">Added</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <ul className="space-y-3 mt-4">
          <AnimatePresence>
            {sorted.map((task) => (
              <li key={task.id} className="list-none">
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={`flex justify-between items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 transition`}>
                  <div className="flex items-center gap-3 flex-1">
                    <button aria-label={`Toggle task ${task.text}`} title={`Toggle task ${task.text}`} onClick={() => toggleTaskDone(task.id)} className="p-1">
                      <CheckCircle size={18} className={`${task.done ? "text-green-400" : "text-gray-400"}`} />
                    </button>

                    {editingId === task.id ? (
                      <InlineEditor task={task} onSave={(text, priority) => saveEdit(task.id, text, priority)} onCancel={cancelEdit} />
                    ) : (
                      <div className={`flex items-center justify-between w-full ${task.done ? "opacity-60 line-through" : ""}`}>
                        <div>
                          <div className="text-sm">{task.text}</div>
                          <div className="text-xs text-gray-300">Priority: {task.priority}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button aria-label={`Edit ${task.text}`} title={`Edit ${task.text}`} onClick={() => startEdit(task.id)} className="text-amber-300 text-sm">Edit</button>
                          <button aria-label={`Delete ${task.text}`} title={`Delete ${task.text}`} onClick={() => handleDeleteTask(task.id)} className="text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.length === 0 && <p className="text-center text-gray-400 mt-4 text-sm">No tasks yet. Add one above ✨</p>}
      </div>
    </div>
  );
}

function InlineEditor({
  task,
  onSave,
  onCancel,
}: {
  task: Task;
  onSave: (text: string, priority: Priority) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState<Priority>(task.priority);

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <input aria-label="Edit task text" placeholder="Task" className="flex-grow bg-black/20 px-2 py-1 rounded-md text-white" value={text} onChange={(e) => setText(e.target.value)} />
      <select aria-label="Edit priority" className="bg-black/20 text-white rounded-md px-2 py-1" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="flex items-center gap-2">
        <button aria-label="Save edit" onClick={() => onSave(text, priority)} className="text-green-400 text-sm">Save</button>
        <button aria-label="Cancel edit" onClick={onCancel} className="text-gray-300 text-sm">Cancel</button>
      </div>
    </div>
  );
}
