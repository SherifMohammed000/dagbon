"use client";

import { motion } from "framer-motion";
import { Maximize2, ExternalLink } from "lucide-react";
import Image from "next/image";

const galleryItems = [
  {
    title: "Voice of the Drums",
    category: "Music & Tradition",
    image: "/drummer.jpg",
    span: "col-span-1 row-span-2",
    desc: "A Lunsi drummer carries the stories of the kingdom in every beat.",
  },
  {
    title: "The Sacred Savannah",
    category: "Landscape",
    image: "/savannah-overlook.jpg",
    span: "md:col-span-2 md:row-span-1",
    desc: "The breathtaking landscape of Northern Ghana — the heartland of Dagbon.",
  },
  {
    title: "Shrines of the Ancestors",
    category: "Heritage",
    image: "/mud-hut.jpg",
    span: "col-span-1 row-span-1",
    desc: "Traditional Dagomba compound with animal skull talismans warding off evil spirits.",
  },
  {
    title: "Land of the Ya-Na",
    category: "Geography",
    image: "/savannah-aerial.jpg",
    span: "col-span-1 row-span-1",
    desc: "An aerial view of the fertile valleys and rivers that have sustained the Dagbon kingdom for centuries.",
  },
  {
    title: "Peaks of Dagbon",
    category: "Nature",
    image: "/savannah-overlook2.jpg",
    span: "md:col-span-2 md:row-span-1",
    desc: "Rocky outcrops overlooking the endless green expanse of the Dagbon savannah.",
  },
];

export default function CulturalGallery() {
  return (
    <section id="fashion" className="py-24 bg-[#fdfaf5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-secondary tracking-widest uppercase text-sm mb-4 block font-bold">Visual Heritage</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">A Glimpse into <br /> Dagbon Life</h2>
          </div>
          <button className="px-10 py-4 rounded-full border-2 border-primary/10 text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2 shadow-lg shadow-primary/5">
            View All Collections <ExternalLink size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:min-h-[900px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-[40px] bg-primary/5 shadow-2xl ${item.span}`}
            >
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
              
              {/* Overlay Content - always visible partially, full on hover */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="text-accent text-[10px] uppercase tracking-[0.25em] font-bold mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.category}</span>
                  <h3 className="text-white text-2xl font-serif mb-3 leading-tight drop-shadow-2xl">{item.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-xs">{item.desc}</p>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all shadow-xl">
                      <Maximize2 size={20} />
                    </button>
                    <button className="px-5 py-2 rounded-full bg-accent/20 backdrop-blur-xl border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
