"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Calendar, 
  Users, 
  Settings, 
  Search, 
  Bell,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin" },
  { name: "Cultural Content", icon: <FileText size={20} />, href: "/admin/content" },
  { name: "Music Library", icon: <Music size={20} />, href: "/admin/music" },
  { name: "Media Gallery", icon: <ImageIcon size={20} />, href: "/admin/gallery" },
  { name: "Festivals", icon: <Calendar size={20} />, href: "/admin/festivals" },
  { name: "Community", icon: <Users size={20} />, href: "/admin/users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("dagbon_auth");
    if (!session) {
      router.push("/auth");
      return;
    }
    try {
      const auth = JSON.parse(session);
      if (!auth.isAdmin) {
        router.push("/auth");
      } else {
        setAuthorized(true);
      }
    } catch {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("dagbon_auth");
    router.push("/");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0c0d0c] text-white flex items-center justify-center font-serif text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed inset-y-0 left-0">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg">
              D
            </div>
            <span className="font-serif text-xl">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-accent text-primary" 
                    : "text-sand/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className={cn("transition-colors", isActive ? "text-primary" : "text-accent")}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-secondary/10 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-sand/30 px-4 py-2 rounded-xl w-96 border border-secondary/5">
            <Search size={18} className="text-earth/30" />
            <input 
              type="text" 
              placeholder="Search content, users, media..." 
              className="bg-transparent border-none focus:ring-0 text-sm flex-1"
            />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-earth/50 hover:text-primary transition-colors cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-24 w-80 bg-white rounded-2xl border border-secondary/10 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-secondary/10">
                    <h4 className="font-bold text-primary text-sm">Notifications</h4>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { text: "New article published: History of Lunga", time: "2 hours ago" },
                      { text: "3 new images uploaded to gallery", time: "5 hours ago" },
                      { text: "Damba Festival countdown updated", time: "1 day ago" },
                    ].map((n, i) => (
                      <div key={i} className="p-4 border-b border-secondary/5 hover:bg-sand/10 transition-colors cursor-pointer">
                        <p className="text-sm text-primary">{n.text}</p>
                        <span className="text-[10px] text-earth/40 uppercase tracking-widest">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-8 w-px bg-secondary/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-primary">Admin User</p>
                <p className="text-[10px] text-earth/50 uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-accent/20" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
