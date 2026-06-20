"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export default function RegisterClient({ locale }: { locale: Locale }) {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8)                    s++;
    if (/[A-Z]/.test(p))                  s++;
    if (/[0-9]/.test(p))                  s++;
    if (/[^A-Za-z0-9]/.test(p))           s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8)       { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Registration failed.");
      } else {
        router.push(`/${locale}/auth/login?registered=1`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 sm:px-10 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-block">
            <div className="font-display text-3xl font-light text-white tracking-[0.2em]">ALIORE</div>
            <div className="text-[9px] tracking-[0.5em] text-gold-500 uppercase font-sans font-medium mt-0.5">CAFÉ</div>
          </Link>
        </div>

        <div>
          <h1 className="font-display text-4xl font-light text-white mb-2">{t("title")}</h1>
          <p className="text-neutral-400 font-sans text-sm">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("name")}</label>
            <input
              type="text" required autoComplete="name"
              value={form.name} onChange={e => update("name", e.target.value)}
              placeholder="Alexandre Moreau"
              className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white rounded-xl text-sm font-sans outline-none transition-colors placeholder:text-neutral-600"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("email")}</label>
            <input
              type="email" required autoComplete="email"
              value={form.email} onChange={e => update("email", e.target.value)}
              placeholder="hello@aliore.cafe"
              className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white rounded-xl text-sm font-sans outline-none transition-colors placeholder:text-neutral-600"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("password")}</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} required autoComplete="new-password"
                value={form.password} onChange={e => update("password", e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 pr-12 bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white rounded-xl text-sm font-sans outline-none transition-colors"
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength meter */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-neutral-800"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-sans text-neutral-500">{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("confirm")}</label>
            <input
              type={showPass ? "text" : "password"} required autoComplete="new-password"
              value={form.confirm} onChange={e => update("confirm", e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 bg-neutral-900 border rounded-xl text-sm font-sans outline-none transition-colors text-white ${
                form.confirm && form.confirm !== form.password
                  ? "border-red-500"
                  : "border-neutral-700 focus:border-gold-500"
              }`}
            />
            {form.confirm && form.confirm !== form.password && (
              <p className="text-red-400 text-xs font-sans">Passwords do not match.</p>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm font-sans bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <p className="text-neutral-600 text-xs font-sans leading-relaxed">{t("terms")}</p>

          <button
            type="submit" disabled={loading}
            className="relative inline-flex items-center gap-2 w-full justify-center px-8 py-4 bg-gold-500 text-white font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
              : <UserPlus size={16} />
            }
            {t("submit")}
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm font-sans">
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/auth/login`} className="text-gold-400 hover:text-gold-300 transition-colors">
            {t("login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
