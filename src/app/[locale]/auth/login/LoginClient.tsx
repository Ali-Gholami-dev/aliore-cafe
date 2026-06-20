"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export default function LoginClient({ locale }: { locale: Locale }) {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(`/${locale}/dashboard`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1),transparent_70%)]" />
        <div className="relative z-10 text-center px-12 space-y-8">
          <div>
            <div className="font-display text-5xl font-light text-white tracking-[0.2em]">ALIORE</div>
            <div className="text-[10px] tracking-[0.5em] text-gold-500 uppercase font-sans font-medium mt-1">CAFÉ</div>
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-gold-500/50 to-transparent mx-auto" />
          <p className="font-display text-2xl font-light text-neutral-300 italic">
            &ldquo;Welcome back. Your table awaits.&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mt-8">
            {[
              { v: "120+", l: "Dishes"       },
              { v: "5★",   l: "Rating"       },
              { v: "12",   l: "Years"        },
              { v: "98%",  l: "Happy Guests" },
            ].map(s => (
              <div key={s.l} className="border border-neutral-800 rounded-xl p-4 text-center">
                <div className="font-display text-2xl text-gold-400">{s.v}</div>
                <div className="text-neutral-500 text-xs font-sans mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="font-display text-3xl font-light text-white tracking-[0.2em]">ALIORE</div>
            <div className="text-[9px] tracking-[0.5em] text-gold-500 uppercase mt-0.5">CAFÉ</div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-light text-white mb-2">{t("title")}</h1>
            <p className="text-neutral-400 font-sans text-sm">{t("subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("email")}</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white rounded-xl text-sm font-sans outline-none transition-colors placeholder:text-neutral-600"
                placeholder="hello@aliore.cafe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs tracking-widest uppercase font-sans text-neutral-400">{t("password")}</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-neutral-900 border border-neutral-700 focus:border-gold-500 text-white rounded-xl text-sm font-sans outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-sans bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm font-sans">
              <label className="flex items-center gap-2 text-neutral-400 cursor-pointer select-none">
                <input type="checkbox" className="accent-gold-500 rounded" />
                {t("remember")}
              </label>
              <button type="button" className="text-gold-400 hover:text-gold-300 transition-colors text-xs tracking-wide">
                {t("forgot")}
              </button>
            </div>

            <button
              type="submit" disabled={loading}
              className="relative inline-flex items-center gap-2 w-full justify-center px-8 py-4 bg-gold-500 text-white font-sans font-medium tracking-widest text-sm uppercase transition-all duration-300 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                : <LogIn size={16} />
              }
              {t("submit")}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0A0A0A] px-4 text-neutral-500 font-sans">or continue with</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard` })}
            className="w-full border border-neutral-700 hover:border-neutral-500 text-white text-sm font-sans py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-neutral-500 text-sm font-sans">
            {t("noAccount")}{" "}
            <Link href={`/${locale}/auth/register`} className="text-gold-400 hover:text-gold-300 transition-colors">
              {t("register")}
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="border border-neutral-800 rounded-xl p-4 text-xs font-sans text-neutral-500 space-y-1">
            <div className="text-neutral-400 font-medium mb-2">Demo accounts:</div>
            <div>Admin: <span className="text-gold-500">admin@aliore.cafe</span> / admin123456</div>
            <div>Guest: <span className="text-gold-500">guest@aliore.cafe</span> / user123456</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
