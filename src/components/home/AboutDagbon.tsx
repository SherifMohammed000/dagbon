"use client";

import { motion } from "framer-motion";
import { History, Shield, Users, Landmark } from "lucide-react";
import Image from "next/image";

const timelineEvents = [
  {
    year: "14th Century",
    title: "Origins",
    description: "The Dagomba people migrated from the Lake Chad region, led by Tohazie (the Red Hunter).",
  },
  {
    year: "15th Century",
    title: "Kingdom Established",
    description: "Naa Gbewaa established the Kingdom at Pusiga, laying the foundation for Dagbon.",
  },
  {
    year: "17th Century",
    title: "Yendi Expansion",
    description: "The capital was moved to Yendi (Yani) as the kingdom expanded its influence across Northern Ghana.",
  },
  {
    year: "Modern Era",
    title: "The Ya-Na",
    description: "The King of Dagbon, the Ya-Na, continues to be a symbol of unity and cultural preservation.",
  },
];

export default function AboutDagbon() {
  return (
    <section id="history" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative side element */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-sand/5 skew-x-6 origin-top-right" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Left: Interactive Timeline */}
          <div>
            {/* Real aerial photo above timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-72 rounded-[40px] overflow-hidden shadow-2xl mb-12 group"
            >
              <Image src="/savannah-aerial.jpg" alt="Dagbon Aerial Landscape" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span className="text-accent text-[10px] uppercase tracking-widest font-bold block mb-1">Northern Ghana</span>
                <p className="text-white font-serif text-2xl">The Heartland of Dagbon</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <span className="text-secondary tracking-widest uppercase text-[10px] font-bold mb-4 block">The Great Migration</span>
              <h2 className="text-5xl md:text-8xl font-serif text-primary mb-8 leading-[0.9]">
                Legacy of the <br />
                <span className="text-secondary">Dagbon Skin</span>
              </h2>
              <p className="text-earth/60 text-xl leading-relaxed max-w-xl font-light">
                One of the oldest and most powerful kingdoms in West Africa, Dagbon is a land of rich history, 
                sophisticated governance, and enduring traditions.
              </p>
            </motion.div>

            <div className="space-y-12 relative">
              <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-secondary/10 to-transparent" />
              
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-24 group"
                >
                  <div className="absolute left-0 top-0 w-20 h-20 rounded-3xl bg-sand/30 flex items-center justify-center border border-secondary/10 z-10 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-xl shadow-secondary/5 group-hover:scale-110">
                    <History className="transition-transform group-hover:rotate-12" size={32} />
                  </div>
                  <div className="p-10 rounded-[40px] bg-[#fafafa] border border-secondary/5 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                    <span className="text-sm font-black text-secondary tracking-[0.3em] uppercase mb-4 block opacity-60">
                      {event.year}
                    </span>
                    <h3 className="text-2xl font-serif text-primary mb-3 group-hover:text-secondary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-earth/60 text-base leading-relaxed font-light">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Traditional Governance Info */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 md:p-20 rounded-[64px] bg-primary text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              {/* Real mud hut photo as background */}
              <div className="absolute inset-0 rounded-[64px] overflow-hidden">
                <Image src="/mud-hut.jpg" alt="Traditional Dagomba Compound" fill className="object-cover opacity-20" />
              </div>
              <div className="absolute inset-0 bg-primary/80 rounded-[64px]" />
              <Landmark className="text-accent mb-10" size={64} />
              <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">The Ancient <br /> Governance</h3>
              <p className="text-sand/60 text-lg mb-10 leading-relaxed font-light">
                The skin system is the foundation of Dagbon's hierarchy. From the Ya-Na in Yendi to 
                divisional chiefs and village heads, the system ensures order and continuity.
              </p>
              <ul className="space-y-6">
                {[
                  "The Ya-Na (Overlord of Dagbon)",
                  "Divisional Chiefs (The Kpamba)",
                  "The Council of Elders"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-6 text-sand/90 text-lg font-medium group cursor-default">
                    <div className="w-3 h-3 rounded-full bg-accent group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <button className="mt-16 px-10 py-5 rounded-full bg-accent text-primary font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl">
                Explore The Lineage
              </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[40px] border border-secondary/10 bg-sand/5 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                <Users className="text-secondary mb-6 group-hover:scale-110 transition-transform" size={48} />
                <h4 className="text-xl font-serif text-primary mb-3">Clans & Totems</h4>
                <p className="text-sm text-earth/50 leading-relaxed font-light">Unique identities and ancestral connections that define every Dagomba family.</p>
              </div>
              <div className="p-10 rounded-[40px] border border-secondary/10 bg-sand/5 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                <Landmark className="text-secondary mb-6 group-hover:scale-110 transition-transform" size={48} />
                <h4 className="text-xl font-serif text-primary mb-3">The Palaces</h4>
                <p className="text-sm text-earth/50 leading-relaxed font-light">Architectural marvels that serve as the administrative and spiritual hubs of our people.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
