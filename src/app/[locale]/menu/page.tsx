import type { Metadata } from "next";
import MenuPageClient from "./MenuPageClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore our seasonal menu of fine dining dishes, specialty coffees, desserts and cocktails.",
};

export default async function MenuPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <MenuPageClient locale={locale} />;
}
