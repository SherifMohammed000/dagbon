"use client";

import { useState, useEffect } from "react";

export type AuthSession = {
  email: string;
  name: string;
  isAdmin: boolean;
  token: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthSession | null>(null);

  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("dagbon_auth");
      if (raw) {
        try { setUser(JSON.parse(raw)); } catch { setUser(null); }
      } else {
        setUser(null);
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const signOut = () => {
    localStorage.removeItem("dagbon_auth");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  return { user, signOut };
}
