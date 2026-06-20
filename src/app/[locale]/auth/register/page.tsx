import RegisterClient from "./RegisterClient";
import type { Locale } from "@/lib/i18n/config";

export default async function RegisterPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <RegisterClient locale={locale} />;
}
