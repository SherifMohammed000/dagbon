"use client";

import { motion } from "framer-motion";
import { Play, SkipForward, SkipBack, Volume2, Music as MusicIcon, Disc, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const tracks = [
  {
    title: "The King's Arrival",
    artist: "Lunsi Drummers of Yendi",
    category: "Ceremonial",
    duration: "4:20",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Sample MP3
  },
  {
    title: "Damba Celebration",
    artist: "Northern Folk Ensemble",
    category: "Festival",
    duration: "3:45",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Sample MP3
  },
  {
    title: "Spirit of the Savannah",
    artist: "Modern Fusion Band",
    category: "Fusion",
    duration: "5:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // Sample MP3
  },
];

export default function MusicExperience() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <section id="music" className="py-24 relative overflow-hidden text-white">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].url} 
        onEnded={nextTrack}
      />

      {/* Real Photo Background */}
      <div className="absolute inset-0 z-0">
        <Image src="/drummer.jpg" alt="Dagbon Drummer" fill className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        <div className="absolute inset-0 bg-[#0a1a0f]/60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent tracking-widest uppercase text-sm mb-4 block">The Sound of Dagbon</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Experience the Rhythms</h2>
            <p className="text-sand/60 max-w-2xl mx-auto">
              From the talking drums (Lunga) to the ancestral chants, immerse yourself in the sonic landscape of Northern Ghana.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Track List */}
          <div className="lg:col-span-1 space-y-4">
            {tracks.map((track, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                onClick={() => {
                  setCurrentTrack(i);
                  setIsPlaying(true);
                }}
                className={`p-5 rounded-2xl cursor-pointer transition-all border shadow-lg ${
                  currentTrack === i 
                    ? "bg-accent/20 border-accent shadow-accent/10" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    currentTrack === i ? "bg-accent text-primary" : "bg-primary text-accent"
                  }`}>
                    {currentTrack === i && isPlaying ? <Disc className="animate-spin" /> : <MusicIcon />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm tracking-tight">{track.title}</h4>
                    <p className="text-xs text-sand/50">{track.artist}</p>
                  </div>
                  {currentTrack === i && isPlaying && (
                    <div className="flex gap-0.5 items-end h-4">
                      {[1, 2, 3].map(j => (
                        <motion.div 
                          key={j}
                          animate={{ height: [4, 16, 8, 12, 4] }}
                          transition={{ duration: 0.5 + j * 0.1, repeat: Infinity }}
                          className="w-0.5 bg-accent"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Player Visual */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-3xl p-8 md:p-12 rounded-[48px] border border-white/10 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                <motion.div 
                  key={currentTrack}
                  initial={{ scale: 0.9, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  className="w-64 h-64 rounded-3xl shadow-2xl relative overflow-hidden flex-shrink-0 group"
                >
                  <Image src="/drummer.jpg" alt="Dagbon Drummer" fill className="object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  {isPlaying && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border-2 border-dashed border-accent/40 rounded-full"
                    />
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                      {isPlaying && <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 240, ease: "linear", repeat: Infinity }} className="h-full bg-accent" />}
                    </div>
                  </div>
                </motion.div>

                <div className="flex-1 w-full text-center md:text-left">
                  <span className="text-accent text-xs uppercase tracking-widest mb-2 block font-bold">
                    {tracks[currentTrack].category}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-serif mb-2 leading-tight">{tracks[currentTrack].title}</h3>
                  <p className="text-xl text-sand/70 mb-10 font-light">{tracks[currentTrack].artist}</p>

                  {/* Waveform Mockup */}
                  <div className="flex items-end gap-1.5 h-20 mb-10 opacity-40">
                    {[...Array(40)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isPlaying ? [10, 60, 20, 70, 10] : [10, 15, 10] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                        className="flex-1 bg-gradient-to-t from-accent to-secondary rounded-full"
                      />
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center md:justify-start gap-10">
                    <button 
                      onClick={prevTrack}
                      className="text-white/40 hover:text-white transition-all hover:scale-110"
                    >
                      <SkipBack size={32} />
                    </button>
                    <button 
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-accent text-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent/20 ring-4 ring-accent/10"
                    >
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                    </button>
                    <button 
                      onClick={nextTrack}
                      className="text-white/40 hover:text-white transition-all hover:scale-110"
                    >
                      <SkipForward size={32} />
                    </button>
                    <div className="hidden md:flex items-center gap-6 text-white/40 ml-auto bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                      <Volume2 size={20} className="text-accent" />
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          className="h-full bg-accent shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
