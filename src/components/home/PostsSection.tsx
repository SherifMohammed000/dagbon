"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp, Calendar, MessageCircle, Paperclip } from "lucide-react";
import CommentBox from "@/components/comments/CommentBox";
import { getFileURL } from "@/lib/firebase";

type Post = {
  id: number;
  title: string;
  category: string;
  body: string;
  date: string;
  fileUrl?: string;
  author?: string;
  status?: string;
};

function loadPosts(): Post[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("dagbon_content");
    if (raw) { try { return JSON.parse(raw); } catch {} }
  }
  return [];
}

function commentCount(postId: number): number {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("dagbon_comments");
    if (raw) {
      try {
        const all = JSON.parse(raw);
        return all.filter((c: { postId: number }) => c.postId === postId).length;
      } catch {}
    }
  }
  return 0;
}

type Reactions = Record<string, string[]>; // { "❤️": ["user1@x.com", ...], ... }

function loadReactions(postId: number): Reactions {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(`dagbon_reactions_${postId}`);
    if (raw) { try { return JSON.parse(raw); } catch {} }
  }
  return {};
}

function saveReactions(postId: number, reactions: Reactions) {
  localStorage.setItem(`dagbon_reactions_${postId}`, JSON.stringify(reactions));
}

const REACTION_EMOJIS = ["❤️", "👏", "🔥", "👍", "💯"];

const categoryColors: Record<string, string> = {
  History: "bg-amber-100 text-amber-700",
  Royalty: "bg-purple-100 text-purple-700",
  Music: "bg-green-100 text-green-700",
  Fashion: "bg-pink-100 text-pink-700",
  Food: "bg-orange-100 text-orange-700",
};

function PostReactions({ postId }: { postId: number }) {
  const [reactions, setReactions] = useState<Reactions>(() => loadReactions(postId));
  const [showPicker, setShowPicker] = useState(false);

  // Create a simple anonymous user id per browser session
  const getUserId = () => {
    if (typeof window === "undefined") return "anon";
    let id = localStorage.getItem("dagbon_anon_id");
    if (!id) {
      id = "anon_" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("dagbon_anon_id", id);
    }
    return id;
  };

  const toggleReaction = (emoji: string) => {
    const userId = getUserId();
    const current = reactions[emoji] || [];
    let updated: Reactions;
    if (current.includes(userId)) {
      updated = { ...reactions, [emoji]: current.filter(u => u !== userId) };
    } else {
      updated = { ...reactions, [emoji]: [...current, userId] };
    }
    // Remove emoji key if empty
    if (updated[emoji]?.length === 0) delete updated[emoji];
    setReactions(updated);
    saveReactions(postId, updated);
  };

  const userId = typeof window !== "undefined" ? getUserId() : "anon";

  const activeReactions = Object.entries(reactions).filter(([, users]) => users.length > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap mt-4">
      {/* Existing reactions */}
      {activeReactions.map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => toggleReaction(emoji)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${
            users.includes(userId)
              ? "bg-secondary/10 border-secondary/30 shadow-sm"
              : "bg-sand/20 border-secondary/5 hover:bg-sand/40"
          }`}
        >
          <span className="text-base">{emoji}</span>
          <span className="text-[11px] font-bold text-earth/60">{users.length}</span>
        </button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-8 h-8 rounded-full bg-sand/20 border border-secondary/5 hover:bg-sand/40 flex items-center justify-center text-earth/40 hover:text-earth/70 transition-all cursor-pointer text-sm"
          title="Add reaction"
        >
          +
        </button>
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white rounded-2xl shadow-xl border border-secondary/10 p-2 z-20"
            >
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { toggleReaction(emoji); setShowPicker(false); }}
                  className="w-9 h-9 rounded-xl hover:bg-sand/40 flex items-center justify-center text-lg transition-all hover:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>(loadPosts);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setPosts(loadPosts());
    handler(); // Immediately load on client mount
    window.addEventListener("storage", handler);
    window.addEventListener("focus", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  if (posts.filter((p) => p.status !== "Draft").length === 0) return null;

  const published = posts.filter((p) => p.status !== "Draft");

  return (
    <section id="posts" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary tracking-widest uppercase text-[10px] font-bold mb-4 block">From the Archive</span>
          <h2 className="text-4xl md:text-6xl font-serif text-primary mb-6 leading-tight">
            Cultural <span className="text-secondary">Stories</span>
          </h2>
          <p className="text-earth/50 max-w-xl mx-auto">
            Explore articles and records published by the Dagbon Heritage team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {published.map((post, i) => {
            const isExpanded = expandedId === post.id;
            const count = commentCount(post.id);
            const color = categoryColors[post.category] ?? "bg-earth/10 text-earth/60";

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-[32px] border border-secondary/10 bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Card header — always visible */}
                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <FileText size={22} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${color}`}>
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-primary mb-3 leading-snug">{post.title}</h3>

                  <div className="flex items-center gap-4 text-[10px] text-earth/40 uppercase font-bold tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={10} />{post.date}</span>
                    <span className="flex items-center gap-1.5"><MessageCircle size={10} />{count} comment{count !== 1 ? "s" : ""}</span>
                  </div>

                  {/* Body preview */}
                  {post.body && (
                    <p className="text-earth/60 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.body}
                    </p>
                  )}

                  {/* Reactions */}
                  <PostReactions postId={post.id} />


                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    {isExpanded ? (
                      <><ChevronUp size={14} /> Collapse</>
                    ) : (
                      <><ChevronDown size={14} /> Read & Comment</>
                    )}
                  </button>
                </div>

                {/* Expanded area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden border-t border-secondary/10"
                    >
                      <div className="p-8 bg-sand/10">
                        {post.body && (
                          <p className="text-earth/70 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                            {post.body}
                          </p>
                        )}
                        {post.fileUrl && (
                          <button
                            onClick={async () => {
                              const resolved = await getFileURL(post.fileUrl!);
                              if (resolved) window.open(resolved, "_blank");
                            }}
                            className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors mb-4 cursor-pointer"
                          >
                            <Paperclip size={13} /> View Attachment
                          </button>
                        )}
                        <CommentBox postId={post.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
