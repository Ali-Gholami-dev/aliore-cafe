"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Sun, Moon, Globe, ChevronDown, User } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useSession, signOut } from "next-auth/react";
import { type Locale, localeNames, localeFlags, locales } from "@/lib/i18n/config";
import CartDrawer from "@/components/ui/CartDrawer";

interface NavbarProps { locale: Locale; }

const navLinks = [
  { key: "menu",        href: "/menu"        },
  { key: "about",       href: "/about"       },
  { key: "reservation", href: "/reservation" },
  { key: "gallery",     href: "/gallery"     },
  { key: "blog",        href: "/blog"        },
  { key: "contact",     href: "/contact"     },
];

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const { theme, toggle } = useTheme();
  const { count, toggle: toggleCart } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) => pathname.includes(href.replace("/", ""));

  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ── Logo + Brand ── */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              {/* SVG icon — no bad animation, just a clean opacity hover */}
              <div className="w-9 h-9 flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                <Image
                  src="/logo.svg"
                  alt="Aliore Café logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>
              {/* Wordmark — no letterSpacing animation */}
              <div className="flex flex-col items-start leading-none">
                <span className="font-display text-2xl font-light tracking-[0.15em] text-[#0A0A0A] dark:text-white group-hover:text-[#C9A84C] dark:group-hover:text-[#C9A84C] transition-colors duration-300">
                  ALIORE
                </span>
                <span className="text-[9px] tracking-[0.4em] text-[#C9A84C] uppercase font-sans font-medium">
                  CAFÉ
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  className={`relative text-sm tracking-widest font-sans uppercase transition-colors duration-300 group ${
                    isActive(link.href)
                      ? "text-[#C9A84C]"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-[#C9A84C] dark:hover:text-[#C9A84C]"
                  }`}
                >
                  {t(link.key)}
                  <span className={`absolute -bottom-1 left-0 h-px bg-[#C9A84C] transition-all duration-300 ${
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
            </div>

            {/* ── Right actions ── */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark"
                      ? <Sun size={17} className="text-[#C9A84C]" />
                      : <Moon size={17} className="text-neutral-600" />
                    }
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Globe size={15} className="text-neutral-500 dark:text-neutral-400" />
                  <span className="text-xs font-sans uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    {locale}
                  </span>
                  <ChevronDown size={11} className="text-neutral-400" />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden"
                    >
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { switchLocale(loc); setLangOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors ${
                            loc === locale
                              ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <span>{localeFlags[loc]}</span>
                          <span>{localeNames[loc]}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag size={17} className="text-neutral-600 dark:text-neutral-300" />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </button>

              {/* User / Login */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-[#C9A84C] transition-colors"
                  >
                    <User size={14} className="text-neutral-600 dark:text-neutral-300" />
                    <span className="text-sm font-sans text-neutral-600 dark:text-neutral-300 max-w-[80px] truncate">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden"
                      >
                        <Link href={`/${locale}/dashboard`} onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                          {t("dashboard")}
                        </Link>
                        {(session.user as { role?: string })?.role === "ADMIN" && (
                          <Link href={`/${locale}/admin`} onClick={() => setUserOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-[#C9A84C] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                            {t("admin")}
                          </Link>
                        )}
                        <div className="border-t border-neutral-100 dark:border-neutral-800" />
                        <button
                          onClick={() => signOut({ callbackUrl: `/${locale}` })}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                        >
                          {t("logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href={`/${locale}/auth/login`}
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-[#C9A84C] text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-[#B8963C] transition-colors">
                  {t("login")}
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {mobileOpen
                  ? <X size={20} className="text-neutral-600 dark:text-neutral-300" />
                  : <Menu size={20} className="text-neutral-600 dark:text-neutral-300" />
                }
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white dark:bg-[#0A0A0A] flex flex-col pt-24 px-8 pb-12"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/${locale}${link.href}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-4 font-display text-3xl font-light border-b border-neutral-100 dark:border-neutral-800 transition-colors ${
                      isActive(link.href) ? "text-[#C9A84C]" : "text-[#0A0A0A] dark:text-white"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              {!session && (
                <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white font-sans font-medium tracking-widest text-sm uppercase hover:bg-[#B8963C] transition-colors">
                  {t("login")}
                </Link>
              )}
              <div className="flex gap-2 flex-wrap">
                {locales.map((loc) => (
                  <button key={loc} onClick={() => { switchLocale(loc); setMobileOpen(false); }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      loc === locale
                        ? "border-[#C9A84C] text-[#C9A84C]"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-500"
                    }`}>
                    {localeFlags[loc]} {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer locale={locale} />
    </>
  );
}
