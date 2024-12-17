import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/sidebar/AppSidebar";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard Pagado | Home",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider>
                    <SidebarProvider>
                        <AppSidebar />
                        <main>
                            <SidebarTrigger />
                            {children}
                        </main>
                    </SidebarProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
