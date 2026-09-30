import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Inter, League_Gothic } from "next/font/google";
import { campaign } from "@/config/campaign";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const league = League_Gothic({ subsets: ["latin"], variable: "--font-league", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: campaign.seo.title,
  description: campaign.seo.description,
  openGraph: {
    title: campaign.seo.title,
    description: campaign.seo.description,
    type: "website",
    locale: "pt_BR",
    images: [{ url: campaign.seo.ogImage, width: 1200, height: 630, alt: "Minha Colinha 2026 — Chapinha da Vela" }],
  },
  twitter: { card: "summary_large_image", title: campaign.seo.title, description: campaign.seo.description, images: [campaign.seo.ogImage] },
};

export const viewport: Viewport = { themeColor: campaign.colors.blue, width: "device-width", initialScale: 1 };

const brandVars = {
  "--color-azul": campaign.colors.blue,
  "--color-rosa": campaign.colors.pink,
  "--color-amarelo": campaign.colors.yellow,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${league.variable}`}>
      <body style={brandVars} className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
