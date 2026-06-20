"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, Clock, Users, ChevronRight, Check, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import RestaurantMap from "@/components/reservation/RestaurantMap";
import type { TableData } from "@/components/reservation/RestaurantMap";

interface ReservationClientProps { locale: Locale; }

const TIME_SLOTS = [
  "12:00","12:30","13:00","13:30","14:00","18:00",
  "18:30","19:00","19:30","20:00","20:30","21:00","21:30",
];

const STEPS = ["date", "table", "details", "confirm"] as const;
type Step = typeof STEPS[number];

interface FormData {
  date: string;
  time: string;
  guests: number;
  table: TableData | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function ReservationClient({ locale }: ReservationClientProps) {
  const t = useTranslations("reservation");
  const [step, setStep] = useState<Step>("date");
  const [form, setForm] = useState<FormData>({
    date: "", time: "", guests: 2,
    table: null, name: "", email: "", phone: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [confirmCode] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());

  const stepIndex = STEPS.indexOf(step);

  const update = (key: keyof FormData, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  const onTableSelect = useCallback((table: TableData) => {
    update("table", table);
  }, []);

  const handleSubmit = async () => {
    // In production: call server action to save to DB
    setSubmitted(true);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-28 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center space-y-8"
        >
          <div className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center mx-auto">
            <Check size={32} className="text-gold-500" />
          </div>
          <div>
            <h2 className="font-display text-4xl text-[#0A0A0A] dark:text-white mb-2">{t("confirmation.title")}</h2>
            <p className="text-neutral-400 font-sans">{t("confirmation.subtitle")}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 text-left space-y-4">
            <div className="text-center">
              <div className="text-xs tracking-widest text-gold-500 uppercase font-sans mb-1">{t("confirmation.code")}</div>
              <div className="font-display text-3xl text-[#0A0A0A] dark:text-white tracking-wider">{confirmCode}</div>
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2">
              {[
                { label: "Name", value: form.name },
                { label: "Date", value: form.date },
                { label: "Time", value: form.time },
                { label: "Guests", value: form.guests },
                { label: "Table", value: form.table ? `Table ${form.table.number} — ${form.table.zone}` : "" },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm font-sans">
                  <span className="text-neutral-400">{r.label}</span>
                  <span className="text-[#0A0A0A] dark:text-white font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            A confirmation email has been sent to <strong className="text-[#0A0A0A] dark:text-white">{form.email}</strong>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pt-28">
      {/* Header */}
      <div className="bg-[#0A0A0A] py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.07),transparent_70%)]" />
        <div className="relative z-10">
          <div className="section-label justify-center mb-4">{t("map.title")}</div>
          <h1 className="font-display text-5xl font-light text-white mb-3">{t("title")}</h1>
          <p className="text-neutral-400 font-sans">{t("subtitle")}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-sans font-bold transition-all duration-300 ${
                    i < stepIndex ? "bg-gold-500 border-gold-500 text-white" :
                    i === stepIndex ? "border-gold-500 text-gold-500" :
                    "border-neutral-200 dark:border-neutral-700 text-neutral-400"
                  }`}>
                    {i < stepIndex ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-sans tracking-widest uppercase hidden sm:block ${
                    i === stepIndex ? "text-gold-500" : "text-neutral-400"
                  }`}>
                    {t(`steps.${s}`)}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-all duration-500 ${i < stepIndex ? "bg-gold-500" : "bg-neutral-200 dark:bg-neutral-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* STEP 1: Date & Time */}
          {step === "date" && (
            <motion.div key="date"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto space-y-8"
            >
              <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white text-center">{t("steps.date")}</h2>

              <div className="space-y-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase font-sans text-neutral-500 flex items-center gap-2">
                    <Calendar size={12} /> {t("form.date")}
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    value={form.date}
                    onChange={e => update("date", e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase font-sans text-neutral-500 flex items-center gap-2">
                    <Users size={12} /> {t("form.guests")}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <button
                        key={n}
                        onClick={() => update("guests", n)}
                        className={`w-12 h-12 rounded-xl border text-sm font-sans font-medium transition-all ${
                          form.guests === n
                            ? "border-gold-500 bg-gold-500/10 text-gold-500"
                            : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-gold-500/50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase font-sans text-neutral-500 flex items-center gap-2">
                    <Clock size={12} /> {t("form.time")}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => update("time", slot)}
                        className={`py-2.5 rounded-xl border text-xs font-sans font-medium transition-all ${
                          form.time === slot
                            ? "border-gold-500 bg-gold-500 text-white"
                            : "border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-gold-500/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={!form.date || !form.time}
                onClick={() => setStep("table")}
                className="btn-gold w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t("form.next")} <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Table selection — SVG floor map */}
          {step === "table" && (
            <motion.div key="table"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white mb-2">{t("steps.table")}</h2>
                <p className="text-neutral-400 font-sans text-sm">{t("map.title")} — {form.date} at {form.time}</p>
              </div>

              <RestaurantMap
                guestCount={form.guests}
                selectedTable={form.table}
                onSelect={onTableSelect}
              />

              {form.table && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto bg-gold-500/5 border border-gold-500/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <MapPin size={16} className="text-gold-500 shrink-0" />
                  <div className="flex-1 text-sm font-sans">
                    <span className="text-[#0A0A0A] dark:text-white font-medium">Table {form.table.number}</span>
                    <span className="text-neutral-400"> · {form.table.zone} · {form.table.capacity} seats</span>
                    {form.table.pricePerSeat > 0 && (
                      <span className="text-gold-500"> · ${form.table.pricePerSeat}/seat</span>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3 max-w-lg mx-auto">
                <button onClick={() => setStep("date")} className="btn-outline-gold flex-1 justify-center">
                  ← {t("form.back")}
                </button>
                <button
                  disabled={!form.table}
                  onClick={() => setStep("details")}
                  className="btn-gold flex-1 justify-center disabled:opacity-40"
                >
                  {t("form.next")} →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === "details" && (
            <motion.div key="details"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto space-y-8"
            >
              <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white text-center">{t("steps.details")}</h2>

              <div className="space-y-5">
                {([
                  { key: "name", label: t("form.name"), type: "text", required: true },
                  { key: "email", label: t("form.email"), type: "email", required: true },
                  { key: "phone", label: t("form.phone"), type: "tel", required: false },
                ] as const).map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs tracking-widest uppercase font-sans text-neutral-500">
                      {field.label} {field.required && <span className="text-gold-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={e => update(field.key, e.target.value)}
                      className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-xs tracking-widest uppercase font-sans text-neutral-500">
                    {t("form.notes")}
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={e => update("notes", e.target.value)}
                    placeholder={t("form.notesPlaceholder")}
                    className="w-full px-4 py-3.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl text-sm font-sans focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("table")} className="btn-outline-gold flex-1 justify-center">
                  ← {t("form.back")}
                </button>
                <button
                  disabled={!form.name || !form.email}
                  onClick={() => setStep("confirm")}
                  className="btn-gold flex-1 justify-center disabled:opacity-40"
                >
                  {t("form.next")} →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto space-y-8"
            >
              <h2 className="font-display text-3xl text-[#0A0A0A] dark:text-white text-center">{t("steps.confirm")}</h2>

              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
                {[
                  { label: "Name", value: form.name },
                  { label: "Email", value: form.email },
                  { label: "Phone", value: form.phone || "—" },
                  { label: "Date", value: form.date },
                  { label: "Time", value: form.time },
                  { label: "Guests", value: form.guests },
                  { label: "Table", value: form.table ? `#${form.table.number} — ${form.table.zone}` : "" },
                  { label: "Special Requests", value: form.notes || "None" },
                ].map(r => (
                  <div key={r.label} className="flex justify-between gap-4 text-sm font-sans border-b border-neutral-100 dark:border-neutral-800 pb-3 last:border-0 last:pb-0">
                    <span className="text-neutral-400 shrink-0">{r.label}</span>
                    <span className="text-[#0A0A0A] dark:text-white font-medium text-right">{r.value}</span>
                  </div>
                ))}
              </div>

              {form.table && form.table.pricePerSeat > 0 && (
                <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Table deposit</span>
                    <span className="text-gold-500 font-medium">${(form.table.pricePerSeat * form.guests).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">Deducted from your final bill.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep("details")} className="btn-outline-gold flex-1 justify-center">
                  ← {t("form.back")}
                </button>
                <button onClick={handleSubmit} className="btn-gold flex-1 justify-center">
                  {t("form.confirm")} ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
