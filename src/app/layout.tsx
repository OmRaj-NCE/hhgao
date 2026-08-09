import type { Metadata } from "next";
import { Caveat, Space_Mono } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Builder ID — Hacker House Goa 2026",
  description: "Drop in a photo, get your Hacker House Goa 2026 Builder ID.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caveat.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}