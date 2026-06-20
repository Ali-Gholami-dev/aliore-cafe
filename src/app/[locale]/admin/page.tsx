import AdminClient from "./AdminClient";
import type { Locale } from "@/lib/i18n/config";

export default async function AdminPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <AdminClient locale={locale} />;
}
