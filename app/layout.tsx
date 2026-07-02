import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { coupleInfo } from "@/data/wedding-data";
import { MediaProvider } from "@/lib/media-context";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${coupleInfo.names} | Wedding Celebration in ${coupleInfo.locationDisplay}`,
  description: coupleInfo.welcomeMessage,
  keywords: [
    "Wedding",
    coupleInfo.firstNames.partner1,
    coupleInfo.firstNames.partner2,
    "Lake Como Wedding",
    "Villa Balbiano",
    "Luxury Wedding Website",
  ],
  authors: [{ name: coupleInfo.names }],
  openGraph: {
    title: `${coupleInfo.names} — ${coupleInfo.headline}`,
    description: coupleInfo.welcomeMessage,
    url: "https://aswin-and-annapoorna.com",
    siteName: `${coupleInfo.names} Wedding`,
    images: [
      {
        url: coupleInfo.heroFallbackImage,
        width: 1200,
        height: 630,
        alt: `${coupleInfo.names} Wedding in Lake Como`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${coupleInfo.names} — Wedding Celebration`,
    description: coupleInfo.welcomeMessage,
    images: [coupleInfo.heroFallbackImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#FAF8F5] text-[#22201E] font-sans selection:bg-[#E8E2D9] selection:text-[#1F1D1A]">
        <MediaProvider>
          <TooltipProvider delay={200}>
            {children}
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </MediaProvider>
      </body>
    </html>
  );
}
