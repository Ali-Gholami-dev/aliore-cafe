"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Clock } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  const links = [
    { key: "menu", href: "/menu" },
    { key: "about", href: "/about" },
    { key: "reservation", href: "/reservation" },
    { key: "gallery", href: "/gallery" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] dark:bg-neutral-950 text-white overflow-hidden">
      {/* Decorative top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Gold particle accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-gold-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-display text-3xl font-light tracking-[0.2em]">ALIORE</span>
              <div className="text-[10px] tracking-[0.5em] text-gold-500 uppercase font-sans font-medium mt-0.5">
                CAFÉ
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed font-sans mb-6">
              {t("tagline")}
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: "#C9A84C" }}
                  className="w-9 h-9 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:border-gold-500 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase font-sans font-medium mb-6">
              {t("links.title")}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-neutral-400 hover:text-gold-400 text-sm font-sans transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold-500 group-hover:w-4 transition-all duration-300" />
                    {tn(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase font-sans font-medium mb-6 flex items-center gap-2">
              <Clock size={12} />
              {t("hours.title")}
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400 font-sans">
              <li className="flex justify-between gap-4">
                <span>Mon – Fri</span>
                <span className="text-neutral-300">7:30 – 23:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Saturday</span>
                <span className="text-neutral-300">8:00 – 00:00</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span>
                <span className="text-neutral-300">9:00 – 22:00</span>
              </li>
            </ul>

            <div className="mt-6 space-y-2 text-sm text-neutral-400 font-sans">
              <a href="mailto:hello@aliore.cafe" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Mail size={13} />
                hello@aliore.cafe
              </a>
              <a href="tel:+33142960000" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Phone size={13} />
                +33 1 42 96 00 00
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-1 shrink-0" />
                <span>12 Rue de la Paix, 75001 Paris</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase font-sans font-medium mb-6">
              {t("newsletter.title")}
            </h4>
            <p className="text-neutral-400 text-sm font-sans mb-4">
              {t("newsletter.desc")}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white placeholder:text-neutral-500 text-sm px-4 py-3 rounded-none outline-none transition-colors font-sans"
              />
              <button
                type="submit"
                className="btn-gold text-xs py-3 w-full justify-center"
              >
                {t("newsletter.cta")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-xs font-sans">{t("copyright")}</p>
          <div className="flex gap-6">
            <Link href="#" className="text-neutral-500 hover:text-gold-400 text-xs font-sans transition-colors">
              {t("privacy")}
            </Link>
            <Link href="#" className="text-neutral-500 hover:text-gold-400 text-xs font-sans transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
