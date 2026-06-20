"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n/config";

interface ChefStoryProps {
  locale: Locale;
}

export default function ChefStory({ locale }: ChefStoryProps) {
  const t = useTranslations("home.chef");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-white dark:bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image column with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative h-[600px] lg:h-[700px] overflow-hidden rounded-2xl">
              <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80"
                  alt="Chef Alexandre Moreau"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
              </motion.div>

              {/* Quote card */}
              <div className="absolute bottom-8 left-8 right-8 glass-dark rounded-xl p-6">
                <div className="text-gold-400 font-display text-4xl leading-none mb-2">&ldquo;</div>
                <p className="text-white font-display text-lg italic leading-snug">
                  {t("quote")}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="text-gold-400 text-xs font-sans tracking-widest uppercase">
                    Chef Alexandre Moreau
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative gold box */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-gold-500/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-gold-500/10 rounded-2xl -z-10" />
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <div className="section-label mb-5">{t("label")}</div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#0A0A0A] dark:text-white leading-tight">
                {t("title")}
              </h2>
            </div>

            <p className="text-neutral-500 dark:text-neutral-400 font-sans text-base lg:text-lg leading-relaxed">
              {t("bio")}
            </p>

            {/* Awards row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { year: "2019", award: "Best New Restaurant" },
                { year: "2021", award: "Michelin Bib Gourmand" },
                { year: "2023", award: "Top Chef Paris" },
              ].map((a) => (
                <div
                  key={a.year}
                  className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 text-center hover:border-gold-500/50 transition-colors"
                >
                  <div className="text-gold-500 font-display text-xl mb-1">{a.year}</div>
                  <div className="text-neutral-500 text-[10px] font-sans leading-tight">{a.award}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/about`} className="btn-gold">
                {t("cta")}
              </Link>
              <Link href={`/${locale}/menu`} className="btn-outline-gold">
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
