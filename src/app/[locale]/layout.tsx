import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from "@/components/landing/Header";
import { LanguageProvider } from "@/components/landing/language-context";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pagado App",
  description: "manage your money with Pagado App",
};

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();



  return (
    <html lang={locale}>
      <head>
        <meta name="keywords" content="Pagado!, Gestiona tu dinero, Gestiona tu dinero con Pagado!" />
        <meta name="author" content="Pagado!" />
        <meta name="google-site-verification" content="_PGD5VRry7jI_vSJwRSOnjIc7uuxFrIrYZqvwRVch2k" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <Header />
            {children}
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
