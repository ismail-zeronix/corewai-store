import type { Metadata } from "next";
import { Inter, Manrope, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoreWAI Supply — Curated tech, home & lifestyle",
  description:
    "CoreWAI Supply is a UAE-based multi-category store for electronics, home & kitchen, and lifestyle gadgets — fast local delivery, official warranty, pay your way.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cloud text-ink font-body">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
