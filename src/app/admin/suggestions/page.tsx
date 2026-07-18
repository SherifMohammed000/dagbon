"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, CheckCircle, Clock, Zap, Trash2 } from "lucide-react";

type Suggestion = {
  id: number;
  author: string;
  email: string;
  text: string;
  date: string;
  status: "new" | "reviewed" | "actioned";
};

function load(): Suggestion[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("dagbon_suggestions");
    if (raw) { try { return JSON.parse(raw); } catch {} }
  }
  return [];
}

function save(suggestions: Suggestion[]) {
  localStorage.setItem("dagbon_suggestions", JSON.stringify(suggestions));
}

const statusMeta = {
  new:      { label: "New",      color: "bg-blue-100 text-blue-700",   icon: <Clock size={12} /> },
  reviewed: { label: "Reviewed", color: "bg-amber-100 text-amber-700", icon: <CheckCircle size={12} /> },
  actioned: { label: "Actioned", color: "bg-green-100 text-green-700", icon: <Zap size={12} /> },
};

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(load);

  useEffect(() => {
    const handler = () => setSuggestions(load());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateStatus = (id: number, status: Suggestion["status"]) => {
    const updated = suggestions.map((s) => (s.id === id ? { ...s, status } : s));
    setSuggestions(updated);
    save(updated);
  };

  const deleteSuggestion = (id: number) => {
    const updated = suggestions.filter((s) => s.id !== id);
    setSuggestions(updated);
    save(updated);
  };

  const counts = {
    new: suggestions.filter((s) => s.status === "new").length,
    reviewed: suggestions.filter((s) => s.status === "reviewed").length,
    actioned: suggestions.filter((s) => s.status === "actioned").length,
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">User Suggestions</h1>
          <p className="text-earth/50">Ideas and feedback submitted by registered users.</p>
        </div>
        <div className="flex gap-4">
          {(["new", "reviewed", "actioned"] as const).map((s) => (
            <div key={s} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${statusMeta[s].color}`}>
              {statusMeta[s].icon} {counts[s]} {statusMeta[s].label}
            </div>
          ))}
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-24 text-earth/30 space-y-4">
          <MessageSquarePlus size={48} className="mx-auto opacity-30" />
          <p className="text-lg font-serif">No suggestions yet</p>
          <p className="text-sm">Users can submit suggestions from the homepage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s, i) => {
            const meta = statusMeta[s.status];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-[28px] bg-white border border-secondary/10 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
                      {s.author[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm">{s.author}</p>
                      <p className="text-[10px] text-earth/40">{s.email} · {s.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </span>
                    <button
                      onClick={() => deleteSuggestion(s.id)}
                      className="p-2 text-earth/20 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-earth/70 text-sm leading-relaxed mb-4 pl-12">{s.text}</p>

                {/* Status actions */}
                <div className="flex gap-2 pl-12">
                  {(["new", "reviewed", "actioned"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(s.id, status)}
                      disabled={s.status === status}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        s.status === status
                          ? `${statusMeta[status].color} opacity-100 ring-2 ring-current ring-offset-1`
                          : "bg-sand/40 text-earth/40 hover:bg-sand"
                      }`}
                    >
                      {statusMeta[status].label}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
