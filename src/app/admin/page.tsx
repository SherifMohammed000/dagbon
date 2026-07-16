"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  Users, 
  Eye, 
  Music, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText
} from "lucide-react";

const stats = [
  { name: "Total Visitors", value: "12.4k", change: "+14%", icon: <Eye />, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Content Pieces", value: "156", change: "+5%", icon: <FileText />, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Music Plays", value: "4.2k", change: "+28%", icon: <Music />, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Active Users", value: "892", change: "-2%", icon: <Users />, color: "text-green-500", bg: "bg-green-50" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-primary mb-2">Dashboard Overview</h1>
        <p className="text-earth/50">Welcome back, Admin. Here's what's happening in Dagbon Heritage.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white border border-secondary/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
            <p className="text-xs text-earth/50 uppercase tracking-widest font-medium">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-white border border-secondary/10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif text-primary">Recent Cultural Content</h2>
            <button onClick={() => router.push('/admin/content')} className="text-accent text-xs font-bold uppercase tracking-widest hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-secondary/5 hover:bg-sand/10 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary text-sm group-hover:text-secondary transition-colors">The History of the Lunga Drum</h4>
                  <p className="text-[10px] text-earth/50 uppercase tracking-widest">Published 2 hours ago • Category: Music</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Live</span>
                  <button className="p-2 text-earth/30 hover:text-primary transition-colors">
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="p-8 rounded-[40px] bg-primary text-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Upcoming Festivals</h2>
            <Calendar size={20} className="text-accent" />
          </div>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-accent">
              <p className="text-[10px] text-accent uppercase tracking-widest mb-1">In 12 Days</p>
              <h4 className="font-bold mb-1">Damba Festival 2026</h4>
              <p className="text-xs text-sand/50">Location: Yendi Palace Grounds</p>
            </div>
            <div className="relative pl-6 border-l-2 border-white/20">
              <p className="text-[10px] text-sand/30 uppercase tracking-widest mb-1">In 45 Days</p>
              <h4 className="font-bold mb-1">Bugum (Fire) Festival</h4>
              <p className="text-xs text-sand/50">Location: All Northern Districts</p>
            </div>
          </div>
          <button onClick={() => setShowCalendarPopup(!showCalendarPopup)} className="w-full mt-12 py-4 rounded-2xl bg-accent text-primary font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer">
            Manage Calendar
          </button>
            {showCalendarPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-6 rounded-2xl bg-white/10 border border-accent/20 space-y-3"
              >
                <h4 className="text-accent text-xs font-bold uppercase tracking-widest">Quick Calendar Actions</h4>
                <button onClick={() => router.push('/admin/content')} className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all cursor-pointer">Add New Festival Event</button>
                <button className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all cursor-pointer" onClick={() => setShowCalendarPopup(false)}>Close Calendar</button>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
