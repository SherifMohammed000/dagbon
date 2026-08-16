"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  FileText,
  Paperclip,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
  uploadFileToFirebase, 
  getFileURL, 
  savePostToFirebase, 
  deletePostFromFirebase, 
  subscribePostsFromFirebase 
} from "@/lib/firebase";
import { addNotification } from "@/lib/notifications";

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("History");
  const [newBody, setNewBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = subscribePostsFromFirebase((posts) => {
      setContentItems(posts);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: any, title?: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title || 'this post'}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await deletePostFromFirebase(id);
      addNotification(`Deleted article: "${title || 'Post'}"`, "action");
    } catch (e) {
      console.error("Delete post error", e);
    }
  };
  
  const [previewItem, setPreviewItem] = useState<{
    id?: any;
    title: string;
    category: string;
    body: string;
    date: string;
    fileUrl?: string;
    status?: string;
  } | null>(null);

  const resetForm = () => {
    setNewTitle("");
    setNewCategory("History");
    setNewBody("");
    setSelectedFile(null);
    setUploading(false);
    setShowCreateForm(false);
    setEditingId(null);
  };

  const handleSave = async (status: "Published" | "Draft" = "Published") => {
    if (!newTitle.trim()) {
      alert("Please enter a post title.");
      return;
    }
    
    setUploading(true);
    try {
      let fileUrl = "";
      if (selectedFile) {
        try {
          fileUrl = await uploadFileToFirebase(
            selectedFile, 
            `content/${Date.now()}_${selectedFile.name}`
          );
        } catch (err) {
          console.error("File upload failed:", err);
        }
      }
      
      const existingItem = editingId ? contentItems.find(i => String(i.id) === String(editingId)) : null;

      const postToSave = {
        id: editingId ? String(editingId) : String(Date.now()),
        title: newTitle,
        category: newCategory,
        body: newBody,
        status,
        author: "Admin",
        date: existingItem?.date || new Date().toISOString().split('T')[0],
        fileUrl: fileUrl || existingItem?.fileUrl || ""
      };

      await savePostToFirebase(postToSave);
      
      addNotification(
        editingId ? `Edited article: "${newTitle}"` : `Published article: "${newTitle}" (${status})`,
        "action"
      );
      resetForm();
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the post to Firebase.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Cultural Content</h1>
          <p className="text-earth/50">Create and manage historical articles, stories, and cultural posts.</p>
        </div>
        <button 
          onClick={() => {
            if (showCreateForm) {
              resetForm();
            } else {
              setShowCreateForm(true);
            }
          }} 
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-white font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-lg shadow-secondary/20 cursor-pointer"
        >
          <Plus size={18} /> {showCreateForm ? "Cancel" : "Create New Post"}
        </button>
      </div>

      {showCreateForm && (
        <div className="p-6 rounded-3xl bg-white border border-secondary/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg text-primary">{editingId ? "Edit Post" : "Create New Post"}</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Post Title</label>
            <input 
              type="text" 
              placeholder="Post title..." 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Post Category</label>
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
            >
              <option>History</option>
              <option>Royalty</option>
              <option>Music</option>
              <option>Fashion</option>
              <option>Food</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Content Body</label>
            <textarea
              placeholder="Write post content here..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Attach File (Images/Documents)</label>
            <input 
              type="file" 
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-primary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 file:cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={() => {
                if (!newTitle.trim()) {
                  alert("Please enter a title to preview.");
                  return;
                }
                setPreviewItem({
                  title: newTitle,
                  category: newCategory,
                  body: newBody,
                  date: new Date().toISOString().split('T')[0],
                  status: "Preview Draft",
                });
              }}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-secondary/20 text-secondary font-bold text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <Eye size={15} /> Preview Post
            </button>
            <button 
              type="button"
              onClick={() => handleSave("Draft")} 
              disabled={uploading}
              className="px-5 py-3 rounded-xl border border-earth/20 text-earth/80 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button 
              type="button"
              onClick={() => handleSave("Published")} 
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md shadow-secondary/20"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                editingId ? "Save Changes" : "Publish Now"
              )}
            </button>
            <button 
              type="button"
              onClick={resetForm} 
              disabled={uploading}
              className="px-5 py-3 rounded-xl border border-secondary/10 text-earth/50 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer disabled:opacity-50 ml-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-3xl bg-white border border-secondary/10 shadow-sm">
        <div className="flex items-center gap-4 bg-sand/30 px-4 py-2 rounded-xl flex-1 border border-secondary/5">
          <Search size={18} className="text-earth/30" />
          <input 
            type="text" 
            placeholder="Search titles, authors, categories..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary/10 text-earth/70 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all">
            <Filter size={14} /> Category
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary/10 text-earth/70 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all">
            Status
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] border border-secondary/10 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sand/20 border-b border-secondary/10">
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-earth/40">Title</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-earth/40">Category</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-earth/40">Status</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-earth/40">Date</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold text-earth/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/5">
            {contentItems.map((item) => (
              <tr key={item.id} className="hover:bg-sand/10 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-primary transition-all">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-primary text-sm block">{item.title}</span>
                      {(item as any).fileUrl && (
                        <button 
                          onClick={async () => {
                            const resolved = await getFileURL((item as any).fileUrl);
                            if (resolved) window.open(resolved, "_blank");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors font-bold mt-1 cursor-pointer"
                        >
                          <Paperclip size={12} /> View Attachment
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 rounded-full bg-sand text-earth/60 text-[10px] font-bold uppercase">{item.category}</span>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    item.status === "Published" ? "bg-green-100 text-green-700" :
                    item.status === "Draft" ? "bg-earth/10 text-earth/40" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-earth/40">{item.date}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setPreviewItem(item)} 
                      className="p-2 text-earth/40 hover:text-secondary transition-colors cursor-pointer"
                      title="Preview Post"
                    >
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.title)} className="p-2 text-earth/30 hover:text-red-500 transition-colors cursor-pointer" title="Delete Post"><Trash2 size={16} /></button>
                    <button className="p-2 text-earth/30 hover:text-primary transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Post Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto z-[101] w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-[36px] p-8 md:p-10 shadow-2xl border border-secondary/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-secondary/10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest">
                      {previewItem.category}
                    </span>
                    {previewItem.status && (
                      <span className="px-3 py-1 rounded-full bg-sand text-earth/60 text-[10px] font-bold uppercase tracking-widest">
                        {previewItem.status}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setPreviewItem(null)} 
                    className="text-earth/40 hover:text-primary text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Close [X]
                  </button>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-earth/40 tracking-widest block mb-1">
                    Live Preview (Website View)
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-primary mb-3 leading-snug">
                    {previewItem.title}
                  </h2>
                  <span className="text-[10px] text-earth/40 uppercase font-bold tracking-widest block mb-4">
                    Published on {previewItem.date} by Admin
                  </span>

                  <div className="p-6 rounded-2xl bg-sand/10 border border-secondary/10 text-earth/70 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {previewItem.body || <span className="italic text-earth/40">No content body written yet.</span>}
                  </div>

                  {selectedFile && (
                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10 text-xs text-secondary font-bold flex items-center gap-2">
                      <Paperclip size={14} /> Attached file: {selectedFile.name}
                    </div>
                  )}

                  {previewItem.fileUrl && !selectedFile && (
                    <button 
                      onClick={async () => {
                        const resolved = await getFileURL(previewItem.fileUrl!);
                        if (resolved) window.open(resolved, "_blank");
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer mt-2"
                    >
                      <Paperclip size={14} /> View Attached File
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-secondary/10 flex items-center justify-between">
                <span className="text-[10px] text-earth/40 uppercase font-bold tracking-widest">
                  Preview Mode
                </span>
                <div className="flex gap-3">
                  {showCreateForm && (
                    <button
                      onClick={() => {
                        setPreviewItem(null);
                        handleSave("Published");
                      }}
                      className="px-6 py-2.5 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer shadow-md"
                    >
                      Publish Now
                    </button>
                  )}
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="px-6 py-2.5 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer"
                  >
                    Back to Edit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { cn } from "@/lib/utils";
