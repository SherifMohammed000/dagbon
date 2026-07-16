"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit,
  Plus,
  Music,
  Loader2
} from "lucide-react";
import { uploadFileToFirebase } from "@/lib/firebase";

// All images currently used across the site
const initialMedia = [
  { id: 1, type: "image", url: "/drummer.jpg", title: "Voice of the Drums", size: "2.4 MB", date: "2026-05-11" },
  { id: 2, type: "image", url: "/savannah-overlook.jpg", title: "The Sacred Savannah", size: "3.1 MB", date: "2026-05-11" },
  { id: 3, type: "image", url: "/mud-hut.jpg", title: "Shrines of the Ancestors", size: "1.8 MB", date: "2026-05-11" },
  { id: 4, type: "image", url: "/savannah-aerial.jpg", title: "Land of the Ya-Na", size: "4.2 MB", date: "2026-05-11" },
  { id: 5, type: "image", url: "/savannah-overlook2.jpg", title: "Peaks of Dagbon", size: "2.9 MB", date: "2026-05-11" },
  { id: 6, type: "image", url: "/damba.jpg", title: "Damba Festival", size: "1.5 MB", date: "2026-05-11" },
  { id: 7, type: "image", url: "/fashion.jpg", title: "Smock Weavers", size: "2.1 MB", date: "2026-05-11" },
  { id: 8, type: "image", url: "/food.jpg", title: "Tuo Zaafi", size: "1.9 MB", date: "2026-05-11" },
  { id: 9, type: "image", url: "/hero-bg.png", title: "Generated Hero Pattern", size: "850 KB", date: "2026-05-10" },
];

export default function AdminGallery() {
  const [mediaItems, setMediaItems] = useState(initialMedia);
  const [filter, setFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleUploadClick = () => {
    setIsUploading(!isUploading);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      const type = file.type.startsWith("image/") ? "image" 
                 : file.type.startsWith("video/") ? "video" 
                 : file.type.startsWith("audio/") ? "audio"
                 : "image";
      
      const fileUrl = await uploadFileToFirebase(
        file, 
        `gallery/${Date.now()}_${file.name}`
      );
      
      const newItem = {
        id: Date.now(),
        type,
        url: fileUrl,
        title: file.name.split(".")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split("T")[0]
      };
      
      setMediaItems(prev => [newItem, ...prev]);
      setIsUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Media Gallery</h1>
          <p className="text-earth/50">Manage images and videos across the Dagbon Heritage platform.</p>
        </div>
        <button 
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-all shadow-lg shadow-primary/20"
        >
          <Upload size={18} />
          Upload Media
        </button>
      </div>

      {/* Upload Area (Visible when uploading) */}
      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-8 rounded-3xl border-2 border-dashed border-secondary/30 bg-secondary/5 flex flex-col items-center justify-center text-center space-y-4 relative"
        >
          <input 
            type="file" 
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
            id="gallery-file-input"
            className="hidden"
            disabled={isUploadingFile}
          />
          
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
            {isUploadingFile ? <Loader2 className="animate-spin text-secondary" size={32} /> : <Plus size={32} />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">
              {isUploadingFile ? "Uploading File..." : "Upload files to storage"}
            </h3>
            <p className="text-sm text-earth/60">Supports Images, Videos, and Audio Music (Max 50MB)</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => document.getElementById('gallery-file-input')?.click()} 
              disabled={isUploadingFile}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary/20 rounded-lg text-sm font-medium hover:bg-sand/30 transition-colors text-primary cursor-pointer disabled:opacity-50"
            >
              <Upload size={16} className="text-accent" /> Select & Upload Media
            </button>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-secondary/10 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-sand text-primary" : "text-earth/60 hover:bg-sand/50"}`}
          >
            All Media
          </button>
          <button 
            onClick={() => setFilter("image")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === "image" ? "bg-sand text-primary" : "text-earth/60 hover:bg-sand/50"}`}
          >
            <ImageIcon size={16} /> Images
          </button>
          <button 
            onClick={() => setFilter("video")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === "video" ? "bg-sand text-primary" : "text-earth/60 hover:bg-sand/50"}`}
          >
            <Video size={16} /> Videos
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-sand/30 rounded-lg border border-secondary/5 flex-1 md:w-64">
            <Search size={16} className="text-earth/40" />
            <input 
              type="text" 
              placeholder="Search media..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full p-0"
            />
          </div>
          <button className="p-2 text-earth/50 hover:text-primary transition-colors border border-secondary/10 rounded-lg bg-white cursor-pointer">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems
          .filter(item => filter === "all" || item.type === filter)
          .map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group rounded-2xl border border-secondary/10 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-square bg-sand/20 overflow-hidden">
              {item.type === "image" ? (
                <Image 
                  src={item.url} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              ) : item.type === "video" ? (
                <div className="absolute inset-0 flex items-center justify-center text-earth/30 bg-primary/20">
                  <Video size={48} className="text-primary" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-accent/50 bg-primary/20">
                  <Music size={48} className="text-accent animate-pulse" />
                </div>
              )}
              
              {/* Type Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                {item.type === "image" ? <ImageIcon size={12} /> : item.type === "video" ? <Video size={12} /> : <Music size={12} />}
                {item.type}
              </div>

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => alert('Editing: ' + item.title)} className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors shadow-lg cursor-pointer">
                  <Edit size={18} />
                </button>
                <button onClick={() => setMediaItems(prev => prev.filter(m => m.id !== item.id))} className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-primary text-sm truncate pr-2">{item.title}</h3>
                <button className="text-earth/30 hover:text-primary cursor-pointer">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center text-xs text-earth/50">
                <span>{item.date}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
