import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { es } from "@/content/es";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: { default: `${es.brand.name} · ${es.brand.tagline}`, template: `%s · ${es.brand.name}` },
  description: es.home.heroSubtitle,
  robots: { index: false, follow: false }, // private demo
};
export const viewport: Viewport = { themeColor: "#1f5a46", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
