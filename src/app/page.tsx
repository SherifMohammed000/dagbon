"use client";

import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import AboutDagbon from "@/components/home/AboutDagbon";
import PostsSection from "@/components/home/PostsSection";
import MusicExperience from "@/components/home/MusicExperience";
import CulturalGallery from "@/components/home/CulturalGallery";
import FestivalsSection from "@/components/home/FestivalsSection";
import LanguageProverbs from "@/components/home/LanguageProverbs";
import FoodLifestyle from "@/components/home/FoodLifestyle";
import RoyalHeritage from "@/components/home/RoyalHeritage";
import SuggestionsButton from "@/components/home/SuggestionsButton";
import CulturalFooter from "@/components/layout/CulturalFooter";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const current = parseInt(localStorage.getItem("dagbon_visitors_count") || "0", 10);
      if (!sessionStorage.getItem("dagbon_visited")) {
        sessionStorage.setItem("dagbon_visited", "true");
        localStorage.setItem("dagbon_visitors_count", (current + 1).toString());
        window.dispatchEvent(new Event("storage"));
      } else if (current === 0) {
        localStorage.setItem("dagbon_visitors_count", "1");
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <AboutDagbon />
      <PostsSection />
      <MusicExperience />
      <CulturalGallery />
      <FestivalsSection />
      <LanguageProverbs />
      <FoodLifestyle />
      <RoyalHeritage />
      <CulturalFooter />
      <SuggestionsButton />
    </main>
  );
}
