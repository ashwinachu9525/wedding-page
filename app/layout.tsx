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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Allura&family=Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Infant:ital,wght@0,400;0,600;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=IM+Fell+English:ital@0;1&family=Italianno&family=Josefin+Sans:wght@300;400;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&family=Mrs+Saint+Delafield&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;600&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Prata&family=Sacramento&family=Tangerine:wght@400;700&family=WindSong:wght@400;500&display=swap" />
        {isRealAdSense && (
          <meta name="google-adsense-account" content={ADSENSE_PUBLISHER_ID} />
        )}
        {/* Google AdSense — plain script tag required; Next.js Script adds data-nscript which AdSense rejects */}
        {isRealAdSense && (
           
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
