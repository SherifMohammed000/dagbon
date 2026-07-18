"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, LogIn, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type Suggestion = {
  id: number;
  author: string;
  email: string;
  text: string;
  date: string;
  status: "new" | "reviewed" | "actioned";
};

function saveSuggestion(s: Suggestion) {
  const raw = localStorage.getItem("dagbon_suggestions");
  const all: Suggestion[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem("dagbon_suggestions", JSON.stringify([s, ...all]));
}

export default function SuggestionsButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    saveSuggestion({
      id: Date.now(),
      author: user.name,
      email: user.email,
      text: text.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "new",
    });

    setDone(true);
    setTimeout(() => {
      setDone(false);
      setText("");
      setOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full bg-secondary text-white font-bold text-xs uppercase tracking-widest shadow-2xl shadow-secondary/30 hover:bg-primary transition-colors cursor-pointer"
        aria-label="Send a suggestion"
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Suggest</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 sm:right-8 z-50 w-full max-w-sm"
            >
              <div className="bg-white rounded-[32px] shadow-2xl border border-secondary/10 overflow-hidden">
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-white text-lg">Share a Suggestion</h3>
                    <p className="text-sand/50 text-[10px] uppercase tracking-widest font-bold mt-0.5">Help us improve Dagbon Heritage</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {!user ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto">
                        <LogIn size={24} />
                      </div>
                      <p className="text-earth/60 text-sm">You need to be signed in to send a suggestion.</p>
                      <Link
                        href="/auth"
                        onClick={() => setOpen(false)}
                        className="inline-block px-6 py-3 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                      >
                        Sign In
                      </Link>
                    </div>
                  ) : done ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-3"
                    >
                      <CheckCircle size={40} className="text-green-500 mx-auto" />
                      <p className="font-bold text-primary">Thank you!</p>
                      <p className="text-earth/50 text-sm">Your suggestion has been received.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-earth/50 block mb-2">
                          Your Suggestion
                        </label>
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value.slice(0, 500))}
                          placeholder="Share ideas, corrections, or content you'd like to see..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-sand/10 resize-none"
                        />
                        <p className="text-[10px] text-earth/30 text-right mt-1">{text.length}/500</p>
                      </div>

                      <button
                        type="submit"
                        disabled={!text.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-40 cursor-pointer"
                      >
                        <Send size={13} /> Submit Suggestion
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
