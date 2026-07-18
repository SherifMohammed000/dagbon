"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, LogIn, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type Comment = {
  id: number;
  postId: number;
  author: string;
  email: string;
  text: string;
  date: string;
};

function loadComments(): Comment[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("dagbon_comments");
    if (raw) { try { return JSON.parse(raw); } catch {} }
  }
  return [];
}

function saveComments(comments: Comment[]) {
  localStorage.setItem("dagbon_comments", JSON.stringify(comments));
}

export default function CommentBox({ postId }: { postId: number }) {
  const { user } = useAuth();
  const [allComments, setAllComments] = useState<Comment[]>(loadComments);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = () => setAllComments(loadComments());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const postComments = allComments.filter((c) => c.postId === postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const comment: Comment = {
      id: Date.now(),
      postId,
      author: user.name,
      email: user.email,
      text: text.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updated = [comment, ...allComments];
    setAllComments(updated);
    saveComments(updated);
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const handleDelete = (commentId: number) => {
    const updated = allComments.filter((c) => c.id !== commentId);
    setAllComments(updated);
    saveComments(updated);
  };

  return (
    <div className="mt-6 border-t border-secondary/10 pt-6 space-y-4">
      <div className="flex items-center gap-2 text-earth/60 text-xs font-bold uppercase tracking-widest mb-4">
        <MessageCircle size={14} />
        {postComments.length} Comment{postComments.length !== 1 ? "s" : ""}
      </div>

      {/* Comment input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-earth/50 font-bold">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-[10px]">
              {user.name[0].toUpperCase()}
            </div>
            Commenting as <span className="text-primary">{user.name}</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/30 focus:outline-none focus:ring-2 focus:ring-secondary/20 bg-sand/20 resize-none"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send size={12} />
              {submitted ? "Posted!" : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <Link
          href="/auth"
          className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors"
        >
          <LogIn size={14} /> Sign in to leave a comment
        </Link>
      )}

      {/* Comments list */}
      <AnimatePresence>
        {postComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 pt-4 border-t border-secondary/5"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs shrink-0">
              {comment.author[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-primary">{comment.author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-earth/40">{comment.date}</span>
                  {user && (user.isAdmin || user.email === comment.email) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-earth/20 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-earth/70 leading-relaxed">{comment.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {postComments.length === 0 && (
        <p className="text-xs text-earth/30 italic py-2">No comments yet. Be the first to share your thoughts.</p>
      )}
    </div>
  );
}
