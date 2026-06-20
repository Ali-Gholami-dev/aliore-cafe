"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function CartDrawer({ locale }: { locale: Locale }) {
  const { items, isOpen, toggle, remove, updateQty, total, clear } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-neutral-950 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-gold-500" />
                <h2 className="font-heading text-lg">Your Order</h2>
                {items.length > 0 && (
                  <span className="text-xs text-neutral-400 font-sans">({items.length} items)</span>
                )}
              </div>
              <button
                onClick={toggle}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-neutral-200 dark:text-neutral-700" />
                  <p className="text-neutral-400 font-sans text-sm">Your order is empty</p>
                  <button onClick={toggle} className="btn-outline-gold text-xs py-2 px-6">
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 py-4 border-b border-neutral-50 dark:border-neutral-900"
                      >
                        {item.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm truncate">{item.name}</p>
                          <p className="text-gold-500 text-sm font-sans font-medium mt-0.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-7 h-7 border border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center hover:border-gold-500 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-sans w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-7 h-7 border border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center hover:border-gold-500 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="p-1 text-neutral-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 font-sans">Subtotal</span>
                  <span className="font-heading text-lg">${total.toFixed(2)}</span>
                </div>
                <Link
                  href={`/${locale}/order/checkout`}
                  onClick={toggle}
                  className="btn-gold w-full justify-center text-xs py-3.5"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={clear}
                  className="w-full text-center text-xs text-neutral-400 hover:text-red-400 font-sans transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
