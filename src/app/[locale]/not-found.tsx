import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function NotFound() {
  // locale not available in not-found without params — fallback to "en"
  const locale: Locale = "en";
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
      <div className="relative z-10 space-y-6">
        <div className="font-display text-[10rem] font-light text-white/5 leading-none select-none">404</div>
        <div className="-mt-16 space-y-4">
          <div className="flex items-center justify-center gap-3 text-[#C9A84C] font-sans tracking-[0.25em] text-xs uppercase font-medium">
            <span className="block w-8 h-px bg-[#C9A84C]" />
            Page Not Found
            <span className="block w-8 h-px bg-[#C9A84C]" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-white">
            The table you&apos;re looking for<br />doesn&apos;t exist
          </h1>
          <p className="text-neutral-400 font-sans max-w-sm mx-auto">
            Perhaps you took a wrong turn on the way to dinner. Let us guide you back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={`/${locale}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] text-white font-sans font-medium tracking-widest text-sm uppercase hover:bg-[#B8963C] transition-colors">
              Back to Home
            </Link>
            <Link href={`/${locale}/reservation`} className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#C9A84C] text-[#C9A84C] font-sans font-medium tracking-widest text-sm uppercase hover:bg-[#C9A84C] hover:text-white transition-colors">
              Reserve a Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
