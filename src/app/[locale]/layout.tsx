import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isRTL, type Locale } from "@/lib/i18n/config";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MouseFollower from "@/components/ui/MouseFollower";
import PageTransition from "@/components/animations/PageTransition";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import { auth } from "@/lib/auth";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Next 14: params is a plain synchronous object
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const session  = await auth();
  const dir      = isRTL(locale as Locale) ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <SessionProvider session={session}>
          <CartProvider>
            <script
              dangerouslySetInnerHTML={{
                __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dir}";`,
              }}
            />
            <ClientLayoutWrapper>
              <MouseFollower />
              <Navbar locale={locale as Locale} />
              <PageTransition>
                <main>{children}</main>
              </PageTransition>
              <Footer locale={locale as Locale} />
            </ClientLayoutWrapper>
          </CartProvider>
        </SessionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
