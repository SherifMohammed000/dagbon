"use client";

import { motion } from "framer-motion";
import { Globe, Share2, ExternalLink, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function CulturalFooter() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/shattered.png')]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xl">
                D
              </div>
              <span className="font-serif text-2xl tracking-tight">
                Dagbon<span className="text-accent">Heritage</span>
              </span>
            </Link>
            <p className="text-sand/50 text-sm leading-relaxed">
              Dedicated to preserving and showcasing the rich cultural tapestry of the Dagomba people. A digital archive for history, music, and tradition.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Globe size={18} />} />
              <SocialIcon icon={<Share2 size={18} />} />
              <SocialIcon icon={<ExternalLink size={18} />} />
              <SocialIcon icon={<MessageCircle size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-8 text-accent">Explore</h4>
            <ul className="space-y-4 text-sand/70 text-sm">
              <li><Link href="/#history" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />History & Origins</Link></li>
              <li><Link href="/#music" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Traditional Music</Link></li>
              <li><Link href="/#festivals" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Festivals (Damba & Bugum)</Link></li>
              <li><Link href="/#fashion" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Cultural Gallery</Link></li>
              <li><Link href="/#proverbs" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Proverbs & Language</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif text-lg mb-8 text-accent">Resources</h4>
            <ul className="space-y-4 text-sand/70 text-sm">
              <li className="flex flex-col gap-2">
                <Link href="/auth" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-accent hover:text-primary transition-all inline-block font-bold text-center">
                  Join / Sign In
                </Link>
              </li>
              <li><Link href="/#proverbs" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Learn Dagbani</Link></li>
              <li><Link href="/#proverbs" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Proverbs & Wisdom</Link></li>
              <li><Link href="/#food" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Traditional Recipes</Link></li>
              <li><Link href="/#music" className="hover:text-accent transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />Sound of Dagbon</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-8 text-accent">Contact Us</h4>
            <ul className="space-y-4 text-sand/70 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>Tamale, Northern Region, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent" />
                <span>hello@dagbonheritage.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent" />
                <span>+233 (0) 24 000 0000</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 mb-12" />

        <div className="flex flex-col md:row justify-between items-center gap-6 text-xs text-sand/30 uppercase tracking-widest font-medium">
          <p>© 2026 Dagbon Heritage Digital Platform. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.2)" }}
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sand/70 hover:text-accent transition-all"
    >
      {icon}
    </motion.button>
  );
}
