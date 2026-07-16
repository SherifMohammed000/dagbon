"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Globe, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "History", href: "#history" },
  { name: "Music", href: "#music" },
  { name: "Festivals", href: "#festivals" },
  { name: "Fashion", href: "#fashion" },
  { name: "Proverbs", href: "#proverbs" },
  { name: "Culinary", href: "#food" },
  { name: "Royalty", href: "#heritage" },
];

const searchIndex = [
  { title: "Tohazie (Red Hunter) Migration", type: "History", targetId: "history" },
  { title: "Naa Gbewaa & Origins", type: "History", targetId: "history" },
  { title: "Yendi Capital Expansion", type: "History", targetId: "history" },
  { title: "Traditional Music & Lunsi Drummers", type: "Music", targetId: "music" },
  { title: "Damba Festival Celebrations", type: "Festivals", targetId: "festivals" },
  { title: "Bugum (Fire) Festival Search", type: "Festivals", targetId: "festivals" },
  { title: "Language Proverbs & Wisdom", type: "Proverbs", targetId: "proverbs" },
  { title: "Traditional Smocks & Smock Weavers", type: "Fashion", targetId: "fashion" },
  { title: "Tuo Zaafi (TZ) & Ayoyo Soup", type: "Food", targetId: "food" },
  { title: "Dawadawa Seasoning & Spices", type: "Food", targetId: "food" },
  { title: "Pito Millet Beer & Local Drinks", type: "Food", targetId: "food" },
  { title: "The Royal Skin System (Gbaŋ)", type: "Royalty", targetId: "heritage" },
  { title: "Gbewaa Palace & Succession Gates", type: "Royalty", targetId: "heritage" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const session = localStorage.getItem("dagbon_auth");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error(e);
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (targetId: string) => {
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setIsSearchOpen(false);
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredSearchResults = searchQuery.trim() === ""
    ? []
    : searchIndex.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href.replace("#", ""))}
              className="text-sm font-medium text-white/70 hover:text-accent transition-colors uppercase tracking-widest cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-white/70 hover:text-accent transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>
          
          {user ? (
            <Link 
              href={user.isAdmin ? "/admin" : "/auth"}
              className="hidden md:inline-block text-xs font-bold uppercase tracking-widest text-accent hover:text-white transition-colors"
            >
              {user.isAdmin ? "Dashboard" : user.name.split(" ")[0]}
            </Link>
          ) : (
            <Link 
              href="/auth" 
              className="hidden md:inline-block text-xs font-bold uppercase tracking-widest text-white/70 hover:text-accent transition-colors"
            >
              Sign In
            </Link>
          )}

          <button 
            onClick={() => setIsExploreOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-bold uppercase tracking-tighter hover:bg-white transition-colors cursor-pointer"
          >
            <Globe size={14} />
            Explore
          </button>
          
          <button 
            className="md:hidden p-2 text-white cursor-pointer"
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
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href.replace("#", ""))}
                  className="text-2xl font-serif text-white hover:text-accent transition-colors text-left cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <hr className="border-white/10" />
              
              {user ? (
                <Link
                  href={user.isAdmin ? "/admin" : "/auth"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-4 rounded-xl border border-accent/20 text-accent font-bold uppercase tracking-widest block text-sm"
                >
                  {user.isAdmin ? "Admin Dashboard" : `Hello, ${user.name}`}
                </Link>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-4 rounded-xl border border-accent/20 text-accent font-bold uppercase tracking-widest block text-sm"
                >
                  Sign In / Register
                </Link>
              )}

              <button 
                onClick={() => handleLinkClick("history")}
                className="w-full py-4 rounded-xl bg-accent text-primary font-bold uppercase tracking-widest cursor-pointer"
              >
                Explore Kingdom
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl glass-dark border border-white/10 rounded-[40px] p-8 md:p-12 relative shadow-2xl"
            >
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute top-8 right-8 text-white/50 hover:text-white cursor-pointer"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-serif text-white mb-6">Search Dagbon Archive</h3>
              
              <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 border border-white/10 mb-6">
                <Search size={22} className="text-accent" />
                <input
                  type="text"
                  placeholder="Search history, music, recipes, gates..."
                  className="bg-transparent border-none focus:ring-0 text-white text-lg flex-1 outline-none w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Search Results */}
              <div className="max-h-[300px] overflow-y-auto space-y-3 custom-scrollbar">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLinkClick(result.targetId)}
                      className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all border border-white/0 hover:border-white/5 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-accent transition-colors">{result.title}</h4>
                        <span className="text-[10px] uppercase font-bold text-sand/40 tracking-wider">{result.type}</span>
                      </div>
                      <ChevronRight size={16} className="text-sand/30 group-hover:text-accent transition-all transform group-hover:translate-x-1" />
                    </button>
                  ))
                ) : searchQuery.trim() !== "" ? (
                  <p className="text-sand/50 text-sm italic text-center py-6">No results found for "{searchQuery}"</p>
                ) : (
                  <div className="text-sand/40 text-xs uppercase tracking-widest text-center py-6 font-semibold">
                    Type to search the history, food, music, and lineage
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explore Side Drawer */}
      <AnimatePresence>
        {isExploreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExploreOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[90]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-[#0d0f0e] border-l border-white/10 z-[100] p-8 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="font-serif text-2xl text-white">Explore Kingdom</h3>
                  <button 
                    onClick={() => setIsExploreOpen(false)}
                    className="text-white/50 hover:text-white cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleLinkClick(link.href.replace("#", ""))}
                      className="text-left text-xl font-serif text-sand/80 hover:text-accent transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      {link.name}
                      <span className="text-xs font-sans uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                        Jump →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent/60 block mb-2">Preserving the past</span>
                <p className="text-[11px] text-white/40 leading-relaxed font-light">Dagbon Heritage Digital Platform © 2026</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
