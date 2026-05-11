"use client";

import { motion } from "framer-motion";
import { Volume2, BookOpen, Search, Filter } from "lucide-react";
import { useState } from "react";

const proverbs = [
  {
    dagbani: "A m-paya ka m-be Yani.",
    english: "You are with me but I am in Yani (Yendi).",
    meaning: "Physically present but mentally or emotionally distant.",
    category: "Wisdom",
  },
  {
    dagbani: "Baalim baalim ka baa m-gbaa doli.",
    english: "Slowly, slowly, the dog catches the deer.",
    meaning: "Patience and perseverance lead to success.",
    category: "Patience",
  },
  {
    dagbani: "Tihi m-be tihi nyaaŋa.",
    english: "There are trees behind trees.",
    meaning: "There is always someone more powerful or knowledgeable than you.",
    category: "Humility",
  },
];

export default function LanguageProverbs() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section id="proverbs" className="py-24 bg-sand/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left: Language Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary tracking-widest uppercase text-sm mb-4 block">Language & Wisdom</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8">Speak the Tongue <br /> of Dagbon</h2>
              <p className="text-earth/70 leading-relaxed mb-10">
                Dagbani is a vibrant Gur language spoken by millions. It is rich in proverbs, metaphors, and ancestral wisdom that define the Dagbon identity.
              </p>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-secondary/10 flex items-center gap-6 group hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-secondary">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Learn Basic Greetings</h4>
                    <p className="text-xs text-earth/50">"Diga, Antire, Aniwula..."</p>
                  </div>
                  <button className="ml-auto w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all">
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Interactive Proverbs */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-secondary/10 shadow-sm">
              <Search className="text-earth/30" size={20} />
              <input 
                type="text" 
                placeholder="Search proverbs or translations..." 
                className="bg-transparent border-none focus:ring-0 flex-1 text-primary placeholder:text-earth/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sand text-earth font-bold text-xs uppercase tracking-widest">
                <Filter size={14} /> Filter
              </button>
            </div>

            <div className="grid gap-6">
              {proverbs.map((proverb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-white border border-secondary/10 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BookOpen size={100} />
                  </div>
                  <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold mb-4 block">
                    {proverb.category}
                  </span>
                  <h3 className="text-2xl font-serif text-primary mb-4 italic">
                    "{proverb.dagbani}"
                  </h3>
                  <div className="h-px w-12 bg-secondary/20 mb-4" />
                  <p className="text-earth/80 font-medium mb-2">{proverb.english}</p>
                  <p className="text-sm text-earth/50 italic">{proverb.meaning}</p>
                  
                  <div className="mt-6 flex gap-4">
                    <button className="px-6 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary hover:text-white transition-all">
                      Translation Card
                    </button>
                    <button className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all">
                      <Volume2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
