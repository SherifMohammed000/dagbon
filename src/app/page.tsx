import Hero from "@/components/home/Hero";
import AboutDagbon from "@/components/home/AboutDagbon";
import MusicExperience from "@/components/home/MusicExperience";
import CulturalGallery from "@/components/home/CulturalGallery";
import FestivalsSection from "@/components/home/FestivalsSection";
import LanguageProverbs from "@/components/home/LanguageProverbs";
import FoodLifestyle from "@/components/home/FoodLifestyle";
import RoyalHeritage from "@/components/home/RoyalHeritage";
import CulturalFooter from "@/components/layout/CulturalFooter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AboutDagbon />
      <MusicExperience />
      <CulturalGallery />
      <FestivalsSection />
      <LanguageProverbs />
      <FoodLifestyle />
      <RoyalHeritage />
      <CulturalFooter />
    </main>
  );
}
