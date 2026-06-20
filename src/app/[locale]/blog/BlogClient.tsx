"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const POSTS = [
  {
    id:"p1", slug:"the-art-of-perfect-espresso",
    title:"The Art of the Perfect Espresso",
    excerpt:"From bean selection to extraction pressure — we unpack the science and soul behind Aliore's signature espresso programme.",
    content:"", image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    date:"December 12, 2024", readTime:"6 min", tag:"Coffee", featured:true,
    author:"Marco Bianchi",
  },
  {
    id:"p2", slug:"truffle-season-2024",
    title:"Truffle Season: What's on the Menu",
    excerpt:"Winter in the kitchen means one thing — black truffle. Chef Alexandre shares his philosophy behind Aliore's truffle menu.",
    content:"", image:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    date:"November 28, 2024", readTime:"4 min", tag:"Seasonal", featured:false,
    author:"Alexandre Moreau",
  },
  {
    id:"p3", slug:"private-dining-guide",
    title:"Planning the Perfect Private Dinner",
    excerpt:"Our private dining rooms host everything from intimate proposals to corporate celebrations. Here's how to make yours unforgettable.",
    content:"", image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    date:"November 10, 2024", readTime:"5 min", tag:"Events", featured:false,
    author:"Sophie Laurent",
  },
  {
    id:"p4", slug:"sourcing-our-coffee",
    title:"How We Source Our Coffee — Direct from Origin",
    excerpt:"Aliore's coffee director Marco Bianchi travels to three continents each year to find the perfect beans. This is his story.",
    content:"", image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    date:"October 22, 2024", readTime:"8 min", tag:"Coffee", featured:false,
    author:"Marco Bianchi",
  },
  {
    id:"p5", slug:"wine-and-food-pairing",
    title:"Wine & Food Pairing: The Aliore Way",
    excerpt:"Sommelier Amara Diallo walks through the art of pairing our seasonal menu with selections from our 200-label wine cellar.",
    content:"", image:"https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80",
    date:"October 5, 2024", readTime:"6 min", tag:"Wine", featured:false,
    author:"Amara Diallo",
  },
  {
    id:"p6", slug:"pastry-behind-scenes",
    title:"Behind the Pastry Counter",
    excerpt:"Sophie Laurent takes us inside the pastry kitchen — the early mornings, the precision, and the joy of making something beautiful.",
    content:"", image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    date:"September 18, 2024", readTime:"5 min", tag:"Kitchen", featured:false,
    author:"Sophie Laurent",
  },
];

export default function BlogClient({ locale }: { locale: Locale }) {
  const t = useTranslations("blog");
  const featured = POSTS.find(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-24">
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.07),transparent_70%)]" />
        <div className="relative z-10">
          <div className="section-label justify-center mb-4">From Our Kitchen</div>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-3">{t("title")}</h1>
          <p className="text-neutral-400 font-sans">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Link href={`/${locale}/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500">
              <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian/30" />
                <span className="absolute top-5 left-5 bg-gold-500 text-white text-[10px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                  Featured
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-neutral-50 dark:bg-neutral-900">
                <span className="inline-flex items-center gap-1.5 text-gold-500 text-xs font-sans tracking-widest uppercase mb-4">
                  <Tag size={10} /> {featured.tag}
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-[#0A0A0A] dark:text-white mb-4 leading-tight group-hover:text-gold-500 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-neutral-500 font-sans leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-neutral-400 font-sans">
                    <span className="flex items-center gap-1"><Calendar size={10}/> {featured.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10}/> {featured.readTime}</span>
                  </div>
                  <span className="flex items-center gap-2 text-gold-500 text-xs font-sans tracking-widest uppercase group-hover:gap-4 transition-all duration-300">
                    {t("readMore")} <ArrowRight size={12}/>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
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
                  <span className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-sans">
                    <span className="flex items-center gap-1"><Calendar size={10}/> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10}/> {post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-xl text-[#0A0A0A] dark:text-white leading-snug group-hover:text-gold-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-sans leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-neutral-400 font-sans">{t("author")} {post.author}</span>
                    <span className="flex items-center gap-1 text-gold-500 text-xs font-sans tracking-widest uppercase group-hover:gap-3 transition-all duration-300">
                      {t("readMore")} →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
