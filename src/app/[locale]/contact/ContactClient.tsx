"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export default function ContactClient({ locale: _locale }: { locale: Locale }) {
  const t = useTranslations("contact");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });

  const update = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const INFO = [
    { icon: MapPin, label: "Address",  value: "12 Rue de la Paix, 75001 Paris" },
    { icon: Phone,  label: "Phone",    value: "+33 1 42 96 00 00" },
    { icon: Mail,   label: "Email",    value: "hello@aliore.cafe" },
    { icon: Clock,  label: "Hours",    value: "Mon–Fri 7:30–23:00 · Sat–Sun 8:00–00:00" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-24">
      {/* Hero */}
      <div className="bg-[#0A0A0A] py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.07),transparent_70%)]" />
        <div className="relative z-10">
          <div className="section-label justify-center mb-4">Reach Out</div>
          <h1 className="font-display text-5xl sm:text-6xl font-light text-white mb-3">{t("title")}</h1>
          <p className="text-neutral-400 font-sans">{t("subtitle")}</p>
        </div>
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white mb-6">Visit Us</h2>
              <div className="space-y-6">
                {INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-gold-500" />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest uppercase font-sans text-neutral-400 mb-0.5">{label}</div>
                      <div className="text-[#0A0A0A] dark:text-white font-sans text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder (styled) */}
            <div className="relative h-72 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <MapPin size={20} className="text-gold-500" />
                </div>
                <div className="text-center">
                  <div className="text-white font-sans text-sm font-medium">Aliore Café</div>
                  <div className="text-neutral-400 font-sans text-xs mt-1">12 Rue de la Paix, Paris</div>
                </div>
                <a
                  href="https://maps.google.com/?q=12+Rue+de+la+Paix+Paris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-gold-500 text-xs font-sans tracking-widest uppercase border border-gold-500/30 px-4 py-2 rounded-full hover:bg-gold-500/10 transition-colors"
                >
                  Open in Maps →
                </a>
              </div>
              {/* Decorative grid */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapgrid)"/>
              </svg>
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs tracking-widest uppercase font-sans text-neutral-400 mb-3">Follow Aliore</p>
              <div className="flex gap-3">
                {["Instagram", "Facebook", "Twitter"].map(s => (
                  <a
                    key={s}
                    href="#"
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-sans text-neutral-500 hover:border-gold-500 hover:text-gold-500 transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6 py-16"
              >
                <div className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center">
                  <CheckCircle size={32} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-display text-3xl text-[#0A0A0A] dark:text-white mb-2">Message Sent</h3>
                  <p className="text-neutral-400 font-sans">We will respond within 24 hours.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white mb-8">Send a Message</h2>
                {[
                  { key:"name",    label:t("form.name"),    type:"text",  required:true },
                  { key:"email",   label:t("form.email"),   type:"email", required:true },
                  { key:"subject", label:t("form.subject"), type:"text",  required:false },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-xs tracking-widest uppercase font-sans text-neutral-500">
                      {f.label} {f.required && <span className="text-gold-500">*</span>}
                    </label>
                    <input
                      type={f.type}
                      required={f.required}
                      value={(form as Record<string, string>)[f.key]}
                      onChange={e => update(f.key as keyof typeof form, e.target.value)}
                      className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-xs tracking-widest uppercase font-sans text-neutral-500">
                    {t("form.message")} <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={form.message}
                    onChange={e => update("message", e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-gold w-full justify-center gap-3">
                  <Send size={16} /> {t("form.send")}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
