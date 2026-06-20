import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aliore Café — reservations, private dining, press enquiries and more.",
};

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <ContactClient locale={locale} />;
}
