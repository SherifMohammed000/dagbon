"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp, Calendar, Tag, MessageCircle, Paperclip } from "lucide-react";
import CommentBox from "@/components/comments/CommentBox";

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

const categoryColors: Record<string, string> = {
  History: "bg-amber-100 text-amber-700",
  Royalty: "bg-purple-100 text-purple-700",
  Music: "bg-green-100 text-green-700",
  Fashion: "bg-pink-100 text-pink-700",
  Food: "bg-orange-100 text-orange-700",
};

export default function PostsSection() {
  const [posts, setPosts] = useState<Post[]>(loadPosts);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setPosts(loadPosts());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
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
                          <a
                            href={post.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors mb-4"
                          >
                            <Paperclip size={13} /> View Attachment
                          </a>
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
