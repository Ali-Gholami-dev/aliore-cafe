import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";

// All sections are client components — import them normally
// HeroSection itself is "use client" and handles its own 3D lazy loading
import HeroSection from "@/components/sections/HeroSection";
import FeaturedDishes from "@/components/sections/FeaturedDishes";
import ChefStory from "@/components/sections/ChefStory";
import ExperienceSection from "@/components/sections/ExperienceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { GalleryPreview, ReservationCTA } from "@/components/sections/GalleryAndCTA";
import BlogPreview from "@/components/sections/BlogPreview";

interface HomeProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: "Aliore Café — Premium Dining & Specialty Coffee",
    description: t("subheadline"),
  };
}

export default async function HomePage({ params }: HomeProps) {
  const { locale } = params;
  return (
    <>
      <HeroSection locale={locale} />
      <FeaturedDishes locale={locale} />
      <ChefStory locale={locale} />
      <ExperienceSection />
      <ReservationCTA locale={locale} />
      <TestimonialsSection />
      <GalleryPreview locale={locale} />
      <BlogPreview locale={locale} />
    </>
  );
}
