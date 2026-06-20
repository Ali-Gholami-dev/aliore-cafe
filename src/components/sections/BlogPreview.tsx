"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const POSTS = [
  {
    id: "p1",
    slug: "the-art-of-perfect-espresso",
    title: "The Art of the Perfect Espresso",
    excerpt: "From bean selection to extraction pressure — we unpack the science and soul behind Aliore's signature espresso programme.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    date: "December 12, 2024",
    readTime: "6 min",
    tag: "Coffee",
  },
  {
    id: "p2",
    slug: "truffle-season-2024",
    title: "Truffle Season: What's on the Menu",
    excerpt: "Winter in the kitchen means one thing — black truffle. Chef Alexandre shares his philosophy behind Aliore's truffle menu.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    date: "November 28, 2024",
    readTime: "4 min",
    tag: "Seasonal",
  },
  {
    id: "p3",
    slug: "private-dining-guide",
    title: "Planning the Perfect Private Dinner",
    excerpt: "Our private dining rooms host everything from intimate proposals to corporate celebrations. Here's how to make yours unforgettable.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    date: "November 10, 2024",
    readTime: "5 min",
    tag: "Events",
  },
];

export default function BlogPreview({ locale }: { locale: Locale }) {
  const t = useTranslations("home.blog");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-cream-50 dark:bg-neutral-950">
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
            href={`/${locale}/blog`}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-sans tracking-widest uppercase text-gold-500 hover:text-gold-400 transition-colors"
          >
            {t("cta")} →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group"
            >
              <Link href={`/${locale}/blog/${post.slug}`}>
                <div className="relative h-56 overflow-hidden rounded-xl mb-5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] font-sans font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                    {post.tag}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime} read
                    </span>
                  </div>

                  <h3 className="font-heading text-lg text-[#0A0A0A] dark:text-white leading-snug group-hover:text-gold-500 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-neutral-400 text-sm font-sans leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-gold-500 text-xs font-sans tracking-widest uppercase hover:gap-4 transition-all duration-300">
                    Read Story →
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
