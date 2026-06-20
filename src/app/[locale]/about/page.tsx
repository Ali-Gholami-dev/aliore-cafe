import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Aliore Café — our philosophy, our chef, and the team that makes every visit extraordinary.",
};

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <AboutClient locale={locale} />;
}
