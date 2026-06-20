"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, MapPin, CreditCard, Check, Truck, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const STEPS = ["cart", "delivery", "payment"] as const;
type Step = typeof STEPS[number];

export default function CheckoutClient({ locale }: { locale: Locale }) {
  const { items, total, clear } = useCart();
  const [step, setStep]       = useState<Step>("cart");
  const [done, setDone]       = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState({ street: "", city: "", zip: "", phone: "" });
  const [card, setCard]       = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);

  const orderId = `ALC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const tax = total * 0.1;
  const delivery = 3.5;
  const grandTotal = total + tax + (orderType === "delivery" ? delivery : 0);

  const placeOrder = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    clear();
    setLoading(false);
    setDone(true);
  };

  const stepIndex = STEPS.indexOf(step);

  // ── Success screen ───────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 rounded-full bg-gold-500/10 border-2 border-gold-500 flex items-center justify-center mx-auto">
            <Check size={36} className="text-gold-500" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-[#0A0A0A] dark:text-white mb-2">Order Placed!</h1>
            <p className="text-neutral-400 font-sans">We are preparing your order with care.</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 text-left space-y-3">
            <div className="text-center mb-4">
              <div className="text-[10px] tracking-widest text-gold-500 uppercase font-sans mb-1">Order ID</div>
              <div className="font-display text-2xl text-[#0A0A0A] dark:text-white tracking-wider">{orderId}</div>
            </div>
            <div className="flex justify-between text-sm font-sans border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <span className="text-neutral-400">Type</span>
              <span className="text-[#0A0A0A] dark:text-white font-medium capitalize">{orderType}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-neutral-400">Estimated time</span>
              <span className="text-[#0A0A0A] dark:text-white font-medium">
                {orderType === "delivery" ? "35–45 min" : "20–25 min"}
              </span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-neutral-400">Total charged</span>
              <span className="text-gold-500 font-display text-lg">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Order tracker */}
          <div className="flex items-center">
            {[
              { icon: ShoppingBag, label: "Received"  },
              { icon: Package,     label: "Preparing" },
              { icon: Truck,       label: "On the Way"},
              { icon: Check,       label: "Delivered" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                    i === 0 ? "border-gold-500 bg-gold-500/10" : "border-neutral-200 dark:border-neutral-700"
                  }`}>
                    <Icon size={14} className={i === 0 ? "text-gold-500" : "text-neutral-400"} />
                  </div>
                  <span className="text-[9px] font-sans text-neutral-400 text-center whitespace-nowrap">{label}</span>
                </div>
                {i < 3 && <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700 mx-1 mb-4" />}
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gold-500 text-white font-sans font-medium tracking-widest text-sm uppercase hover:bg-gold-600 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-light text-[#0A0A0A] dark:text-white mb-2">Checkout</h1>
          <p className="text-neutral-400 font-sans text-sm">Fine dining, delivered to your door</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center max-w-sm mx-auto mb-10 gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              {i > 0 && (
                <div className={`flex-1 h-px transition-all duration-500 ${stepIndex > i - 1 ? "bg-gold-500" : "bg-neutral-200 dark:bg-neutral-700"}`} />
              )}
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-sans font-bold flex-shrink-0 transition-all duration-300 ${
                stepIndex > i  ? "border-gold-500 bg-gold-500 text-white" :
                stepIndex === i ? "border-gold-500 text-gold-500" :
                "border-neutral-200 dark:border-neutral-700 text-neutral-400"
              }`}>
                {stepIndex > i ? <Check size={13} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-all duration-500 ${stepIndex > i ? "bg-gold-500" : "bg-neutral-200 dark:bg-neutral-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Form panel ── */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 1 — Cart review */}
              {step === "cart" && (
                <motion.div key="cart"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6"
                >
                  <h2 className="font-heading text-xl text-[#0A0A0A] dark:text-white mb-6 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-gold-500" /> Your Order
                  </h2>
                  {items.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <ShoppingBag size={48} className="mx-auto text-neutral-200 dark:text-neutral-700" />
                      <p className="text-neutral-400 font-sans text-sm">Your cart is empty.</p>
                      <Link href={`/${locale}/menu`} className="inline-flex items-center gap-2 px-6 py-2.5 border border-gold-500 text-gold-500 font-sans text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-all">
                        Browse Menu
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4 py-3 border-b border-neutral-50 dark:border-neutral-800 last:border-0">
                          {item.image && (
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                              <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-heading text-sm text-[#0A0A0A] dark:text-white truncate">{item.name}</p>
                            <p className="text-neutral-400 text-xs font-sans mt-0.5">×{item.quantity}</p>
                          </div>
                          <p className="font-display text-base text-gold-500 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="flex gap-3 pt-4">
                        <Link href={`/${locale}/menu`} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gold-500 text-gold-500 font-sans text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-all">
                          ← Edit Cart
                        </Link>
                        <button onClick={() => setStep("delivery")} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white font-sans text-xs uppercase tracking-widest hover:bg-gold-600 transition-colors">
                          Continue →
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2 — Delivery */}
              {step === "delivery" && (
                <motion.div key="delivery"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 space-y-6"
                >
                  <h2 className="font-heading text-xl text-[#0A0A0A] dark:text-white flex items-center gap-2">
                    <MapPin size={18} className="text-gold-500" /> Delivery Details
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(["delivery", "pickup"] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-sans font-medium transition-all ${
                          orderType === type
                            ? "border-gold-500 bg-gold-500/10 text-gold-500"
                            : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-gold-500/40"
                        }`}
                      >
                        {type === "delivery" ? <Truck size={15} /> : <Package size={15} />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  {orderType === "delivery" ? (
                    <div className="space-y-4">
                      {[
                        { key: "street", label: "Street Address", placeholder: "123 Rue de Rivoli" },
                        { key: "city",   label: "City",           placeholder: "Paris"              },
                        { key: "zip",    label: "Postal Code",    placeholder: "75001"              },
                        { key: "phone",  label: "Phone Number",   placeholder: "+33 6 12 34 56 78"  },
                      ].map(f => (
                        <div key={f.key} className="space-y-1.5">
                          <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{f.label}</label>
                          <input
                            placeholder={f.placeholder}
                            value={(address as Record<string, string>)[f.key]}
                            onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                            className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors text-[#0A0A0A] dark:text-white placeholder:text-neutral-400"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-5 text-sm font-sans space-y-2">
                      <div className="flex items-center gap-2 text-gold-500 font-medium"><MapPin size={14} /> Aliore Café</div>
                      <p className="text-neutral-400">12 Rue de la Paix, 75001 Paris</p>
                      <p className="text-neutral-400">Ready in approximately <strong className="text-[#0A0A0A] dark:text-white">20–25 minutes</strong></p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStep("cart")} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gold-500 text-gold-500 font-sans text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-all">
                      ← Back
                    </button>
                    <button onClick={() => setStep("payment")} className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gold-500 text-white font-sans text-xs uppercase tracking-widest hover:bg-gold-600 transition-colors">
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Payment */}
              {step === "payment" && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 space-y-6"
                >
                  <h2 className="font-heading text-xl text-[#0A0A0A] dark:text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-gold-500" /> Payment
                  </h2>
                  <div className="flex gap-3">
                    {["Card", "PayPal", "Apple Pay"].map(m => (
                      <button key={m} className={`flex-1 py-2.5 rounded-xl border text-xs font-sans font-medium transition-all ${
                        m === "Card"
                          ? "border-gold-500 bg-gold-500/10 text-gold-500"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-neutral-400"
                      }`}>{m}</button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">Card Number</label>
                      <input
                        placeholder="4242 4242 4242 4242"
                        value={card.number}
                        maxLength={19}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCard(c => ({ ...c, number: v }));
                        }}
                        className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors tracking-widest text-[#0A0A0A] dark:text-white placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">Cardholder Name</label>
                      <input
                        placeholder="Alexandre Moreau"
                        value={card.name}
                        onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                        className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors text-[#0A0A0A] dark:text-white placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">Expiry</label>
                        <input
                          placeholder="MM / YY"
                          value={card.expiry}
                          maxLength={7}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, "");
                            if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
                            setCard(c => ({ ...c, expiry: v }));
                          }}
                          className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors tracking-widest text-[#0A0A0A] dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">CVV</label>
                        <input
                          placeholder="123"
                          type="password"
                          value={card.cvv}
                          maxLength={4}
                          onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "") }))}
                          className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors text-[#0A0A0A] dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans">
                    <Check size={12} className="text-emerald-500" />
                    Secured by 256-bit SSL encryption
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("delivery")} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gold-500 text-gold-500 font-sans text-xs uppercase tracking-widest hover:bg-gold-500 hover:text-white transition-all">
                      ← Back
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white font-sans text-xs uppercase tracking-widest hover:bg-gold-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                        : <CreditCard size={14} />
                      }
                      {loading ? "Processing…" : `Pay $${grandTotal.toFixed(2)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 sticky top-28 space-y-4">
              <h3 className="font-heading text-[#0A0A0A] dark:text-white">Order Summary</h3>
              <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm font-sans">
                    <span className="text-neutral-500 truncate pr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-[#0A0A0A] dark:text-white flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-neutral-400 text-xs font-sans">No items yet.</p>
                )}
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-[#0A0A0A] dark:text-white">${total.toFixed(2)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-neutral-400">Delivery</span>
                    <span className="text-[#0A0A0A] dark:text-white">${delivery.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-neutral-400">Tax (10%)</span>
                  <span className="text-[#0A0A0A] dark:text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-between">
                <span className="font-heading text-[#0A0A0A] dark:text-white">Total</span>
                <span className="font-display text-2xl text-gold-500">${grandTotal.toFixed(2)}</span>
              </div>
              <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-3 text-xs font-sans text-neutral-400">
                🌿 For every order, Aliore plants one tree with One Tree Planted.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
