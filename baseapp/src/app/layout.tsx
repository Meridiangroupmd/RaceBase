import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
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
  title: "RaceBase",
  description: "Top-down racing game on Base. Daily check-ins, race to earn points, dodge traffic across desert and forest biomes.",
  other: {
    "base:app_id": "69bb13c4147765ec21407738",
  },
  openGraph: {
    title: "RaceBase",
    description: "Race to survive on Base",
    images: [{ url: "https://racebasee.vercel.app/banner.png", width: 1200, height: 630 }],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
