import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { AmbientBackground } from "@/components/AmbientBackground";

// Primary sans-serif: clean, modern, fast — used for body text and UI chrome
const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Display serif: cinematic weight for headings, character names, and titles
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PersonaSim — AI Roleplay & Perspective Simulator",
  description:
    "Have immersive conversations with AI characters. Fun roleplay or educational perspective-taking.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PersonaSim",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${geist.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[--bg] text-[--text]">
        <AmbientBackground />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
