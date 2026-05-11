"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "History", href: "#history" },
  { name: "Music", href: "#music" },
  { name: "Festivals", href: "#festivals" },
  { name: "Fashion", href: "#fashion" },
  { name: "Proverbs", href: "#proverbs" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "container mx-auto transition-all duration-500 rounded-full px-6 py-3 flex items-center justify-between",
          isScrolled 
            ? "glass-dark border border-white/10 shadow-2xl" 
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xl group-hover:rotate-12 transition-transform">
            D
          </div>
          <span className="font-serif text-xl tracking-tight text-white">
            Dagbon<span className="text-accent">Heritage</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-accent transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-white/70 hover:text-accent transition-colors">
            <Search size={20} />
          </button>
          <button className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-bold uppercase tracking-tighter hover:bg-white transition-colors">
            <Globe size={14} />
            Explore
          </button>
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 glass-dark border border-white/10 rounded-3xl p-8 md:hidden z-40"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-white hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              <button className="w-full py-4 rounded-xl bg-accent text-primary font-bold uppercase tracking-widest">
                Explore Kingdom
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
