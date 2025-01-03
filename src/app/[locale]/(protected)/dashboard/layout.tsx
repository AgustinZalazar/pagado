import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/sidebar/AppSidebar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkmodeToggle } from "@/components/dashboard/darkModeToggle";
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard Pagado | Home",
    description: "",
};

export default function RootLayout({
    children,
    params: { locale }
}: Readonly<{
    children: React.ReactNode;
    params: any
}>) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SessionProvider>
                        <SidebarProvider>
                            <AppSidebar locale={locale} />
                            <SidebarInset>
                                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                                    <div className="w-full flex justify-between items-center gap-2 px-4">
                                        <SidebarTrigger className="-ml-1" />
                                        <div className="ml-auto">
                                            <DarkmodeToggle />
                                        </div>
                                    </div>
                                </header>
                                {children}
                            </SidebarInset>
                        </SidebarProvider>
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}