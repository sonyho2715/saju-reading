import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://sajureading.com'),
  title: {
    default: 'Free Korean Saju Reading -- Four Pillars of Destiny',
    template: '%s | SajuReading',
  },
  description:
    'Get your free Korean Saju reading online. Discover your Four Pillars of Destiny with AI-powered analysis. Birth chart, luck cycles, compatibility, and more.',
  keywords: [
    'saju',
    'saju reading',
    'four pillars',
    'korean astrology',
    'four pillars of destiny',
    '\uc0ac\uc8fc',
    '\uc0ac\uc8fc\ud480\uc774',
    'saju online',
    'Korean fortune telling',
    'birth chart',
    'luck cycles',
    'compatibility',
  ],
  openGraph: {
    type: 'website',
    siteName: 'SajuReading',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
