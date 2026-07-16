"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Utensils, Wheat, Heart, X } from "lucide-react";
import Image from "next/image";

const dishes = [
  {
    name: "Tuo Zaafi (TZ)",
    description: "The staple food of Dagbon, made from millet or corn flour and served with green vegetable soup (Ayoyo).",
    significance: "Unity & Strength",
    icon: <Utensils size={24} />,
  },
  {
    name: "Dawadawa",
    description: "A traditional fermented locust bean spice that gives Northern Ghanaian dishes their unique umami flavor.",
    significance: "Ancestral Wisdom",
    icon: <Wheat size={24} />,
  },
  {
    name: "Local Drinks",
    description: "Refreshing drinks like Pito (millet beer) and Ginger drink, essential for ceremonies and gatherings.",
    significance: "Hospitality",
    icon: <Coffee size={24} />,
  },
];

export default function FoodLifestyle() {
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);

  return (
    <section id="food" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-sand/10 -skew-y-3 origin-top-left" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 order-2 lg:order-1">
            <div className="md:col-span-2 relative h-[400px] rounded-[48px] overflow-hidden shadow-2xl group">
               <Image 
                src="/food.jpg" 
                alt="Tuo Zaafi" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <span className="text-accent text-xs uppercase tracking-widest font-bold mb-2 block">Signature Dish</span>
                <h3 className="text-white text-3xl font-serif">The Majestic Tuo Zaafi</h3>
              </div>
            </div>

            {dishes.slice(1).map((dish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] border border-secondary/10 bg-sand/5 hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/5">
                  {dish.icon}
                </div>
                <h3 className="text-2xl font-serif text-primary mb-4">{dish.name}</h3>
                <p className="text-sm text-earth/70 leading-relaxed mb-8">
                  {dish.description}
                </p>
                <div className="flex items-center gap-3 text-xs font-bold text-accent uppercase tracking-widest">
                  <Heart size={16} fill="currentColor" /> {dish.significance}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Lifestyle Info */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary tracking-widest uppercase text-sm mb-4 block font-bold">Flavor & Lifestyle</span>
              <h2 className="text-4xl md:text-7xl font-serif text-primary mb-10 leading-tight">The Soul of the <br /> <span className="text-secondary">Northern Kitchen</span></h2>
              <p className="text-earth/70 text-lg leading-relaxed mb-12 max-w-xl">
                Food in Dagbon is more than sustenance; it is a communal experience. From the early morning farming rituals to the evening family circles around a bowl of Tuo Zaafi.
              </p>
              
              <div className="space-y-10">
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-20 h-20 rounded-3xl bg-sand flex items-center justify-center text-primary shadow-xl group-hover:bg-accent transition-colors group-hover:text-white">
                    <Wheat size={40} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-primary mb-2">Farming Culture</h4>
                    <p className="text-base text-earth/50 leading-relaxed">Yams, millet, and sorghum—the backbone of the Dagbon economy and diet.</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-20 h-20 rounded-3xl bg-sand flex items-center justify-center text-primary shadow-xl group-hover:bg-accent transition-colors group-hover:text-white">
                    <Heart size={40} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-primary mb-2">Family Traditions</h4>
                    <p className="text-base text-earth/50 leading-relaxed">Eating together from one large bowl symbolizes unity and mutual respect.</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsRecipeOpen(true)} className="mt-16 px-10 py-5 rounded-full bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-2xl shadow-primary/20 cursor-pointer">
                Discover Culinary Secrets
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isRecipeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRecipeOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 30, opacity: 0 }} className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[48px] overflow-hidden flex flex-col shadow-2xl z-10">
              <div className="p-8 bg-primary text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-3xl">Traditional Dagbon Recipes</h3>
                  <p className="text-accent text-xs uppercase tracking-widest font-bold mt-1">The Northern Kitchen</p>
                </div>
                <button onClick={() => setIsRecipeOpen(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
                {[
                  { name: "Tuo Zaafi (TZ) & Ayoyo Soup", ingredients: ["Corn flour or millet flour", "Fresh Ayoyo leaves (jute mallow)", "Dawadawa (locust beans)", "Smoked fish or meat", "Shea butter", "Salt and pepper"], steps: ["Boil water and gradually stir in the flour to form a thick, smooth paste.", "Cook the Ayoyo leaves in a separate pot with smoked fish and dawadawa.", "Add shea butter for richness and season to taste.", "Serve the TZ in a large bowl with the soup poured over it."] },
                  { name: "Pito (Millet Beer)", ingredients: ["Millet grain", "Water", "Yeast (natural fermentation)", "Large clay pots"], steps: ["Soak millet grains in water for 2\u20133 days until they sprout.", "Dry the sprouted grain and grind into flour.", "Boil the flour into a mash, strain, and allow to ferment in clay pots.", "Serve fresh \u2014 Pito is best consumed within 1\u20132 days of brewing."] },
                  { name: "Ginger Drink (Ginger Beer)", ingredients: ["Fresh ginger root", "Pineapple skins or lemon", "Sugar or honey", "Cloves and pepper"], steps: ["Grate ginger and boil with cloves and pineapple skins.", "Strain the liquid and sweeten with sugar or honey.", "Chill and serve cold \u2014 perfect for hot savannah afternoons."] },
                ].map((recipe, i) => (
                  <div key={i} className="p-8 rounded-[32px] border border-secondary/10 bg-sand/5">
                    <h4 className="text-xl font-serif text-primary mb-6">{recipe.name}</h4>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Ingredients</h5>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ing, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-earth/70"><div className="w-1.5 h-1.5 rounded-full bg-accent" />{ing}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Preparation</h5>
                        <ol className="space-y-3">
                          {recipe.steps.map((step, j) => (
                            <li key={j} className="flex gap-3 text-sm text-earth/70"><span className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold shrink-0">{j + 1}</span>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
