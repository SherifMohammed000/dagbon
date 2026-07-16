"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Users, Landmark, Award } from "lucide-react";
import { useState } from "react";

interface RoyalLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoyalLineageModal({ isOpen, onClose }: RoyalLineageModalProps) {
  const [activeTab, setActiveTab] = useState<"origins" | "system" | "gates">("origins");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="relative w-full max-w-5xl max-h-[85vh] bg-[#0c0d0c] border border-accent/20 rounded-[48px] overflow-hidden flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-primary/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-white">The Royal Dagbon Lineage</h3>
                  <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Guardian of the Golden Skins</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/5 px-8 py-2 bg-black/40 gap-4 overflow-x-auto shrink-0">
              {(["origins", "system", "gates"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-accent text-primary shadow-lg shadow-accent/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab === "origins" && "Origins (Naa Gbewaa)"}
                  {tab === "system" && "The Skin System"}
                  {tab === "gates" && "Succession Gates"}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "origins" && (
                  <motion.div
                    key="origins"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                      <div>
                        <span className="text-accent text-[10px] uppercase font-bold tracking-widest mb-2 block">14th - 15th Century</span>
                        <h4 className="text-3xl font-serif text-white mb-6">From Tohazie to Naa Gbewaa</h4>
                        <p className="text-sand/70 text-base leading-relaxed mb-6 font-light">
                          The kingdom&apos;s lineage traces back to <strong className="text-white">Tohazie (The Red Hunter)</strong>, a legendary warrior who migrated from the Lake Chad region. His grandson, <strong className="text-white">Naa Gbewaa</strong>, settled at Pusiga and consolidated power, establishing the single royal family from which all Dagbon rulers descend.
                        </p>
                        <p className="text-sand/70 text-base leading-relaxed font-light">
                          After Naa Gbewaa, his children founded three major sister kingdoms: <strong className="text-white">Dagbon</strong>, <strong className="text-white">Mamprugu</strong>, and <strong className="text-white">Nanung</strong>, creating a deep ancestral bond across Northern Ghana.
                        </p>
                      </div>
                      <div className="p-8 rounded-[36px] bg-white/5 border border-white/10 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                        <h5 className="font-serif text-xl text-accent">Key Ancestors</h5>
                        <div className="space-y-4">
                          {[
                            { num: "1", name: "Tohazie (Red Hunter)", desc: "Led migrations and married a Malli princess." },
                            { num: "2", name: "Naa Gbewaa", desc: "First absolute overlord, settled Pusiga, established customs." },
                            { num: "3", name: "Naa Sitobu", desc: "Son of Gbewaa who founded the modern Dagbon capital in Yendi." },
                          ].map((a) => (
                            <div key={a.num} className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0 text-xs font-bold">{a.num}</div>
                              <div>
                                <strong className="text-white block text-sm">{a.name}</strong>
                                <span className="text-xs text-sand/50">{a.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "system" && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { icon: <Award className="text-accent" size={36} />, title: "Skins over Thrones", text: "In Dagbon, royals do not sit on thrones; they sit on Skins (Gbaŋ) of cows, rams, and leopards. The skin is a spiritual connection to the land and the ancestors who walked it." },
                        { icon: <Landmark className="text-accent" size={36} />, title: "The Ya-Na Overlord", text: "The King of Dagbon is titled Ya-Na, meaning \"King of Strength.\" The seat is located in the Gbewaa Palace in Yendi and governs over all divisional chiefdoms." },
                        { icon: <Users className="text-accent" size={36} />, title: "The Elder Council", text: "Lineage selection is guided by a supreme council of elders and kingmakers (Gbaŋlana, Kuga-Na) who consult ancestral spirits to choose the rightful successor." },
                      ].map((card) => (
                        <div key={card.title} className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4 hover:border-accent/30 transition-all">
                          {card.icon}
                          <h4 className="text-xl font-serif text-white">{card.title}</h4>
                          <p className="text-sm text-sand/60 leading-relaxed font-light">{card.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-8 rounded-[36px] bg-accent/5 border border-accent/20">
                      <h4 className="text-lg font-serif text-accent mb-4">Ya-Na Coronation Process</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                        {[
                          { step: "1", title: "Consultation", desc: "Consulting the gods & reading signs" },
                          { step: "2", title: "Enskinment", desc: "Clothed in royal robes & skins" },
                          { step: "3", title: "Palace Entry", desc: "Parade into Gbewaa Palace" },
                          { step: "4", title: "Homage", desc: "All sub-chiefs pledge allegiance" },
                        ].map((item) => (
                          <div key={item.step} className="space-y-2">
                            <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm mx-auto shadow-md">{item.step}</div>
                            <h5 className="font-bold text-white text-sm">{item.title}</h5>
                            <p className="text-xs text-sand/50">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "gates" && (
                  <motion.div
                    key="gates"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="p-8 rounded-[36px] bg-white/5 border border-white/10 space-y-6">
                      <h4 className="text-2xl font-serif text-white text-center">The Rotational Succession Gates</h4>
                      <p className="text-sm text-sand/70 leading-relaxed text-center max-w-3xl mx-auto font-light">
                        Dagbon features a highly unique system of rotation. Succession to the Ya-Na skin alternates between two royal gates descended from Naa Yakubu I: the <strong className="text-white">Abudu Gate</strong> and the <strong className="text-white">Andani Gate</strong>.
                      </p>
                      <p className="text-sm text-sand/70 leading-relaxed text-center max-w-3xl mx-auto font-light">
                        Before becoming Ya-Na, a prince must occupy one of the three gate-skins: <strong className="text-white">Savelugu</strong>, <strong className="text-white">Karaga</strong>, or <strong className="text-white">Mion</strong>.
                      </p>

                      <div className="flex flex-col md:flex-row justify-center items-center gap-6 pt-6">
                        <div className="w-56 p-6 rounded-2xl bg-secondary/20 border border-secondary/30 text-center space-y-2">
                          <h5 className="font-serif font-bold text-white text-lg">Abudu Gate</h5>
                          <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Royal House A</span>
                        </div>
                        <div className="text-white text-2xl font-serif select-none">⇄</div>
                        <div className="w-56 p-6 rounded-2xl bg-earth/20 border border-earth/30 text-center space-y-2">
                          <h5 className="font-serif font-bold text-white text-lg">Andani Gate</h5>
                          <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Royal House B</span>
                        </div>
                      </div>

                      <div className="text-center text-[10px] uppercase font-bold text-accent tracking-widest pt-2 select-none">
                        ⬇ alternates to occupy ⬇
                      </div>

                      <div className="max-w-md mx-auto p-6 rounded-3xl bg-accent/15 border border-accent/30 text-center">
                        <h5 className="font-serif font-bold text-white text-lg">Ya-Na (Yendi Skin)</h5>
                        <p className="text-xs text-sand/70 mt-1">Overlord of the entire Dagbon Kingdom</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
