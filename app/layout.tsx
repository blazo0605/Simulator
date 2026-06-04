import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PersonaSim — AI Roleplay & Perspective Simulator",
  description:
    "Have immersive conversations with AI characters. Fun roleplay or educational perspective-taking.",
  // app/manifest.ts generates /manifest.webmanifest and adds the <link> automatically
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
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0f0f0f] text-[#ededed]">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
