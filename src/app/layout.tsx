import type { Metadata } from "next";
import Navigation from "@/components/layout/Navigation";
import CulturalGuide from "@/components/ai/CulturalGuide";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dagbon Heritage | The Heart of Northern Ghana",
  description: "Discover the rich history, music, traditions, and royalty of the Dagbon Kingdom.",
  keywords: ["Dagomba", "Dagbon", "Ghana", "Culture", "Tradition", "African History"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased pattern-bg">
        <Navigation />
        {children}
        <CulturalGuide />
      </body>
    </html>
  );
}
