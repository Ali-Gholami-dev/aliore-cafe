"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Flame, Leaf, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { useCart } from "@/components/providers/CartProvider";

interface FeaturedDishesProps {
  locale: Locale;
}

const FEATURED_DISHES = [
  {
    id: "d1",
    name: "Truffle Risotto",
    category: "Dinner",
    price: 38,
    description: "Aged parmesan, black truffle, wild mushroom consommé",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    isVegan: false,
    isGlutenFree: true,
    prepTime: 25,
    calories: 520,
    badge: "Chef's Pick",
  },
  {
    id: "d2",
    name: "Signature Espresso",
    category: "Coffee",
    price: 8,
    description: "Single-origin Ethiopian blend, volcanic stone filtered",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
    isVegan: true,
    isGlutenFree: true,
    prepTime: 5,
    calories: 10,
    badge: "Best Seller",
  },
  {
    id: "d3",
    name: "Crème Brûlée",
    category: "Desserts",
    price: 16,
    description: "Madagascar vanilla, caramelised demerara, gold leaf",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80",
    isVegan: false,
    isGlutenFree: true,
    prepTime: 15,
    calories: 340,
    badge: "Award Winner",
  },
  {
    id: "d4",
    name: "Seared Salmon",
    category: "Lunch",
    price: 34,
    description: "Butter-basted, fennel purée, citrus beurre blanc",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    isVegan: false,
    isGlutenFree: true,
    prepTime: 20,
    calories: 480,
    badge: "Seasonal",
  },
];

export default function FeaturedDishes({ locale }: FeaturedDishesProps) {
  const t = useTranslations("home.featured");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { add } = useCart();

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-cream-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-4">{t("label")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#0A0A0A] dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-neutral-500 font-sans text-lg max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Dishes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DISHES.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-gold-500 text-white text-[10px] font-sans font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                    {dish.badge}
                  </div>

                  {/* Icons overlay */}
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {dish.isVegan && (
                      <span className="bg-emerald-500/90 text-white rounded-full p-1">
                        <Leaf size={10} />
                      </span>
                    )}
                    {dish.isGlutenFree && (
                      <span className="bg-blue-500/90 text-white rounded-full p-1 text-[8px] font-bold leading-none px-1.5">
                        GF
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[10px] tracking-widest text-gold-500 uppercase font-sans font-medium mb-1">
                        {dish.category}
                      </p>
                      <h3 className="font-heading text-lg text-[#0A0A0A] dark:text-white leading-tight">
                        {dish.name}
                      </h3>
                    </div>
                    <span className="font-display text-xl text-gold-500 shrink-0 mt-1">
                      ${dish.price}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-4">
                    {dish.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {dish.prepTime}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame size={10} />
                        {dish.calories} kcal
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        add({
                          id: dish.id,
                          name: dish.name,
                          price: dish.price,
                          quantity: 1,
                          image: dish.image,
                        })
                      }
                      className="text-[11px] tracking-widest uppercase font-sans font-medium text-gold-500 border border-gold-500/30 px-3 py-1.5 rounded-full hover:bg-gold-500 hover:text-white transition-all duration-200"
                    >
                      + Order
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href={`/${locale}/menu`} className="btn-outline-gold">
            View Full Menu →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
