"use client";

import { motion } from "framer-motion";
import { Shield, Crown, Landmark, History } from "lucide-react";

const royalFeatures = [
  {
    title: "The Skin System",
    description: "Unlike thrones, Dagbon royalty sit on skins (Gbaŋ), representing the connection to the land and ancestors.",
    icon: <Shield className="text-accent" />,
  },
  {
    title: "Succession History",
    description: "A complex and orderly system of rotation between the Karaga, Savelugu, and Mion gates.",
    icon: <History className="text-accent" />,
  },
  {
    title: "The Gbewaa Palace",
    description: "The spiritual and administrative heart of the kingdom located in Yendi.",
    icon: <Landmark className="text-accent" />,
  },
];

export default function RoyalHeritage() {
  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Decorative Royal Motif */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
        <Crown size={600} className="text-accent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent tracking-widest uppercase text-sm mb-4 block">Royal Excellence</span>
            <h2 className="text-4xl md:text-6xl font-serif">The Majesty of <br /> Dagbon Royalty</h2>
          </motion.div>
          <button className="px-8 py-3 rounded-full border border-accent/20 text-accent hover:bg-accent hover:text-primary transition-all flex items-center gap-2">
            Explore Royal Lineage
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {royalFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-sand/50 leading-relaxed mb-8">
                {feature.description}
              </p>
              <div className="h-1 w-12 bg-accent/30 group-hover:w-full transition-all" />
            </motion.div>
          ))}
        </div>

        {/* Featured King Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-12 rounded-[50px] bg-gradient-to-br from-secondary/20 to-primary border border-accent/10 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <span className="text-5xl font-serif text-accent opacity-20 block mb-6">“</span>
            <p className="text-2xl md:text-3xl font-serif text-sand leading-relaxed mb-8 italic">
              A people without knowledge of their past history, origin and culture is like a tree without roots.
            </p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-1 w-px bg-accent mb-4" />
              <span className="font-bold uppercase tracking-widest text-accent text-sm">Marcus Garvey (Adapted for Dagbon)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
