"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const IMAGES = [
  { id:1, src:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", alt:"Restaurant interior evening", cat:"interior", span:"col-span-2 row-span-2" },
  { id:2, src:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80", alt:"Truffle risotto plating", cat:"food", span:"" },
  { id:3, src:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", alt:"Espresso pour", cat:"coffee", span:"" },
  { id:4, src:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80", alt:"Crème brûlée", cat:"food", span:"col-span-2" },
  { id:5, src:"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", alt:"Beef tenderloin", cat:"food", span:"" },
  { id:6, src:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", alt:"Coffee art detail", cat:"coffee", span:"" },
  { id:7, src:"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80", alt:"Private dining room", cat:"interior", span:"col-span-2" },
  { id:8, src:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80", alt:"Matcha ceremony", cat:"coffee", span:"" },
  { id:9, src:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80", alt:"Seared salmon plate", cat:"food", span:"" },
  { id:10, src:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80", alt:"Chocolate dessert", cat:"food", span:"" },
  { id:11, src:"https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=600&q=80", alt:"Champagne cocktail", cat:"events", span:"" },
  { id:12, src:"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80", alt:"Chef at work", cat:"events", span:"col-span-2" },
];

const CATS = ["all", "food", "coffee", "interior", "events"] as const;

export default function GalleryClient({ locale: _locale }: { locale: Locale }) {
  const t = useTranslations("gallery");
  const [cat, setCat] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() =>
    cat === "all" ? IMAGES : IMAGES.filter(i => i.cat === cat),
    [cat]
  );

  const lbImg = lightbox !== null ? filtered[lightbox] : null;

  const lbPrev = () => setLightbox(i => (i === null ? null : i === 0 ? filtered.length - 1 : i - 1));
  const lbNext = () => setLightbox(i => (i === null ? null : i === filtered.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-24">
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.07),transparent_70%)]" />
        <div className="relative z-10">
          <div className="section-label justify-center mb-4">{t("subtitle")}</div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white">{t("title")}</h1>
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 px-4 py-4">
        <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium tracking-widest uppercase whitespace-nowrap transition-all duration-200 ${
                cat === c
                  ? "bg-gold-500 text-white shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-gold-500/10 hover:text-gold-500"
              }`}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`relative overflow-hidden rounded-xl cursor-pointer group ${img.span}`}
                onClick={() => setLightbox(i)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] tracking-widest uppercase font-sans text-white/80">{img.alt}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && lbImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:border-gold-500 transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>

            {/* Prev */}
            <button
              className="absolute left-4 sm:left-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white hover:border-gold-500 transition-colors z-10"
              onClick={e => { e.stopPropagation(); lbPrev(); }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Image */}
            <motion.div
              key={lbImg.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[80vh] mx-16"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={lbImg.src.replace("w=600", "w=1200").replace("w=800", "w=1400")}
                alt={lbImg.alt}
                width={1200}
                height={800}
                className="object-contain w-full max-h-[80vh] rounded-xl"
              />
              <p className="text-center text-neutral-400 text-sm font-sans mt-4">{lbImg.alt}</p>
              <p className="text-center text-neutral-600 text-xs font-sans mt-1">
                {lightbox + 1} / {filtered.length}
              </p>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 sm:right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white hover:border-gold-500 transition-colors z-10"
              onClick={e => { e.stopPropagation(); lbNext(); }}
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
