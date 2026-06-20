"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import VideoModal from "@/components/ui/VideoModal";

const HeroCanvas = dynamic(
  () => import("@/components/3d/HeroCanvas"),
  { ssr: false, loading: () => null }
);

export default function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [canMount, setCanMount] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setCanMount(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const textY    = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scaleVal = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as number[] } },
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen w-full overflow-hidden flex items-center"
        style={{ background: "#0A0A0A" }}
      >
        {/* Static gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(201,168,76,0.08) 0%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.05) 0%, transparent 60%)" }} />
        </div>

        {/* 3D canvas — client only */}
        {canMount && (
          <motion.div
            style={{ scale: scaleVal }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <HeroCanvas scrollY={scrollY} />
          </motion.div>
        )}

        {/* Text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
          <motion.div style={{ y: textY, opacity }}>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6 max-w-2xl"
            >
              {/* Tagline */}
              <motion.div variants={item} className="flex items-center gap-3 text-[#C9A84C] font-sans tracking-[0.25em] text-xs uppercase font-medium">
                <span className="block w-8 h-px bg-[#C9A84C]" />
                {t("tagline")}
                <span className="block w-8 h-px bg-[#C9A84C]" />
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={item}
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.9] tracking-tight text-white"
              >
                {t("headline").split(" ").map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <em
                      key={i}
                      className="not-italic"
                      style={{
                        background: "linear-gradient(135deg,#C9A84C 0%,#E8D48A 50%,#C9A84C 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {word}{" "}
                    </em>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={item}
                className="text-neutral-400 font-sans text-base sm:text-lg leading-relaxed max-w-md"
              >
                {t("subheadline")}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href={`/${locale}/reservation`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] text-white font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-[#B8963C]"
                >
                  {t("cta")}
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
                </Link>
                <Link
                  href={`/${locale}/menu`}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[#C9A84C] text-[#C9A84C] font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-[#C9A84C] hover:text-white"
                >
                  {t("ctaMenu")}
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div variants={item} className="flex gap-8 pt-4 border-t border-neutral-800">
                {[
                  { value: "120+", label: "Dishes" },
                  { value: "12",   label: "Years"  },
                  { value: "5★",   label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-2xl text-white">{stat.value}</div>
                    <div className="text-xs text-neutral-500 font-sans tracking-widest uppercase mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Watch film button — now functional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-32 right-8 sm:right-16 lg:right-24 z-10"
        >
          <button
            onClick={() => setVideoOpen(true)}
            className="group relative w-20 h-20 rounded-full border border-[#C9A84C]/40 flex items-center justify-center hover:border-[#C9A84C] transition-colors"
            aria-label="Watch film"
          >
            <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20 animate-ping" />
            <Play size={20} className="text-[#C9A84C] ml-1" fill="currentColor" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-neutral-500 whitespace-nowrap font-sans uppercase">
              Watch Film
            </span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase font-sans">{t("scrollHint")}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown size={16} className="text-[#C9A84C]" />
          </motion.div>
        </motion.div>

        {/* Side text */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-4">
          <span
            className="text-[10px] tracking-[0.4em] text-neutral-600 uppercase font-sans"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Fine Dining · Specialty Coffee
          </span>
          <div className="w-px h-16" style={{ background: "linear-gradient(to bottom, rgba(120,120,120,0.4), transparent)" }} />
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
