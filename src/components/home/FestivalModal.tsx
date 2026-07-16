"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Music, Users, Shirt } from "lucide-react";

interface FestivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  festival: {
    name: string;
    date: string;
    location: string;
    description: string;
    color: string;
  } | null;
}

const festivalDetails: Record<string, { schedule: { time: string; event: string }[]; customs: string[]; history: string }> = {
  "Damba Festival": {
    schedule: [
      { time: "Day 1 - Somo Damba", event: "Prayers, Quran recitation, and spiritual preparations at the palace." },
      { time: "Day 2 - Naa Damba", event: "The Ya-Na dances publicly. Chiefs parade on horseback with drums." },
      { time: "Day 3 - Belkulsi", event: "Final celebrations with communal feasting and gift exchanges." },
    ],
    customs: [
      "Wear traditional smocks (Fugu) — white or colorful batakari.",
      "Dance the Damba dance — a graceful, rhythmic movement.",
      "Present gifts to elders and the Ya-Na as a sign of respect.",
      "Do not point at the Ya-Na or turn your back to the royal skin.",
    ],
    history: "Damba celebrates the birth of Prophet Muhammad and has been observed in Dagbon for centuries. It is the most significant festival, combining Islamic heritage with indigenous Dagomba traditions. The festival reinforces the bond between the Ya-Na and his people.",
  },
  "Bugum Festival": {
    schedule: [
      { time: "Evening", event: "Torches are lit across all Dagbon towns simultaneously." },
      { time: "Night Procession", event: "Communities march through streets with flaming torches, chanting." },
      { time: "Gathering", event: "Elders retell the story of the lost prince and the search." },
    ],
    customs: [
      "Carry a lit torch made from dried grass bundles.",
      "Chant traditional fire songs passed down through generations.",
      "Children are kept close — the festival commemorates a lost child.",
      "Pour libation to ancestors before lighting the torch.",
    ],
    history: "The Bugum (Fire) Festival commemorates a historical event where a Dagomba chief lost his son and the entire community lit torches to search for him through the night. It symbolizes communal solidarity and the lengths to which the Dagomba go to protect their own.",
  },
};

export default function FestivalModal({ isOpen, onClose, festival }: FestivalModalProps) {
  if (!festival) return null;
  const details = festivalDetails[festival.name];
  if (!details) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[48px] overflow-hidden flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className={`p-8 flex items-center justify-between shrink-0 ${festival.color} text-white`}>
              <div>
                <h3 className="font-serif text-3xl">{festival.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-white/80 text-xs uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(festival.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {festival.location}</span>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
              {/* History */}
              <div>
                <h4 className="text-xl font-serif text-primary mb-4">Historical Context</h4>
                <p className="text-earth/70 leading-relaxed">{details.history}</p>
              </div>

              {/* Schedule */}
              <div>
                <h4 className="text-xl font-serif text-primary mb-4 flex items-center gap-2"><Music size={20} className="text-secondary" /> Festival Schedule</h4>
                <div className="space-y-4">
                  {details.schedule.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-sand/20 border border-secondary/10">
                      <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                      <div>
                        <strong className="text-primary text-sm block">{item.time}</strong>
                        <span className="text-earth/60 text-sm">{item.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customs */}
              <div>
                <h4 className="text-xl font-serif text-primary mb-4 flex items-center gap-2"><Shirt size={20} className="text-secondary" /> Cultural Guidelines</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {details.customs.map((custom, i) => (
                    <div key={i} className="flex gap-3 items-start p-4 rounded-xl border border-secondary/10 bg-white">
                      <Users size={16} className="text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-earth/70">{custom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
