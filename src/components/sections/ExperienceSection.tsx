"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Award, Coffee, Star, Clock } from "lucide-react";

const MARQUEE_ITEMS = [
  "Fine Dining", "Specialty Coffee", "Craft Cocktails", "Seasonal Menu",
  "Michelin Recognised", "Private Events", "Artisan Pastries", "Wine Cellar",
  "Fine Dining", "Specialty Coffee", "Craft Cocktails", "Seasonal Menu",
  "Michelin Recognised", "Private Events", "Artisan Pastries", "Wine Cellar",
];

export default function ExperienceSection() {
  const t = useTranslations("home.experience");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { icon: Coffee, key: "stat1", value: "120+", label: "Curated Dishes" },
    { icon: Star,   key: "stat2", value: "98%",  label: "Guest Satisfaction" },
    { icon: Award,  key: "stat3", value: "5★",   label: "Michelin Recognition" },
    { icon: Clock,  key: "stat4", value: "12",   label: "Years of Excellence" },
  ];

  return (
    <section className="bg-[#0A0A0A] overflow-hidden">
      {/* Marquee */}
      <div className="border-y border-neutral-800 py-4 overflow-hidden">
        <div className="flex animate-marquee gap-12 w-max">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-xs tracking-[0.3em] text-neutral-400 uppercase font-sans font-medium">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div ref={ref} className="py-24 lg:py-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="space-y-6"
          >
            <div className="section-label">{t("label")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
              {t("title")}
            </h2>
            <p className="text-neutral-400 font-sans text-lg leading-relaxed max-w-md">
              {t("subtitle")}
            </p>

            {/* Visual divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-gold-500" />
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                "Curated by a Michelin-trained chef",
                "Seasonal, locally-sourced ingredients",
                "Over 200 labels in our wine cellar",
                "Private dining rooms for 2–30 guests",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3 text-neutral-300 font-sans text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, key, value, label }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                className="relative border border-neutral-800 rounded-2xl p-8 hover:border-gold-500/40 transition-colors group overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Icon size={24} className="text-gold-500 mb-6" />
                <div className="font-display text-4xl lg:text-5xl text-white mb-2">{value}</div>
                <div className="text-neutral-500 text-xs font-sans tracking-wider uppercase">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom marquee (reversed) */}
      <div className="border-t border-neutral-800 py-4 overflow-hidden">
        <div className="flex animate-marquee gap-12 w-max" style={{ animationDirection: "reverse" }}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-[10px] tracking-[0.3em] text-neutral-600 uppercase font-sans">
                {item}
              </span>
              <span className="w-1 h-1 rotate-45 bg-neutral-700 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
