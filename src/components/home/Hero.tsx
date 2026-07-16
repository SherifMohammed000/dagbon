"use client";

import { motion } from "framer-motion";
import { ChevronRight, Play, Music, Calendar, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/savannah-overlook.jpg"
          alt="Dagbon Savannah Landscape"
          fill
          className="object-cover scale-105 animate-pulse-slow"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/40" />
      </div>

      {/* Floating Tribal Symbols (Decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0.1, 0.4, 0.1], 
              y: [-30, 30, -30],
              x: [0, 20, 0]
            }}
            transition={{ 
              duration: 10 + i, 
              repeat: Infinity, 
              delay: i * 2 
            }}
            className="absolute text-accent/10 text-7xl font-serif"
            style={{ 
              left: `${10 + i * 18}%`, 
              top: `${15 + (i % 3) * 30}%` 
            }}
          >
            ✧
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <span className="inline-block px-5 py-2 mb-8 text-[10px] font-bold tracking-[0.3em] text-accent uppercase glass-dark rounded-full border border-accent/30 shadow-2xl">
            The Heart of Northern Ghana
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-9xl font-serif text-white mb-8 leading-[0.9] drop-shadow-2xl">
            Discover the <br /> 
            <span className="text-gradient">Sacred Heritage</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-sand/70 mb-12 leading-relaxed font-light italic">
            "A kingdom of rhythm, a land of skin, a people of gold."
          </p>

          {/* CTA Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <CTAButton icon={<History size={24} />} label="Explore Culture" href="#fashion" />
            <CTAButton icon={<Music size={24} />} label="Traditional Music" href="#music" />
            <CTAButton icon={<Calendar size={24} />} label="View Festivals" href="#festivals" />
            <CTAButton icon={<Play size={24} />} label="Learn History" href="#history" />
          </div>
        </motion.div>
      </div>

      {/* Animated Waveform at bottom */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center gap-1.5 h-40 px-6 pointer-events-none opacity-20">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [20, 100, 40, 80, 20] }}
            transition={{ 
              duration: 2 + Math.random(), 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-1 bg-accent rounded-full"
          />
        ))}
      </div>
    </section>
  );
}

function CTAButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(212, 175, 55, 0.15)" }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 glass-dark border border-white/10 rounded-[32px] group transition-all duration-500 cursor-pointer h-full shadow-2xl hover:shadow-accent/5 hover:border-accent/30"
      >
        <div className="mb-4 text-accent group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 group-hover:text-white group-hover:tracking-[0.2em] transition-all duration-500 text-center">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}
