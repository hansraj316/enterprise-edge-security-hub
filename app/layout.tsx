import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EdgeShield | Enterprise Edge Security Hub",
  description: "Next-generation edge security for the modern enterprise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 overflow-hidden h-screen flex`}
      >
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <DashboardHeader />
          <main className="flex-1 p-8 bg-slate-950/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
