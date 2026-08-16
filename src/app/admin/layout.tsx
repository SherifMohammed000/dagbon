"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Music, 
  Image as ImageIcon, 
  Calendar, 
  Search, 
  Bell,
  LogOut,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNotifications, getTimeAgo, markAllNotificationsAsRead, AdminNotification } from "@/lib/notifications";

const menuItems = [
  { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/admin" },
  { name: "Cultural Content", icon: <FileText size={20} />, href: "/admin/content" },
  { name: "Music Library", icon: <Music size={20} />, href: "/admin/music" },
  { name: "Media Gallery", icon: <ImageIcon size={20} />, href: "/admin/gallery" },
  { name: "Festivals", icon: <Calendar size={20} />, href: "/admin/festivals" },
  { name: "Suggestions", icon: <MessageSquare size={20} />, href: "/admin/suggestions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const syncNotifs = () => setNotifications(getNotifications());
    syncNotifs();
    window.addEventListener("storage", syncNotifs);
    return () => window.removeEventListener("storage", syncNotifs);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      markAllNotificationsAsRead();
    }
    setShowNotifications(!showNotifications);
  };

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
    <div className="min-h-screen bg-white text-primary flex relative overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-primary text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 md:p-8 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg">
              D
            </div>
            <span className="font-serif text-xl">Admin Panel</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden text-sand/60 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-accent text-primary font-bold shadow-md" 
                    : "text-sand/70 hover:bg-white/10 hover:text-white"
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
      <main className="flex-1 ml-0 md:ml-64 min-h-screen flex flex-col bg-white text-primary w-full max-w-full overflow-x-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-secondary/10 flex items-center justify-between px-4 sm:px-6 md:px-10 sticky top-0 z-30 shadow-xs gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-primary hover:bg-sand/30 rounded-xl transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-4 bg-sand/20 px-4 py-2 rounded-xl w-48 sm:w-64 md:w-96 border border-secondary/10">
              <Search size={18} className="text-earth/40 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm flex-1 text-primary placeholder:text-earth/40 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 relative">
            <button 
              onClick={toggleNotifications} 
              className="relative p-2 text-earth/60 hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-sand/30"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Tap outside backdrop */}
            {showNotifications && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
            )}

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-16 right-0 w-72 sm:w-84 bg-white rounded-2xl border border-secondary/15 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-secondary/10 flex items-center justify-between bg-sand/10">
                    <h4 className="font-bold text-primary text-sm">Notifications</h4>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-secondary/5 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-earth/40 text-xs italic">
                        No notifications yet. Admin actions and user suggestions will appear here.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            markAllNotificationsAsRead([n.id]);
                            setShowNotifications(false);
                            router.push(n.targetUrl || "/admin");
                          }}
                          className={`w-full text-left p-4 transition-all cursor-pointer group block ${
                            n.read ? "bg-white opacity-60" : "bg-secondary/5 hover:bg-sand/20"
                          }`}
                        >
                          <p className="text-xs text-primary leading-relaxed font-medium mb-1 group-hover:text-secondary transition-colors">{n.text}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary group-hover:underline">
                              {n.type} →
                            </span>
                            <span className="text-[9px] text-earth/40 uppercase tracking-wider font-semibold">
                              {getTimeAgo(n.timestamp)}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-8 w-px bg-secondary/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-primary">Admin User</p>
                <p className="text-[10px] text-earth/50 uppercase tracking-widest font-semibold">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-accent/30 shadow-sm shrink-0" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 md:p-10 flex-1 bg-white text-primary w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
