import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aliore Café — Premium Dining & Specialty Coffee",
    template: "%s | Aliore Café",
  },
  description:
    "Experience the art of fine dining and specialty coffee at Aliore Café. Paris-inspired luxury in every sip and bite.",
  keywords: ["restaurant", "café", "fine dining", "specialty coffee", "Paris", "luxury"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aliore.cafe",
    siteName: "Aliore Café",
    title: "Aliore Café — Premium Dining & Specialty Coffee",
    description: "Experience the art of fine dining and specialty coffee.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Aliore Café" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliore Café",
    description: "Premium Dining & Specialty Coffee",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://aliore.cafe"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
