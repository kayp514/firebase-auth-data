//app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { TernSecureProvider } from './providers/TernSecureProvider'
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TernSecure Authentication System for netxjs",
  description: 'TernSecure simplifies Firebase Authentication integration in your Next.js projects. Built for Next.js 13, 14, and 15.0.3.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <TernSecureProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
    </TernSecureProvider>
  );
}
