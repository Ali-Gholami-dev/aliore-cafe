import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Stories & Insights",
  description: "From our kitchen to your world — recipes, techniques, seasonal menus and the stories behind Aliore.",
};

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <BlogClient locale={locale} />;
}
