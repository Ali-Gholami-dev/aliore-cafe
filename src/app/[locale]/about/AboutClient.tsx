"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart, Award, Leaf, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

const TEAM = [
  { name: "Alexandre Moreau", role: "Executive Chef & Founder", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80" },
  { name: "Sophie Laurent", role: "Head Pastry Chef", image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&q=80" },
  { name: "Marco Bianchi", role: "Head Barista & Coffee Director", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Amara Diallo", role: "Sommelier", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
];

const VALUES = [
  { icon: Award,  key: "quality", title: "Uncompromising Quality",  desc: "Only the finest ingredients make it to your table. We taste, source and reject until perfection remains." },
  { icon: Heart,  key: "craft",   title: "Artisan Craft",           desc: "Every dish is made from scratch, by hand, with care. No shortcuts, no compromises, no exceptions." },
  { icon: Users,  key: "warmth",  title: "Genuine Warmth",          desc: "You are our guest, not our customer. We remember your name, your preferences, your story." },
  { icon: Leaf,   key: "soul",    title: "Soulful Food",            desc: "We cook with emotion, not just technique. Every plate carries a piece of our passion." },
];

export default function AboutClient({ locale: _locale }: { locale: Locale }) {
  const t = useTranslations("about");
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  const missionInView = useInView(missionRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* Cinematic Hero */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center">
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
            alt="Aliore Café interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
        </motion.div>
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 max-w-2xl"
          >
            <div className="section-label">Est. 2019</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight">
              {t("title")}
            </h1>
            <p className="text-neutral-300 font-sans text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission */}
      <section ref={missionRef} className="py-24 lg:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9 }}
              className="space-y-6"
            >
              <div className="section-label">{t("mission.title")}</div>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0A0A0A] dark:text-white leading-tight">
                A Decade of Crafting Extraordinary Moments
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-sans text-lg leading-relaxed">
                {t("mission.content")}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="h-px flex-1 max-w-[60px] bg-gold-500" />
                <p className="text-neutral-400 font-sans text-sm italic">
                  &ldquo;Excellence is not a destination. It is a daily choice.&rdquo;
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", cls: "col-span-1 h-48 lg:h-64" },
                { src: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80", cls: "col-span-1 h-48 lg:h-64" },
                { src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80", cls: "col-span-2 h-48 lg:h-56" },
              ].map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-xl ${img.cls}`}>
                  <Image src={img.src} alt="Aliore ambiance" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-label justify-center mb-4">Our Journey</div>
            <h2 className="font-display text-4xl font-light text-[#0A0A0A] dark:text-white">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500 via-gold-500/50 to-transparent -translate-x-1/2" />
            {[
              { year: "2019", title: "Aliore Opens", desc: "Chef Alexandre opens the first Aliore Café on Rue de la Paix, Paris, with 8 tables and a dream." },
              { year: "2020", title: "Bib Gourmand", desc: "Michelin Guide awards Aliore its first Bib Gourmand recognition — a validation of our philosophy." },
              { year: "2021", title: "Coffee Programme", desc: "We launch our specialty coffee programme, sourcing directly from altitude estates across Ethiopia and Colombia." },
              { year: "2022", title: "Private Dining Room", desc: "The Aliore Private Room opens — 30 seats, fully bespoke menus, for life's most important occasions." },
              { year: "2023", title: "Online Ordering", desc: "We bring Aliore home. Our delivery programme launches, bringing fine dining to your door." },
              { year: "2024", title: "Expansion", desc: "Aliore announces its second location — the story continues." },
            ].map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`relative flex items-center mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-[calc(50%-28px)] ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="text-gold-500 font-display text-2xl mb-1">{item.year}</div>
                  <h3 className="font-heading text-[#0A0A0A] dark:text-white text-base mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-sm font-sans leading-relaxed">{item.desc}</p>
                </div>
                <div className="relative z-10 w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full border-2 border-gold-500 bg-white dark:bg-[#0A0A0A]" />
                </div>
                <div className="w-[calc(50%-28px)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-24 lg:py-36 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="section-label justify-center mb-4">{t("values.title")}</div>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0A0A0A] dark:text-white">
              What We Stand For
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, key, title, desc }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group p-8 border border-neutral-100 dark:border-neutral-800 rounded-2xl hover:border-gold-500/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                  <Icon size={20} className="text-gold-500" />
                </div>
                <h3 className="font-heading text-lg text-[#0A0A0A] dark:text-white mb-3">{title}</h3>
                <p className="text-neutral-400 text-sm font-sans leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-24 lg:py-36 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="section-label justify-center mb-4">{t("team.title")}</div>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#0A0A0A] dark:text-white">
              {t("team.subtitle")}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group text-center"
              >
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-heading text-base text-[#0A0A0A] dark:text-white">{member.name}</h3>
                <p className="text-gold-500 text-xs font-sans tracking-widest uppercase mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
