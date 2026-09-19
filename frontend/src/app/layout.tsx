import type { Metadata, Viewport } from "next";
import { MobileNavigation } from "@/components/home/MobileNavigation";
import { PromoStrip } from "@/components/home/PromoStrip";
import { Inter, Manrope, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
import "./globals.css";

// Manrope leads: its tighter apertures and geometric cut give headings a voice,
// where Inter is deliberately neutral. Inter takes body and UI copy, which is the
// job it was drawn for — it stays legible at the 12px caption floor where Manrope
// starts to feel wide. Both families were already being loaded; only the roles swapped.
const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cloud text-ink font-body">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-primary">Skip to content</a>
        <PromoStrip />
        <CartProvider>{children}<MobileNavigation /></CartProvider>
      </body>
    </html>
  );
}
