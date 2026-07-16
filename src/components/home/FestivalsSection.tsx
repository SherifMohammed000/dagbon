"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import FestivalModal from './FestivalModal';

const festivals = [
  {
    name: "Damba Festival",
    date: "2026-09-15",
    location: "Yendi Palaces",
    description: "The most significant festival in Dagbon, celebrating the birth of Prophet Muhammad with horse riding and drumming.",
    color: "bg-secondary",
  },
  {
    name: "Bugum Festival",
    date: "2026-08-20",
    location: "All Dagbon Towns",
    description: "The Fire Festival, commemorating a historical search for a lost prince with torches and chanting.",
    color: "bg-earth",
  },
];

export default function FestivalsSection() {
  const [selectedFestival, setSelectedFestival] = useState<typeof festivals[0] | null>(null);

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

        <div className="grid md:grid-cols-2 gap-12">
          {festivals.map((festival, i) => (
            <FestivalCard key={i} festival={festival} index={i} onDiscoverMore={() => setSelectedFestival(festival)} />
          ))}
        </div>
      </div>
      <FestivalModal isOpen={selectedFestival !== null} onClose={() => setSelectedFestival(null)} festival={selectedFestival} />
    </section>
  );
}

function FestivalCard({ festival, index, onDiscoverMore }: { festival: typeof festivals[0]; index: number; onDiscoverMore: () => void }) {
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
        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-xl ${festival.color}`}>
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
