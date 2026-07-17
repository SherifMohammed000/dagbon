"use client";

import { motion } from "framer-motion";
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
import { uploadFileToFirebase } from "@/lib/firebase";

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("History");
  const [newBody, setNewBody] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dagbon_content");
    if (saved) {
      try {
        setContentItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse content items", e);
      }
    }
  }, []);

  const handleDelete = (id: number) => {
    setContentItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("dagbon_content", JSON.stringify(updated));
      return updated;
    });
  };
  
  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    setUploading(true);
    let fileUrl = "";
    if (selectedFile) {
      fileUrl = await uploadFileToFirebase(
        selectedFile, 
        `content/${Date.now()}_${selectedFile.name}`
      );
    }
    
    const newItem = { 
      id: Date.now(), 
      title: newTitle, 
      category: newCategory, 
      status: "Published", 
      author: "Admin", 
      date: new Date().toISOString().split('T')[0],
      fileUrl,
      body: newBody
    };
    
    setContentItems(prev => {
      const updated = [newItem, ...prev];
      localStorage.setItem("dagbon_content", JSON.stringify(updated));
      return updated;
    });
    setNewTitle("");
    setNewCategory("History");
    setNewBody("");
    setSelectedFile(null);
    setUploading(false);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Cultural Content</h1>
          <p className="text-earth/50">Create and manage historical articles, stories, and cultural posts.</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-white font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-lg shadow-secondary/20 cursor-pointer">
          <Plus size={18} /> Create New Post
        </button>
      </div>

      {showCreateForm && (
        <div className="p-6 rounded-3xl bg-white border border-secondary/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg text-primary">Create New Post</h3>
          
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

          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleCreate} 
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                "Publish"
              )}
            </button>
            <button 
              onClick={() => {
                setShowCreateForm(false);
                setSelectedFile(null);
                setNewBody("");
                setNewTitle("");
              }} 
              disabled={uploading}
              className="px-6 py-3 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer disabled:opacity-50"
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
            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
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
                        <a 
                          href={(item as any).fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors font-bold mt-1"
                        >
                          <Paperclip size={12} /> View Attachment
                        </a>
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
                    <button onClick={() => alert('Preview: ' + item.title)} className="p-2 text-earth/30 hover:text-secondary transition-colors cursor-pointer"><Eye size={16} /></button>
                    <button onClick={() => alert('Editing: ' + item.title)} className="p-2 text-earth/30 hover:text-primary transition-colors cursor-pointer"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-earth/30 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                    <button className="p-2 text-earth/30 hover:text-primary transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
