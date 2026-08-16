"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { saveUserToFirebase, signInWithGoogleFirebase } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleFallback, setShowGoogleFallback] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState("");

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogleFirebase();
      if (user) {
        const session = {
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          token: "google-session-token",
        };
        localStorage.setItem("dagbon_auth", JSON.stringify(session));
        window.dispatchEvent(new Event("storage"));
        setSuccess(`Welcome, ${user.name}! Logging you in...`);
        setTimeout(() => {
          router.push(user.isAdmin ? "/admin" : "/");
        }, 800);
      }
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setIsGoogleLoading(false);
      
      const code = err?.code || "";
      if (code === "auth/operation-not-allowed") {
        setError("Google Sign-In is not enabled yet in your Firebase Console. Go to Firebase Console (dagbon-her) -> Authentication -> Sign-in method -> Enable Google.");
        setShowGoogleFallback(true);
      } else if (code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Domain not authorized in Firebase Console. Add this domain under Authentication -> Settings -> Authorized domains.");
        setShowGoogleFallback(true);
      } else {
        setError("Google Sign-In popup was blocked or unavailable. You can enter your email below to sign in.");
        setShowGoogleFallback(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const submitGoogleFallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    const cleanG = googleEmailInput.trim().toLowerCase();
    const gName = cleanG.split("@")[0] || "Google User";
    const isAdmin = cleanG === "admin@dagbon.com";
    await saveUserToFirebase({ name: gName, email: cleanG, isAdmin });
    const session = { email: cleanG, name: gName, isAdmin, token: "google-session" };
    localStorage.setItem("dagbon_auth", JSON.stringify(session));
    window.dispatchEvent(new Event("storage"));
    setSuccess(`Logged in as ${cleanG}! Redirecting...`);
    setTimeout(() => {
      router.push(isAdmin ? "/admin" : "/");
    }, 800);
  };

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

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (isLogin) {
      // Check admin credentials
      if (cleanEmail === "admin@dagbon.com" && cleanPassword === "Nuru@dagbon") {
        const session = {
          email: "admin@dagbon.com",
          name: "Admin User",
          isAdmin: true,
          token: "admin-session-token",
        };
        localStorage.setItem("dagbon_auth", JSON.stringify(session));
        window.dispatchEvent(new Event("storage"));
        saveUserToFirebase({ name: "Admin User", email: "admin@dagbon.com", isAdmin: true, password: "Nuru@dagbon" });
        router.push("/admin");
        return;
      }

      // Check standard registered users
      const usersData = localStorage.getItem("dagbon_users");
      const users = usersData ? JSON.parse(usersData) : [];
      const user = users.find(
        (u: any) => u.email.trim().toLowerCase() === cleanEmail && u.password.trim() === cleanPassword
      );

      if (user) {
        const session = {
          email: user.email,
          name: user.name,
          isAdmin: false,
          token: "user-session-token",
        };
        localStorage.setItem("dagbon_auth", JSON.stringify(session));
        window.dispatchEvent(new Event("storage"));
        saveUserToFirebase({ name: user.name, email: user.email, isAdmin: false });
        router.push("/");
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } else {
      // Handle signup
      const usersData = localStorage.getItem("dagbon_users");
      const users = usersData ? JSON.parse(usersData) : [];

      const exists = users.some((u: any) => u.email.trim().toLowerCase() === cleanEmail);
      if (exists) {
        setError("Email already registered. Please sign in instead.");
        return;
      }

      const newUser = { name: cleanName, email: cleanEmail, password: cleanPassword };
      users.push(newUser);
      localStorage.setItem("dagbon_users", JSON.stringify(users));

      // Ensure visitor count is updated when user registers
      const visitorCount = parseInt(localStorage.getItem("dagbon_visitors_count") || "0", 10);
      localStorage.setItem("dagbon_visitors_count", (visitorCount + 1).toString());

      // Log in automatically after registration
      const session = {
        email: cleanEmail,
        name: cleanName,
        isAdmin: false,
        token: "user-session-token",
      };
      localStorage.setItem("dagbon_auth", JSON.stringify(session));

      window.dispatchEvent(new Event("storage"));

      // Save new user to Firebase
      saveUserToFirebase({ name: cleanName, email: cleanEmail, isAdmin: false, password: cleanPassword });

      setSuccess("Account created successfully! Logging you in...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder:text-sand/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sand/40 hover:text-accent transition-colors cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-accent text-primary font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 mt-8 shadow-xl shadow-accent/10"
          >
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight size={16} />
          </button>

          <div className="relative flex py-2 items-center my-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-[10px] text-sand/40 uppercase tracking-widest font-bold">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3.5 rounded-2xl bg-white text-primary font-bold text-xs uppercase tracking-wider hover:bg-sand transition-all cursor-pointer flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Connecting to Google...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign In with Google
              </>
            )}
          </button>
        </form>

        {showGoogleFallback && (
          <form onSubmit={submitGoogleFallback} className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <p className="text-xs text-accent font-semibold">Enter your Google Email below to complete Sign-In:</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your.email@gmail.com" 
                value={googleEmailInput} 
                onChange={(e) => setGoogleEmailInput(e.target.value)} 
                className="flex-1 bg-white/10 px-4 py-2.5 rounded-xl text-xs text-white placeholder:text-sand/30 outline-none border border-white/10 focus:border-accent" 
                required 
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer">
                Continue
              </button>
            </div>
          </form>
        )}

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
