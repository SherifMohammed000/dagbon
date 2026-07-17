"use client";

import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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

export default function AdminDashboard() {
  const router = useRouter();
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [counts, setCounts] = useState({
    content: 0,
    music: 0,
    gallery: 0,
    festivals: 0
  });
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([]);

  useEffect(() => {
    try {
      // 1. Content
      const savedContent = localStorage.getItem("dagbon_content");
      const content = savedContent ? JSON.parse(savedContent) : [];
      
      // 2. Music
      const savedMusic = localStorage.getItem("dagbon_music");
      const music = savedMusic ? JSON.parse(savedMusic) : [];

      // 3. Gallery
      const savedGallery = localStorage.getItem("dagbon_gallery");
      const gallery = savedGallery ? JSON.parse(savedGallery) : [];

      // 4. Festivals
      const savedFestivals = localStorage.getItem("dagbon_festivals");
      const festivals = savedFestivals ? JSON.parse(savedFestivals) : [];

      setCounts({
        content: content.length,
        music: music.length,
        gallery: gallery.length,
        festivals: festivals.length
      });

      setRecentContent(content.slice(0, 3));

      // Filter upcoming festivals: date is in the future or today, sorted ascending by date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcoming = festivals
        .filter((f: any) => new Date(f.date) >= today)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 2);

      setUpcomingFestivals(upcoming);
    } catch (e) {
      console.error("Failed to load dashboard statistics", e);
    }
  }, []);

  const getDaysRemainingString = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Past Event";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} Days`;
  };

  const stats = [
    { name: "Total Visitors", value: "12.4k", change: "+14%", icon: <Eye />, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Content Pieces", value: counts.content.toString(), change: counts.content > 0 ? "+100%" : "0%", icon: <FileText />, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Music Tracks", value: counts.music.toString(), change: counts.music > 0 ? "+100%" : "0%", icon: <Music />, color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Active Users", value: "892", change: "-2%", icon: <Users />, color: "text-green-500", bg: "bg-green-50" },
  ];

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
            {recentContent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={40} className="text-earth/20 mb-4 animate-pulse" />
                <p className="text-sm font-bold text-primary mb-1">No Cultural Content Yet</p>
                <p className="text-xs text-earth/50 max-w-xs mb-4">Create historical articles, stories, or cultural posts to see them here.</p>
                <button onClick={() => router.push('/admin/content')} className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Create Post
                </button>
              </div>
            ) : (
              recentContent.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-secondary/5 hover:bg-sand/10 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-sm group-hover:text-secondary transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-earth/50 uppercase tracking-widest">Published {item.date} • Category: {item.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">{item.status}</span>
                    <button className="p-2 text-earth/30 hover:text-primary transition-colors">
                      <TrendingUp size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="p-8 rounded-[40px] bg-primary text-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Upcoming Festivals</h2>
            <Calendar size={20} className="text-accent" />
          </div>
          <div className="space-y-6">
            {upcomingFestivals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-white/5 rounded-2xl border border-white/10 p-6">
                <Calendar size={32} className="text-accent/40 mb-3 animate-pulse" />
                <p className="text-sm font-bold text-white mb-1">No Upcoming Festivals</p>
                <p className="text-xs text-sand/50 max-w-xs mb-4">Schedule new festivals to begin tracking countdowns on the dashboard.</p>
                <button onClick={() => router.push('/admin/festivals')} className="px-4 py-2 bg-accent text-primary text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white transition-all cursor-pointer">
                  Schedule Event
                </button>
              </div>
            ) : (
              upcomingFestivals.map((item, index) => (
                <div key={item.id} className={`relative pl-6 border-l-2 ${index === 0 ? 'border-accent' : 'border-white/20'}`}>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${index === 0 ? 'text-accent' : 'text-sand/30'}`}>
                    {getDaysRemainingString(item.date)}
                  </p>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-xs text-sand/50">Location: {item.location}</p>
                </div>
              ))
            )}
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
              <button onClick={() => router.push('/admin/festivals')} className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all cursor-pointer">Add New Festival Event</button>
              <button className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-all cursor-pointer" onClick={() => setShowCalendarPopup(false)}>Close Calendar</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
