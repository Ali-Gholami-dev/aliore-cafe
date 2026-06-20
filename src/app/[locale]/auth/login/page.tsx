import LoginClient from "./LoginClient";
import type { Locale } from "@/lib/i18n/config";

export default async function LoginPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  return <LoginClient locale={locale} />;
}
