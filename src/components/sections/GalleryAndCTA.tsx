"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/i18n/config";

const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", alt: "Restaurant interior", span: "col-span-2 row-span-2" },
  { id: 2, src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80", alt: "Dessert plating", span: "" },
  { id: 3, src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", alt: "Coffee art", span: "" },
  { id: 4, src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", alt: "Chef at work", span: "" },
  { id: 5, src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", alt: "Fine dining", span: "" },
];

export function GalleryPreview({ locale }: { locale: Locale }) {
  const t = useTranslations("home.gallery");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <div className="section-label mb-4">{t("label")}</div>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0A0A0A] dark:text-white">
              {t("title")}
            </h2>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-sans tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors"
          >
            {t("cta")} →
          </Link>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px] sm:h-[540px]">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 border border-white rounded-full flex items-center justify-center text-white text-xl">
                  +
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden text-center mt-6">
          <Link href={`/${locale}/gallery`} className="btn-outline-gold text-xs py-2.5">
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ReservationCTA({ locale }: { locale: Locale }) {
  const t = useTranslations("home.reservation");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1600&q=80"
          alt="Restaurant ambiance"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-obsidian/70" />
      </div>

      {/* Gold accent lines */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold-500 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="section-label">{t("title")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light text-white leading-tight">
              {t("title")}
            </h2>
            <p className="text-neutral-400 font-sans text-lg leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Quick info */}
            <div className="flex flex-wrap gap-6 text-sm font-sans text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Interactive table map
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Instant confirmation
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Secure payment
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Link href={`/${locale}/reservation`} className="btn-gold group inline-flex">
                <span>{t("cta")}</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
