import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const BASE_URL = "https://aliore.cafe";

const STATIC_ROUTES = [
  "",
  "/menu",
  "/about",
  "/reservation",
  "/gallery",
  "/blog",
  "/contact",
];

const BLOG_SLUGS = [
  "the-art-of-perfect-espresso",
  "truffle-season-2024",
  "private-dining-guide",
  "sourcing-our-coffee",
  "wine-and-food-pairing",
  "pastry-behind-scenes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Static pages
    for (const route of STATIC_ROUTES) {
      entries.push({
        url:              `${BASE_URL}/${locale}${route}`,
        lastModified:     new Date(),
        changeFrequency:  route === "" ? "daily" : "weekly",
        priority:         route === "" ? 1.0 : 0.8,
      });
    }

    // Blog posts
    for (const slug of BLOG_SLUGS) {
      entries.push({
        url:             `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified:    new Date(),
        changeFrequency: "monthly",
        priority:        0.6,
      });
    }
  }

  return entries;
}
