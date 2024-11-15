//app/layout.tsx

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react"
import { getServerSession } from './lib/authServer'
import { TernSecure } from './providers/TernSecure'
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
  title: "Firebase Auth and Fetch Data",
  description: "Developer by KayP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialSession = await getServerSession()

  return (
    <html lang="en">
      <TernSecure initialSession={initialSession}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
      </TernSecure>
    </html>
  );
}
