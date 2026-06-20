import type { Metadata } from "next";
import ReservationClient from "./ReservationClient";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description: "Book your table at Aliore Café using our interactive floor map. Choose your preferred zone and seat.",
};

export default async function ReservationPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <ReservationClient locale={locale} />;
}
