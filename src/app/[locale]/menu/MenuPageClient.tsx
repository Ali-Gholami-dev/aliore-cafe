"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, Filter, Flame, Leaf, Clock, Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { useCart } from "@/components/providers/CartProvider";

interface MenuPageClientProps { locale: Locale; }

const CATEGORIES = ["all","breakfast","lunch","dinner","coffee","desserts","drinks"] as const;
type Category = typeof CATEGORIES[number];

const MENU_ITEMS = [
  { id:"m1", name:"Croque Monsieur", cat:"breakfast", price:14, desc:"Gruyère, jambon, béchamel, sourdough", img:"https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80", vegan:false, gf:false, cal:480, prep:12, featured:false },
  { id:"m2", name:"Avocado Toast", cat:"breakfast", price:16, desc:"Smashed avocado, poached egg, dukkah, sourdough", img:"https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80", vegan:false, gf:false, cal:390, prep:10, featured:false },
  { id:"m3", name:"Granola Bowl", cat:"breakfast", price:13, desc:"Coconut yoghurt, seasonal fruits, house granola", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", vegan:true, gf:true, cal:320, prep:5, featured:false },
  { id:"m4", name:"Truffle Risotto", cat:"dinner", price:38, desc:"Aged parmesan, black truffle, wild mushroom", img:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80", vegan:false, gf:true, cal:520, prep:25, featured:true },
  { id:"m5", name:"Seared Salmon", cat:"lunch", price:34, desc:"Butter-basted, fennel purée, citrus beurre blanc", img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80", vegan:false, gf:true, cal:480, prep:20, featured:true },
  { id:"m6", name:"Burrata Salad", cat:"lunch", price:22, desc:"Heritage tomatoes, basil oil, aged balsamic", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", vegan:false, gf:true, cal:280, prep:8, featured:false },
  { id:"m7", name:"Signature Espresso", cat:"coffee", price:8, desc:"Ethiopian single-origin, volcanic stone filtered", img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", vegan:true, gf:true, cal:10, prep:5, featured:true },
  { id:"m8", name:"Gold Flat White", cat:"coffee", price:9, desc:"House blend, micro-foam, gold-dusted", img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", vegan:false, gf:true, cal:90, prep:5, featured:false },
  { id:"m9", name:"Matcha Latte", cat:"coffee", price:10, desc:"Ceremonial grade matcha, oat milk, honey", img:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80", vegan:true, gf:true, cal:120, prep:5, featured:false },
  { id:"m10", name:"Crème Brûlée", cat:"desserts", price:16, desc:"Madagascar vanilla, caramelised demerara, gold leaf", img:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80", vegan:false, gf:true, cal:340, prep:15, featured:true },
  { id:"m11", name:"Dark Chocolate Fondant", cat:"desserts", price:18, desc:"Valrhona 72%, salted caramel, vanilla ice cream", img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80", vegan:false, gf:false, cal:520, prep:12, featured:false },
  { id:"m12", name:"Negroni Bianco", cat:"drinks", price:16, desc:"Hendrick's gin, Lillet Blanc, white vermouth", img:"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80", vegan:true, gf:true, cal:180, prep:3, featured:false },
  { id:"m13", name:"Beef Tenderloin", cat:"dinner", price:58, desc:"Aged 45 days, truffle jus, pomme purée", img:"https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", vegan:false, gf:true, cal:680, prep:30, featured:true },
  { id:"m14", name:"Champagne Cocktail", cat:"drinks", price:24, desc:"Veuve Clicquot, Grand Marnier, Angostura bitters", img:"https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&q=80", vegan:true, gf:true, cal:150, prep:3, featured:false },
];

export default function MenuPageClient({ locale }: MenuPageClientProps) {
  const t = useTranslations("menu");
  const { add } = useCart();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category>("all");
  const [veganOnly, setVeganOnly] = useState(false);
  const [gfOnly, setGfOnly] = useState(false);

  const filtered = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchCat = cat === "all" || item.cat === cat;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
      const matchVegan = !veganOnly || item.vegan;
      const matchGF = !gfOnly || item.gf;
      return matchCat && matchSearch && matchVegan && matchGF;
    });
  }, [cat, search, veganOnly, gfOnly]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-28">
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />
        <div className="relative z-10">
          <div className="section-label justify-center mb-4">Our Offerings</div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-4">{t("title")}</h1>
          <p className="text-neutral-400 font-sans text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-800 px-4 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-full text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-xs font-sans font-medium tracking-widest uppercase whitespace-nowrap transition-all duration-200 ${
                  cat === c
                    ? "bg-gold-500 text-white shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-gold-500/10 hover:text-gold-500"
                }`}
              >
                {t(`categories.${c}`)}
              </button>
            ))}
          </div>

          {/* Toggle filters */}
          <div className="flex gap-4 justify-center">
            {[
              { state: veganOnly, set: setVeganOnly, label: "Vegan", icon: <Leaf size={12}/> },
              { state: gfOnly, set: setGfOnly, label: "Gluten-Free", icon: <Filter size={12}/> },
            ].map(f => (
              <button
                key={f.label}
                onClick={() => f.set(!f.state)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans border transition-all ${
                  f.state ? "border-gold-500 bg-gold-500/10 text-gold-500" : "border-neutral-200 dark:border-neutral-700 text-neutral-500"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-neutral-400 font-sans"
            >
              {t("noResults")}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={item.img} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width:640px) 100vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {item.featured && (
                      <span className="absolute top-3 left-3 bg-gold-500 text-white text-[9px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                        {t("featured")}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {item.vegan && <span className="bg-emerald-500/90 text-white rounded-full p-1"><Leaf size={9}/></span>}
                      {item.gf && <span className="bg-blue-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">GF</span>}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-heading text-base text-[#0A0A0A] dark:text-white leading-tight">{item.name}</h3>
                      <span className="font-display text-lg text-gold-500 shrink-0 ml-2">${item.price}</span>
                    </div>
                    <p className="text-neutral-400 text-xs font-sans leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-sans">
                        <span className="flex items-center gap-0.5"><Clock size={9}/> {item.prep}m</span>
                        <span className="flex items-center gap-0.5"><Flame size={9}/> {item.cal}</span>
                      </div>
                      <button
                        onClick={() => add({ id: item.id, name: item.name, price: item.price, quantity: 1, image: item.img })}
                        className="flex items-center gap-1 text-[11px] tracking-wider uppercase font-sans font-medium text-gold-500 border border-gold-500/30 px-3 py-1.5 rounded-full hover:bg-gold-500 hover:text-white transition-all duration-200"
                      >
                        <Plus size={11}/> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
