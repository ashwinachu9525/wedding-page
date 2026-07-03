import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "";

export const metadata: Metadata = {
  title: "VivahaLuxe • Royal Wedding Invitations & SEO Celebrations",
  description: "Next-generation autonomous AI wedding invitation platform with custom SEO slugs and dynamic themes.",
  verification: {
    google: "ja7oYZW32sasXoMUdxESs9pMCi_gHmU5SGUWN37r0aQ",
  },
};
const isRealAdSense = ADSENSE_PUBLISHER_ID && !ADSENSE_PUBLISHER_ID.includes("XXXX");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {isRealAdSense && (
          <meta name="google-adsense-account" content={ADSENSE_PUBLISHER_ID} />
        )}
        {/* Google AdSense — plain script tag required; Next.js Script adds data-nscript which AdSense rejects */}
        {isRealAdSense && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors closeButton expand theme="light" />
      </body>
    </html>
  );
}
