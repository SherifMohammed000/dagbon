"use client";

import { motion } from "framer-motion";
import { Coffee, Utensils, Wheat, Heart } from "lucide-react";
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

              <button className="mt-16 px-10 py-5 rounded-full bg-primary text-white font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-2xl shadow-primary/20">
                Discover Culinary Secrets
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
