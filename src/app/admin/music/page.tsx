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
  Upload,
  Loader2,
  Pause
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { uploadFileToFirebase } from "@/lib/firebase";

const getAudioDuration = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      URL.revokeObjectURL(url);
    });
    audio.addEventListener("error", () => {
      resolve("Unknown");
      URL.revokeObjectURL(url);
    });
  });
};

export default function MusicManagement() {
  const [musicItems, setMusicItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("dagbon_music");
    if (saved) {
      try {
        setMusicItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse music items", e);
      }
    }
  }, []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // New track form states
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newCategory, setNewCategory] = useState("Ceremonial");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Preview playing states
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim() || !audioFile) return;

    setUploading(true);
    try {
      const fileUrl = await uploadFileToFirebase(
        audioFile, 
        `music/${Date.now()}_${audioFile.name}`
      );
      
      const exactDuration = await getAudioDuration(audioFile);

      const newTrack = {
        id: Date.now(),
        title: newTitle,
        artist: newArtist,
        category: newCategory,
        plays: "0",
        duration: exactDuration,
        url: fileUrl // real uploaded URL
      };

      setMusicItems(prev => {
        const updated = [newTrack, ...prev];
        localStorage.setItem("dagbon_music", JSON.stringify(updated));
        return updated;
      });
      setNewTitle("");
      setNewArtist("");
      setNewCategory("Ceremonial");
      setAudioFile(null);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handlePlayPreview = (track: any) => {
    if (!track.url) {
      alert("No audio file available for preview.");
      return;
    }

    if (playingTrackId === track.id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play().catch(err => console.error("Playback error:", err));
        setPlayingTrackId(track.id);
      }
    }
  };

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

      {/* Hidden audio element for preview */}
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingTrackId(null)}
        className="hidden" 
      />

      {showAddForm && (
        <form onSubmit={handleAddTrack} className="p-6 rounded-3xl bg-white border border-secondary/10 shadow-lg space-y-4">
          <h3 className="font-serif text-lg text-primary">Add New Track</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Track Title</label>
            <input 
              type="text" 
              placeholder="e.g. Damba Dance Beat" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Artist / Drummers</label>
            <input 
              type="text" 
              placeholder="e.g. Savelugu Drummers" 
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Category</label>
            <select 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-secondary/10 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
            >
              <option>Ceremonial</option>
              <option>Festival</option>
              <option>Instrumental</option>
              <option>Fusion</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-earth/50">Audio File (Music/Drum Beats)</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              required
              className="w-full text-xs text-primary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 file:cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="submit"
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading audio...
                </>
              ) : (
                "Add Track"
              )}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setAudioFile(null);
                setNewTitle("");
                setNewArtist("");
              }} 
              disabled={uploading}
              className="px-6 py-3 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showBatchUpload && (
        <div className="p-8 rounded-3xl border-2 border-dashed border-secondary/30 bg-secondary/5 text-center space-y-4">
          <input 
            type="file" 
            accept="audio/*"
            multiple
            id="batch-audio-input"
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              alert(`Batch uploading ${files.length} audio files...`);
              
              const newTracks: { id: number; title: string; artist: string; category: string; plays: string; duration: string; url: string }[] = [];
              for (const file of files) {
                try {
                  const url = await uploadFileToFirebase(file, `music/${Date.now()}_${file.name}`);
                  const duration = await getAudioDuration(file);
                  newTracks.push({
                    id: Date.now() + Math.random(),
                    title: file.name.split(".")[0],
                    artist: "Various Artists",
                    category: "Fusion",
                    plays: "0",
                    duration,
                    url
                  });
                } catch (err) {
                  console.error("Failed to upload track during batch upload", err);
                }
              }
              
              setMusicItems(prev => {
                const updated = [...newTracks, ...prev];
                localStorage.setItem("dagbon_music", JSON.stringify(updated));
                return updated;
              });
              setShowBatchUpload(false);
            }}
          />
          <h3 className="text-lg font-bold text-primary">Batch Upload Audio</h3>
          <p className="text-sm text-earth/50">Select multiple audio files to batch upload into the music library.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('batch-audio-input')?.click()}
              className="px-6 py-3 rounded-xl bg-secondary text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all cursor-pointer"
            >
              Select files
            </button>
            <button onClick={() => setShowBatchUpload(false)} className="px-6 py-3 rounded-xl border border-secondary/10 text-earth/60 font-bold text-xs uppercase tracking-widest hover:bg-sand/30 transition-all cursor-pointer">Cancel</button>
          </div>
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
              <button 
                onClick={() => handlePlayPreview(track)} 
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sand/50 text-primary font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all cursor-pointer"
              >
                {playingTrackId === track.id ? (
                  <>
                    <Pause size={14} fill="currentColor" /> Pause
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" /> Preview
                  </>
                )}
              </button>
              <button onClick={() => alert('Editing: ' + track.title)} className="p-3 rounded-xl border border-secondary/10 text-earth/30 hover:text-primary transition-all cursor-pointer">
                <Edit2 size={18} />
              </button>
              <button onClick={() => {
                setMusicItems(prev => {
                  const updated = prev.filter(t => t.id !== track.id);
                  localStorage.setItem("dagbon_music", JSON.stringify(updated));
                  return updated;
                });
              }} className="p-3 rounded-xl border border-secondary/10 text-earth/30 hover:text-red-500 transition-all cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
