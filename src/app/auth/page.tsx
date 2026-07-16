"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // If already logged in, redirect
    const session = localStorage.getItem("dagbon_auth");
    if (session) {
      const auth = JSON.parse(session);
      if (auth.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    if (isLogin) {
      // Check admin credentials
      if (email.toLowerCase() === "admin@dagbon.com" && password === "Nuru000") {
        const session = {
          email: "admin@dagbon.com",
          name: "Admin User",
          isAdmin: true,
          token: "admin-session-token",
        };
        localStorage.setItem("dagbon_auth", JSON.stringify(session));
        router.push("/admin");
        return;
      }

      // Check standard registered users
      const usersData = localStorage.getItem("dagbon_users");
      const users = usersData ? JSON.parse(usersData) : [];
      const user = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        const session = {
          email: user.email,
          name: user.name,
          isAdmin: false,
          token: "user-session-token",
        };
        localStorage.setItem("dagbon_auth", JSON.stringify(session));
        router.push("/");
      } else {
        setError("Invalid email or password.");
      }
    } else {
      // Handle signup
      const usersData = localStorage.getItem("dagbon_users");
      const users = usersData ? JSON.parse(usersData) : [];

      const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError("Email already registered.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("dagbon_users", JSON.stringify(users));

      setSuccess("Account created successfully! Switching to login...");
      setTimeout(() => {
        setIsLogin(true);
        setPassword("");
        setError("");
        setSuccess("");
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-20 px-6 bg-[#0c0d0c]">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 bg-[url('/savannah-overlook.jpg')]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1a0f]/80 via-black/90 to-primary/80" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[48px] shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto mb-4 border border-accent/30 shadow-lg">
            <Sparkles size={28} />
          </div>
          <h2 className="font-serif text-3xl text-white mb-2">
            {isLogin ? "Welcome Back" : "Join the Archive"}
          </h2>
          <p className="text-sand/50 text-xs uppercase tracking-widest font-bold">
            {isLogin ? "Explore Dagbon Heritage" : "Create your digital skin"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs text-center font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-sand/60">Full Name</label>
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5 border border-white/10 focus-within:border-accent/50 transition-colors">
                <User size={18} className="text-sand/40" />
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder:text-sand/30"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sand/60">Email Address</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5 border border-white/10 focus-within:border-accent/50 transition-colors">
              <Mail size={18} className="text-sand/40" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder:text-sand/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sand/60">Password</label>
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3.5 border border-white/10 focus-within:border-accent/50 transition-colors">
              <Lock size={18} className="text-sand/40" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder:text-sand/30"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-accent text-primary font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 mt-8 shadow-xl shadow-accent/10"
          >
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-xs text-sand/60 hover:text-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
