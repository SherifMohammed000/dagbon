"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FestivalModal from './FestivalModal';

type Festival = { name: string; date: string; location: string; description: string; color: string };

const defaultFestivals: Festival[] = [
  {
    name: "Damba Festival",
    date: "December 12, 2026",
    location: "Yendi, Northern Region",
    description: "The most significant festival in Dagbon, marking the birth and naming of Prophet Muhammad. It features majestic equestrian displays, drumming, and dancing.",
    color: "bg-orange-500"
  },
  {
    name: "Bugum Chugu (Fire Festival)",
    date: "August 24, 2026",
    location: "Across Dagbon Kingdom",
    description: "A spectacular night festival marking the beginning of the lunar year. Locals carry flaming torches in a dramatic procession through the streets.",
    color: "bg-red-500"
  }
];

function loadFestivals(): Festival[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("dagbon_festivals");
    if (stored) {
      try { 
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch {}
    }
  }
  return defaultFestivals;
}

export default function FestivalsSection() {
  const [festivals, setFestivals] = useState<Festival[]>(loadFestivals);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Sync when admin saves changes in another tab
  useEffect(() => {
    const handler = () => setFestivals(loadFestivals());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <section id="festivals" className="py-24 bg-[#faf8f5] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <span className="text-secondary tracking-widest uppercase text-[10px] font-bold mb-4 block">Cultural Celebrations</span>
            <h2 className="text-4xl md:text-7xl font-serif text-primary mb-8 leading-tight">Sacred Times in <br /> <span className="text-secondary">The Kingdom</span></h2>
            <p className="text-earth/60 max-w-2xl mx-auto text-lg">
              Join us in celebrating the vibrant traditions of the Dagbon people. Mark your calendars for these historic events.
            </p>
          </motion.div>
        </div>

        {festivals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-earth/40"
          >
            <Calendar size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg">No festivals added yet. Add events from the admin panel.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {festivals.map((festival, i) => (
              <FestivalCard key={i} festival={festival} index={i} onDiscoverMore={() => setSelectedFestival(festival)} />
            ))}
          </div>
        )}
      </div>
      <FestivalModal isOpen={selectedFestival !== null} onClose={() => setSelectedFestival(null)} festival={selectedFestival} />
    </section>
  );
}

function FestivalCard({ festival, index, onDiscoverMore }: { festival: Festival; index: number; onDiscoverMore: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const target = new Date(festival.date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [festival.date]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -15 }}
      className="group relative rounded-[56px] overflow-hidden border border-secondary/5 bg-white p-8 md:p-14 flex flex-col xl:flex-row gap-12 items-center shadow-2xl hover:shadow-secondary/10 transition-all duration-700"
    >
      <div className="flex-1 space-y-8 relative z-10">
        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-xl ${festival.color || "bg-secondary"}`}>
          <Calendar size={16} />
          {new Date(festival.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <h3 className="text-4xl md:text-6xl font-serif text-primary group-hover:text-secondary transition-colors duration-500 leading-tight">
          {festival.name}
        </h3>

        <p className="text-earth/60 leading-relaxed text-lg font-light">
          {festival.description}
        </p>

        <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-earth/40 uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-secondary" />
            {festival.location}
          </div>
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-secondary" />
            Annual
          </div>
        </div>

        <button onClick={onDiscoverMore} className="flex items-center gap-4 text-secondary font-bold uppercase tracking-widest text-xs group-hover:gap-6 transition-all duration-500 group-hover:text-primary cursor-pointer">
          Discover More <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
        </button>
      </div>

      {/* Countdown Timer */}
      <div className="shrink-0 glass-dark p-10 rounded-[40px] text-white text-center w-56 border border-white/10 shadow-2xl relative overflow-hidden group-hover:bg-primary transition-colors duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="space-y-6 relative z-10">
          <div>
            <div className="text-5xl font-serif text-accent group-hover:scale-110 transition-transform">{timeLeft.days}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mt-2">Days Left</div>
          </div>
          <div className="h-px bg-white/10 w-full" />
          <div className="flex justify-between items-center px-2">
            <div>
              <div className="text-2xl font-serif">{timeLeft.hours}</div>
              <div className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Hrs</div>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div>
              <div className="text-2xl font-serif">{timeLeft.mins}</div>
              <div className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Mins</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
