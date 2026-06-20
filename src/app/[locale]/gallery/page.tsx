import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual feast — explore the interiors, cuisine, and moments that define Aliore Café.",
};

export default async function GalleryPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <GalleryClient locale={locale} />;
}
