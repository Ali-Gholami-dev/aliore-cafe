"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, UtensilsCrossed, MapPin, ShoppingBag,
  FileText, Image as ImageIcon, Star, Users, Settings, TrendingUp, DollarSign,
  Plus, Edit3, Trash2, BarChart3, CheckCircle, AlertCircle, X,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import type { Locale } from "@/lib/i18n/config";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const REVENUE_DATA = [
  { month: "Jul", revenue: 28400, covers: 312 },
  { month: "Aug", revenue: 32100, covers: 348 },
  { month: "Sep", revenue: 29800, covers: 325 },
  { month: "Oct", revenue: 35200, covers: 381 },
  { month: "Nov", revenue: 38600, covers: 420 },
  { month: "Dec", revenue: 45800, covers: 498 },
  { month: "Jan", revenue: 31200, covers: 337 },
];

const CATEGORY_DATA = [
  { name: "Dinner", value: 42, color: "#C9A84C" },
  { name: "Lunch",  value: 28, color: "#E8D48A" },
  { name: "Coffee", value: 18, color: "#9A7D2C" },
  { name: "Other",  value: 12, color: "#5E4B10" },
];

const RECENT_RESERVATIONS = [
  { name: "Isabelle Fontaine", date: "2025-03-15", time: "19:30", table: "T4 · Indoor",   guests: 2, status: "CONFIRMED" },
  { name: "Marcus Klein",      date: "2025-03-15", time: "20:00", table: "T15 · Private", guests: 6, status: "PENDING"   },
  { name: "Yuki Tanaka",       date: "2025-03-16", time: "18:30", table: "T8 · Terrace",  guests: 2, status: "CONFIRMED" },
  { name: "Arash Karimi",      date: "2025-03-16", time: "19:00", table: "T3 · Indoor",   guests: 4, status: "CONFIRMED" },
];

const MOCK_TABLES = [
  { id: "t1",  number: 1,  zone: "Indoor",  capacity: 2,  status: "AVAILABLE",   pricePerSeat: 0  },
  { id: "t3",  number: 3,  zone: "Indoor",  capacity: 4,  status: "RESERVED",    pricePerSeat: 0  },
  { id: "t5",  number: 5,  zone: "Indoor",  capacity: 2,  status: "OCCUPIED",    pricePerSeat: 0  },
  { id: "t8",  number: 8,  zone: "Terrace", capacity: 2,  status: "AVAILABLE",   pricePerSeat: 5  },
  { id: "t10", number: 10, zone: "Terrace", capacity: 4,  status: "RESERVED",    pricePerSeat: 5  },
  { id: "t12", number: 12, zone: "Bar",     capacity: 2,  status: "AVAILABLE",   pricePerSeat: 0  },
  { id: "t15", number: 15, zone: "Private", capacity: 10, status: "AVAILABLE",   pricePerSeat: 15 },
];

const MOCK_USERS = [
  { name: "Admin Aliore",      email: "admin@aliore.cafe",      role: "ADMIN",    joined: "2019-01-01" },
  { name: "Isabelle Fontaine", email: "i.fontaine@lefigaro.fr", role: "CUSTOMER", joined: "2024-06-12" },
  { name: "Marcus Klein",      email: "marcus@example.com",     role: "CUSTOMER", joined: "2024-09-03" },
  { name: "Yuki Tanaka",       email: "yuki.t@travel.blog",     role: "CUSTOMER", joined: "2024-11-18" },
  { name: "Arash Karimi",      email: "arash@example.com",      role: "CUSTOMER", joined: "2025-01-05" },
];

const MOCK_MENU = [
  { id: "m1",  name: "Truffle Risotto",    cat: "Dinner",   price: 38, featured: true,  available: true  },
  { id: "m2",  name: "Beef Tenderloin",    cat: "Dinner",   price: 58, featured: true,  available: true  },
  { id: "m3",  name: "Signature Espresso", cat: "Coffee",   price: 8,  featured: true,  available: true  },
  { id: "m4",  name: "Crème Brûlée",       cat: "Desserts", price: 16, featured: true,  available: true  },
  { id: "m5",  name: "Seared Salmon",      cat: "Lunch",    price: 34, featured: false, available: true  },
  { id: "m6",  name: "Matcha Latte",       cat: "Coffee",   price: 10, featured: false, available: false },
];

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED:  "bg-emerald-500/10 text-emerald-400",
  PENDING:    "bg-amber-500/10  text-amber-400",
  CANCELLED:  "bg-red-500/10    text-red-400",
  COMPLETED:  "bg-neutral-500/10 text-neutral-400",
  AVAILABLE:  "bg-emerald-500/10 text-emerald-400",
  RESERVED:   "bg-amber-500/10  text-amber-400",
  OCCUPIED:   "bg-red-500/10    text-red-400",
  MAINTENANCE:"bg-neutral-500/10 text-neutral-400",
};

type AdminTab =
  | "overview" | "reservations" | "menu" | "tables"
  | "orders"   | "blog"         | "gallery" | "testimonials"
  | "users"    | "settings";

export default function AdminClient({ locale }: { locale: Locale }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/login`);
    } else if (
      status === "authenticated" &&
      (session?.user as { role?: string })?.role !== "ADMIN"
    ) {
      router.push(`/${locale}/dashboard`);
    }
  }, [status, session, locale, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const NAV: { key: AdminTab; icon: React.ElementType; label: string }[] = [
    { key: "overview",      icon: LayoutDashboard, label: "Overview"     },
    { key: "reservations",  icon: Calendar,        label: "Reservations" },
    { key: "menu",          icon: UtensilsCrossed, label: "Menu"         },
    { key: "tables",        icon: MapPin,          label: "Tables"       },
    { key: "orders",        icon: ShoppingBag,     label: "Orders"       },
    { key: "blog",          icon: FileText,        label: "Blog"         },
    { key: "gallery",       icon: ImageIcon,           label: "Gallery"      },
    { key: "testimonials",  icon: Star,            label: "Testimonials" },
    { key: "users",         icon: Users,           label: "Users"        },
    { key: "settings",      icon: Settings,        label: "Settings"     },
  ];

  const STATS = [
    { icon: DollarSign, label: "Revenue (Jan)",   value: "$31,200", change: "+8.2%",  up: true  },
    { icon: Calendar,   label: "Reservations",    value: "337",     change: "+12%",   up: true  },
    { icon: Users,      label: "Customers",       value: "1,284",   change: "+5.1%",  up: true  },
    { icon: TrendingUp, label: "Avg Order Value", value: "$48",     change: "+2.3%",  up: true  },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-20">
      <div className="flex">

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="fixed left-0 top-20 bottom-0 w-60 bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 overflow-y-auto hidden lg:block z-20">
          <div className="p-4">
            <div className="px-3 py-3 mb-4">
              <div className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-sans font-medium">Admin Panel</div>
              <div className="text-xs text-neutral-400 font-sans mt-0.5 truncate">{session?.user?.name}</div>
            </div>
            <nav className="space-y-0.5">
              {NAV.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-all ${
                    tab === key
                      ? "bg-gold-500/10 text-gold-500 font-medium"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile tab bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex overflow-x-auto no-scrollbar">
          {NAV.slice(0, 5).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-1 px-4 py-3 min-w-[64px] text-[10px] font-sans transition-colors ${
                tab === key ? "text-gold-500" : "text-neutral-400"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Main Content ──────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-display text-3xl text-[#0A0A0A] dark:text-white">Dashboard</h1>
                <div className="text-xs text-neutral-400 font-sans">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(s => (
                  <div key={s.label} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <s.icon size={18} className="text-gold-500" />
                      <span className={`text-xs font-sans font-semibold ${s.up ? "text-emerald-500" : "text-red-500"}`}>{s.change}</span>
                    </div>
                    <div className="font-display text-3xl text-[#0A0A0A] dark:text-white mb-1">{s.value}</div>
                    <div className="text-neutral-400 text-xs font-sans">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-heading text-[#0A0A0A] dark:text-white">Revenue Overview</h2>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5">Last 7 months</p>
                    </div>
                    <BarChart3 size={16} className="text-gold-500" />
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px", fontSize: 12 }}
                        formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#goldGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
                  <h2 className="font-heading text-[#0A0A0A] dark:text-white mb-6">Sales by Category</h2>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={72} paddingAngle={3} dataKey="value">
                        {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {CATEGORY_DATA.map(c => (
                      <div key={c.name} className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                          <span className="text-neutral-500">{c.name}</span>
                        </div>
                        <span className="text-[#0A0A0A] dark:text-white font-medium">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Covers bar chart */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
                <h2 className="font-heading text-[#0A0A0A] dark:text-white mb-6">Covers per Month</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={REVENUE_DATA} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: 11 }} />
                    <Bar dataKey="covers" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Reservations table */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading text-[#0A0A0A] dark:text-white">Recent Reservations</h2>
                  <button onClick={() => setTab("reservations")} className="text-gold-500 text-xs font-sans tracking-widest uppercase hover:text-gold-400 transition-colors">
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800">
                        {["Guest", "Date", "Time", "Table", "Guests", "Status"].map(h => (
                          <th key={h} className="text-left py-3 px-2 text-xs tracking-widest uppercase text-neutral-400 font-sans font-medium first:pl-0">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_RESERVATIONS.map((r, i) => (
                        <tr key={i} className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 pl-0 font-heading text-[#0A0A0A] dark:text-white text-sm">{r.name}</td>
                          <td className="py-3 px-2 text-neutral-400 font-sans text-xs">{r.date}</td>
                          <td className="py-3 px-2 text-neutral-400 font-sans text-xs">{r.time}</td>
                          <td className="py-3 px-2 text-neutral-400 font-sans text-xs">{r.table}</td>
                          <td className="py-3 px-2 text-neutral-400 font-sans text-xs text-center">{r.guests}</td>
                          <td className="py-3 px-2">
                            <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESERVATIONS ── */}
          {tab === "reservations" && (
            <motion.div key="reservations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white">Reservations</h2>
                <div className="flex gap-2">
                  {["All", "Confirmed", "Pending", "Completed"].map(f => (
                    <button key={f} className="px-3 py-1.5 rounded-full text-xs font-sans border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-gold-500 hover:text-gold-500 transition-colors">
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      {["Guest", "Date", "Time", "Table", "Guests", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left py-3.5 px-4 text-xs tracking-widest uppercase text-neutral-400 font-sans font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_RESERVATIONS.map((r, i) => (
                      <tr key={i} className="border-t border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-heading text-[#0A0A0A] dark:text-white">{r.name}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{r.date}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{r.time}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{r.table}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs text-center">{r.guests}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 text-neutral-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10"><Edit3 size={13} /></button>
                            <button className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"><X size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── MENU ── */}
          {tab === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white">Menu Items</h2>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-600 transition-colors">
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      {["Name", "Category", "Price", "Featured", "Available", "Actions"].map(h => (
                        <th key={h} className="text-left py-3.5 px-4 text-xs tracking-widest uppercase text-neutral-400 font-sans font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_MENU.map(item => (
                      <tr key={item.id} className="border-t border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-heading text-[#0A0A0A] dark:text-white">{item.name}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{item.cat}</td>
                        <td className="py-3.5 px-4 text-gold-500 font-display">${item.price}</td>
                        <td className="py-3.5 px-4">
                          {item.featured
                            ? <span className="text-[10px] bg-gold-500/10 text-gold-500 px-2.5 py-1 rounded-full font-sans font-semibold">Yes</span>
                            : <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-2.5 py-1 rounded-full font-sans">No</span>
                          }
                        </td>
                        <td className="py-3.5 px-4">
                          {item.available
                            ? <CheckCircle size={14} className="text-emerald-500" />
                            : <X size={14} className="text-red-400" />
                          }
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 text-neutral-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10"><Edit3 size={13} /></button>
                            <button className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── TABLES ── */}
          {tab === "tables" && (
            <motion.div key="tables" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white">Table Management</h2>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-600 transition-colors">
                  <Plus size={14} /> Add Table
                </button>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm font-sans text-amber-600 dark:text-amber-400 flex items-start gap-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                Adding or removing a table here automatically updates the interactive floor map in the reservation flow. Chairs and shapes are generated procedurally based on capacity and zone.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MOCK_TABLES.map(t => (
                  <div key={t.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-heading text-[#0A0A0A] dark:text-white">Table {t.number}</div>
                        <div className="text-xs text-gold-500 font-sans mt-0.5">{t.zone}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-neutral-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10"><Edit3 size={13} /></button>
                        <button className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs font-sans text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Users size={11} className="text-neutral-300" />
                        {t.capacity} seats
                      </div>
                      {t.pricePerSeat > 0 && (
                        <div className="text-gold-500">${t.pricePerSeat}/seat deposit</div>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[t.status] ?? "bg-neutral-100 text-neutral-400"}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Add table card */}
                <button className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-gold-500 hover:text-gold-500 transition-all duration-300 min-h-[160px]">
                  <Plus size={24} />
                  <span className="text-xs font-sans tracking-widest uppercase">Add Table</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white">Users</h2>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                    <tr>
                      {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                        <th key={h} className="text-left py-3.5 px-4 text-xs tracking-widest uppercase text-neutral-400 font-sans font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_USERS.map((u, i) => (
                      <tr key={i} className="border-t border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-heading text-[#0A0A0A] dark:text-white">{u.name}</td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-sans font-semibold px-2.5 py-1 rounded-full ${
                            u.role === "ADMIN"
                              ? "bg-gold-500/10 text-gold-500"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 font-sans text-xs">{u.joined}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 text-neutral-400 hover:text-gold-400 transition-colors rounded-lg hover:bg-gold-500/10"><Edit3 size={13} /></button>
                            <button className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── GENERIC PLACEHOLDER for blog / gallery / testimonials / orders / settings ── */}
          {!["overview", "reservations", "menu", "tables", "users"].includes(tab) && (
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white capitalize">{tab}</h2>
                {tab !== "settings" && (
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white font-sans font-medium tracking-widest text-xs uppercase hover:bg-gold-600 transition-colors">
                    <Plus size={14} /> Add New
                  </button>
                )}
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-16 text-center">
                <LayoutDashboard size={48} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-4" />
                <p className="text-neutral-400 font-sans text-sm max-w-sm mx-auto">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} management panel — connect your database and this panel populates with live data from your Prisma schema.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-emerald-500 text-xs font-sans">
                  <CheckCircle size={12} /> Schema & API routes are production-ready
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
