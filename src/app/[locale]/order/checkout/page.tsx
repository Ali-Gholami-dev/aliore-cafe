import CheckoutClient from "./CheckoutClient";
import type { Locale } from "@/lib/i18n/config";

export default async function CheckoutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <CheckoutClient locale={locale} />;
}
