import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import CulturalGuide from "@/components/ai/CulturalGuide";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

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
      <body className={`${inter.variable} ${playfair.variable} antialiased pattern-bg`}>
        <Navigation />
        {children}
        <CulturalGuide />
      </body>
    </html>
  );
}
