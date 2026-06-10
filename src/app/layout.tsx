import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sosta Bazar — Compare Grocery Prices in Bangladesh",
  description: "Find the cheapest deals across Chaldal, Shwapno, MeenaClick, Daraz dMart and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-emerald-900/10 py-6 text-center text-sm text-emerald-700">
          © {new Date().getFullYear()} Sosta Bazar — Compare prices, save money.
        </footer>
      </body>
    </html>
  );
}
