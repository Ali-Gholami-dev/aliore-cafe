import DashboardClient from "./DashboardClient";
import type { Locale } from "@/lib/i18n/config";

export default async function DashboardPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <DashboardClient locale={locale} />;
}
