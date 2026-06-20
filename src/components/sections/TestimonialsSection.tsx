"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Isabelle Fontaine",
    role: "Food Critic, Le Figaro",
    content:
      "Aliore is the rarest of things — a restaurant that genuinely earns its reputation. Every element of the meal was thought through with intelligence and warmth. The truffle risotto alone is worth the visit.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Marcus Klein",
    role: "Restaurateur, Berlin",
    content:
      "I have dined in restaurants across three continents. Aliore's coffee programme is among the finest I have encountered. The attention to origin, extraction and presentation is extraordinary.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    role: "Travel Blogger",
    content:
      "The interactive reservation map is a revelation — I selected my corner table from home and it was exactly as described. The staff remembered my dietary preferences from my last visit six months prior.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Arash Karimi",
    role: "Architect",
    content:
      "As someone who appreciates design, Aliore is exceptional. The space, the lighting, the plating — everything speaks the same refined language. A feast for the eyes before a word is ordered.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-cream-50 dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-4">{t("label")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#0A0A0A] dark:text-white">
            {t("title")}
          </h2>
        </motion.div>

        {/* Main testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-8"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1">
                {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl font-light text-[#0A0A0A] dark:text-white leading-relaxed">
                &ldquo;{TESTIMONIALS[current].content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gold-500/30">
                  <Image
                    src={TESTIMONIALS[current].image}
                    alt={TESTIMONIALS[current].name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-heading text-[#0A0A0A] dark:text-white font-medium">
                    {TESTIMONIALS[current].name}
                  </div>
                  <div className="text-neutral-400 text-sm font-sans">{TESTIMONIALS[current].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-px transition-all duration-300 ${
                    i === current ? "w-8 bg-gold-500" : "w-4 bg-neutral-300 dark:bg-neutral-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mini testimonials row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {TESTIMONIALS.map((t2, i) => (
            <motion.button
              key={t2.id}
              onClick={() => setCurrent(i)}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.08 }}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                i === current
                  ? "border-gold-500 bg-gold-500/5"
                  : "border-neutral-100 dark:border-neutral-800 hover:border-gold-500/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src={t2.image} alt={t2.name} width={32} height={32} className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#0A0A0A] dark:text-white font-sans truncate">
                    {t2.name}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">{t2.content}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
