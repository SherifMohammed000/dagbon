"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Music, 
  Play, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Disc,
  Upload
} from "lucide-react";
import { useState } from "react";

const mockMusic = [
  { id: 1, title: "The King's Arrival", artist: "Lunsi Drummers", category: "Ceremonial", plays: "1,240", duration: "4:20" },
  { id: 2, title: "Damba Celebration", artist: "Northern Folk", category: "Festival", plays: "850", duration: "3:45" },
  { id: 3, title: "Savannah Winds", artist: "Xylophone Master", category: "Instrumental", plays: "2,100", duration: "5:12" },
];

export default function MusicManagement() {
  const [musicItems, setMusicItems] = useState(mockMusic);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Music Library</h1>
          <p className="text-earth/50">Manage traditional songs, drum rhythms, and modern fusion tracks.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowBatchUpload(!showBatchUpload)} className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-secondary/10 text-primary font-bold uppercase tracking-widest text-xs hover:bg-sand/30 transition-all cursor-pointer">
            <Upload size={18} /> Batch Upload
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-lg cursor-pointer">
            <Plus size={18} /> Add New Track
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="p-6 rounded-3xl bg-white border border-secondary/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg text-primary">Add New Track</h3>
          <p className="text-sm text-earth/50">Track upload form would appear here. This is a demo placeholder.</p>
          <button onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer">Close</button>
        </div>
      )}
      {showBatchUpload && (
        <div className="p-8 rounded-3xl border-2 border-dashed border-secondary/30 bg-secondary/5 text-center space-y-3">
          <h3 className="text-lg font-bold text-primary">Batch Upload Zone</h3>
          <p className="text-sm text-earth/50">Drag and drop multiple audio files here, or click to browse.</p>
          <button onClick={() => setShowBatchUpload(false)} className="px-6 py-3 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer">Close</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {musicItems.map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-white border border-secondary/10 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                <Music size={32} />
              </div>
              <button className="p-2 text-earth/20 hover:text-primary transition-colors cursor-pointer">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-primary mb-1">{track.title}</h3>
            <p className="text-sm text-earth/50 mb-6">{track.artist}</p>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sand text-earth/60 text-[10px] font-bold uppercase">
                <Disc size={12} /> {track.category}
              </div>
              <span className="text-[10px] text-earth/30 uppercase font-bold">{track.duration}</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => alert('Playing preview: ' + track.title)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sand/50 text-primary font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all cursor-pointer">
                <Play size={14} fill="currentColor" /> Preview
              </button>
              <button onClick={() => alert('Editing: ' + track.title)} className="p-3 rounded-xl border border-secondary/10 text-earth/30 hover:text-primary transition-all cursor-pointer">
                <Edit2 size={18} />
              </button>
              <button onClick={() => setMusicItems(prev => prev.filter(t => t.id !== track.id))} className="p-3 rounded-xl border border-secondary/10 text-earth/30 hover:text-red-500 transition-all cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
