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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showGreetings, setShowGreetings] = useState(false);
  const [expandedProverb, setExpandedProverb] = useState<number | null>(null);

  const filteredProverbs = proverbs.filter(p => {
    const matchesSearch = searchTerm === "" || 
      p.dagbani.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(proverbs.map(p => p.category))];

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

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
                <button
                  onClick={() => setShowGreetings(!showGreetings)}
                  className="w-full p-6 rounded-2xl bg-white border border-secondary/10 flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-secondary">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">Learn Basic Greetings</h4>
                    <p className="text-xs text-earth/50">&quot;Diga, Antire, Aniwula...&quot;</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <Volume2 size={18} />
                  </div>
                </button>

                {showGreetings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2"
                  >
                    {[
                      { dagbani: "Diga", english: "Good morning", phonetic: "dee-gah" },
                      { dagbani: "Antire", english: "Good afternoon", phonetic: "ahn-tee-reh" },
                      { dagbani: "Aniwula", english: "Good evening", phonetic: "ah-nee-woo-lah" },
                      { dagbani: "Naa", english: "Chief / King", phonetic: "nah" },
                      { dagbani: "A paɣa sima", english: "How are you?", phonetic: "ah pah-gah see-mah" },
                      { dagbani: "Naa", english: "Yes", phonetic: "nah" },
                    ].map((g, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-secondary/5 hover:shadow-md transition-all">
                        <div>
                          <strong className="text-primary text-sm">{g.dagbani}</strong>
                          <span className="text-earth/50 text-xs ml-2">/{g.phonetic}/</span>
                          <p className="text-xs text-earth/40 mt-0.5">{g.english}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); speakText(`${g.dagbani}. ${g.english}`); }}
                          className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all cursor-pointer"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Interactive Proverbs */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl bg-white border border-secondary/10 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 flex-1 w-full">
                <Search className="text-earth/30 shrink-0" size={20} />
                <input 
                  type="text" 
                  placeholder="Search proverbs or translations..." 
                  className="bg-transparent border-none focus:ring-0 flex-1 text-primary placeholder:text-earth/30 min-w-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar w-full md:w-auto">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    !activeCategory ? 'bg-secondary text-white' : 'bg-sand text-earth hover:bg-secondary/10'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      activeCategory === cat ? 'bg-secondary text-white' : 'bg-sand text-earth hover:bg-secondary/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {filteredProverbs.map((proverb, i) => (
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
                    <button
                      onClick={() => setExpandedProverb(expandedProverb === i ? null : i)}
                      className="px-6 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary hover:text-white transition-all cursor-pointer"
                    >
                      {expandedProverb === i ? 'Hide Details' : 'Translation Card'}
                    </button>
                    <button
                      onClick={() => speakText(`${proverb.dagbani}. Translation: ${proverb.english}. Meaning: ${proverb.meaning}`)}
                      className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all cursor-pointer"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  {expandedProverb === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-2"
                    >
                      <h5 className="text-xs font-bold text-accent uppercase tracking-widest">Word-by-Word Breakdown</h5>
                      <p className="text-sm text-earth/70 leading-relaxed"><strong>Dagbani:</strong> {proverb.dagbani}</p>
                      <p className="text-sm text-earth/70 leading-relaxed"><strong>Literal:</strong> {proverb.english}</p>
                      <p className="text-sm text-earth/70 leading-relaxed"><strong>Deeper Meaning:</strong> {proverb.meaning}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
