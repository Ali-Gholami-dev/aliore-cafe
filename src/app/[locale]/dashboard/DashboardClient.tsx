"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard, Calendar, ShoppingBag, Heart,
  User, Edit3, XCircle, CheckCircle, Clock,
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const MOCK_RESERVATIONS = [
  { id: "r1", date: "2025-03-15", time: "19:30", guests: 2, table: "Table 4 · Indoor",   status: "CONFIRMED", code: "ALC7X9" },
  { id: "r2", date: "2025-04-14", time: "20:00", guests: 4, table: "Table 15 · Private", status: "PENDING",   code: "BLM2K4" },
  { id: "r3", date: "2024-12-25", time: "18:30", guests: 2, table: "Table 8 · Terrace",  status: "COMPLETED", code: "DRX5P1" },
];

const MOCK_ORDERS = [
  { id: "o1", date: "2025-01-10", items: ["Truffle Risotto", "Crème Brûlée", "Espresso"], total: 62, status: "DELIVERED" },
  { id: "o2", date: "2024-12-30", items: ["Seared Salmon", "Negroni Bianco"],             total: 50, status: "DELIVERED" },
];

const MOCK_FAVOURITES = [
  { id: "m4",  name: "Truffle Risotto",  price: 38, category: "Dinner"  },
  { id: "m7",  name: "Signature Espresso", price: 8, category: "Coffee" },
  { id: "m10", name: "Crème Brûlée",     price: 16, category: "Desserts"},
];

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  PENDING:   "bg-amber-500/10  text-amber-400  border border-amber-500/20",
  COMPLETED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
  CANCELLED: "bg-red-500/10    text-red-400    border border-red-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

type Tab = "overview" | "reservations" | "orders" | "favorites" | "profile";

export default function DashboardClient({ locale }: { locale: Locale }) {
  const t               = useTranslations("dashboard");
  const { data: session, status } = useSession();
  const router          = useRouter();
  const [tab, setTab]   = useState<Tab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/login`);
    }
  }, [status, locale, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const NAV_ITEMS: { key: Tab; icon: React.ElementType; label: string }[] = [
    { key: "overview",     icon: LayoutDashboard, label: t("nav.overview")     },
    { key: "reservations", icon: Calendar,        label: t("nav.reservations") },
    { key: "orders",       icon: ShoppingBag,     label: t("nav.orders")       },
    { key: "favorites",    icon: Heart,           label: t("nav.favorites")    },
    { key: "profile",      icon: User,            label: t("nav.profile")      },
  ];

  const upcoming = MOCK_RESERVATIONS.find(r => r.status !== "COMPLETED");

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden sticky top-28"
            >
              {/* User info */}
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-gradient-to-br from-gold-500/5 to-transparent">
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center mb-3 text-2xl font-display text-gold-500 font-light">
                  {session?.user?.name?.[0] ?? "A"}
                </div>
                <div className="font-heading text-[#0A0A0A] dark:text-white text-sm">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-neutral-400 font-sans mt-0.5">
                  {session?.user?.email}
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all ${
                      tab === key
                        ? "bg-gold-500/10 text-gold-500 font-medium"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-6">

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="font-display text-3xl text-[#0A0A0A] dark:text-white">
                  Welcome back, {session?.user?.name?.split(" ")[0]} ✦
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar,    label: "Reservations", value: MOCK_RESERVATIONS.length },
                    { icon: ShoppingBag, label: "Orders",       value: MOCK_ORDERS.length       },
                    { icon: Heart,       label: "Favourites",   value: MOCK_FAVOURITES.length   },
                    { icon: CheckCircle, label: "Completed",    value: 1                        },
                  ].map(s => (
                    <div key={s.label} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-all duration-300">
                      <s.icon size={20} className="text-gold-500 mb-3" />
                      <div className="font-display text-3xl text-[#0A0A0A] dark:text-white">{s.value}</div>
                      <div className="text-neutral-400 text-xs font-sans mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Upcoming reservation */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
                  <h2 className="font-heading text-lg text-[#0A0A0A] dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-gold-500" /> Upcoming Reservation
                  </h2>
                  {upcoming ? (
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="font-heading text-[#0A0A0A] dark:text-white">{upcoming.table}</div>
                        <div className="text-neutral-400 text-sm font-sans mt-1">
                          {upcoming.date} at {upcoming.time} · {upcoming.guests} guests
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-sans font-medium px-3 py-1 rounded-full ${STATUS_BADGE[upcoming.status]}`}>
                          {upcoming.status}
                        </span>
                        <span className="text-xs text-neutral-400 font-sans">#{upcoming.code}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-400 font-sans text-sm">No upcoming reservations.</p>
                  )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    href={`/${locale}/reservation`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-white font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-gold-600"
                  >
                    Make a Reservation
                  </Link>
                  <Link
                    href={`/${locale}/menu`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold-500 text-gold-500 font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-gold-500 hover:text-white"
                  >
                    Order Online
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── RESERVATIONS ── */}
            {tab === "reservations" && (
              <motion.div key="reservations" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-[#0A0A0A] dark:text-white">{t("nav.reservations")}</h2>
                  <Link
                    href={`/${locale}/reservation`}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-600 transition-colors"
                  >
                    + New
                  </Link>
                </div>
                {MOCK_RESERVATIONS.map(r => (
                  <div key={r.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="font-heading text-[#0A0A0A] dark:text-white">{r.table}</div>
                        <div className="text-neutral-400 text-sm font-sans mt-1">
                          {r.date} · {r.time} · {r.guests} guests
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-sans font-medium px-3 py-1 rounded-full ${STATUS_BADGE[r.status]}`}>
                          {r.status}
                        </span>
                        {r.status === "CONFIRMED" || r.status === "PENDING" ? (
                          <button
                            className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            title="Cancel"
                          >
                            <XCircle size={15} />
                          </button>
                        ) : null}
                        <button
                          className="p-1.5 text-neutral-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-50 dark:border-neutral-800 flex items-center gap-2">
                      <span className="text-xs text-neutral-400 font-sans">
                        Confirmation: <strong className="text-gold-500">{r.code}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── ORDERS ── */}
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-[#0A0A0A] dark:text-white">{t("nav.orders")}</h2>
                  <Link
                    href={`/${locale}/menu`}
                    className="inline-flex items-center gap-2 px-5 py-2 border border-gold-500 text-gold-500 font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-500 hover:text-white transition-all"
                  >
                    Order Again
                  </Link>
                </div>
                {MOCK_ORDERS.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-12 text-center">
                    <ShoppingBag size={40} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
                    <p className="text-neutral-400 font-sans text-sm">No orders yet.</p>
                  </div>
                ) : (
                  MOCK_ORDERS.map(o => (
                    <div key={o.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <div className="text-xs text-neutral-400 font-sans mb-2">{o.date}</div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {o.items.map(item => (
                              <span key={item} className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-sans px-2.5 py-1 rounded-full">
                                {item}
                              </span>
                            ))}
                          </div>
                          <div className="font-display text-lg text-[#0A0A0A] dark:text-white">${o.total.toFixed(2)}</div>
                        </div>
                        <span className={`text-xs font-sans font-medium px-3 py-1 rounded-full flex-shrink-0 ${STATUS_BADGE[o.status]}`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* ── FAVOURITES ── */}
            {tab === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h2 className="font-display text-2xl text-[#0A0A0A] dark:text-white">{t("nav.favorites")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {MOCK_FAVOURITES.map(item => (
                    <div key={item.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col gap-3">
                      <div>
                        <div className="text-[10px] tracking-widest text-gold-500 uppercase font-sans font-medium mb-1">{item.category}</div>
                        <div className="font-heading text-[#0A0A0A] dark:text-white">{item.name}</div>
                        <div className="font-display text-lg text-gold-500 mt-1">${item.price}</div>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gold-500/30 text-gold-500 text-xs font-sans font-medium tracking-widest uppercase rounded-full hover:bg-gold-500 hover:text-white transition-all">
                        + Add to Order
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── PROFILE ── */}
            {tab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-[#0A0A0A] dark:text-white">{t("nav.profile")}</h2>
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 space-y-5">
                  {[
                    { label: "Full Name",  defaultValue: session?.user?.name  ?? "", type: "text"  },
                    { label: "Email",      defaultValue: session?.user?.email ?? "", type: "email" },
                    { label: "Phone",      defaultValue: "",                          type: "tel"   },
                  ].map(f => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{f.label}</label>
                      <input
                        type={f.type}
                        defaultValue={f.defaultValue}
                        className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors text-[#0A0A0A] dark:text-white"
                      />
                    </div>
                  ))}
                  <div className="pt-2">
                    <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Change password */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 space-y-5">
                  <h3 className="font-heading text-[#0A0A0A] dark:text-white">Change Password</h3>
                  {["Current Password", "New Password", "Confirm New Password"].map(f => (
                    <div key={f} className="space-y-1.5">
                      <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{f}</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  ))}
                  <button className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-500 text-gold-500 font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-500 hover:text-white transition-all">
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
