import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Watermark } from "@/components/Watermark";
import resumeData from "@/data/resume.json";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Claudia Nasraty · Career Journey",
  description: resumeData.summary.slice(0, 155),
  openGraph: {
    title: "Claudia Nasraty · Career Journey",
    description: resumeData.summary.slice(0, 155),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claudia Nasraty · Career Journey",
    description: resumeData.summary.slice(0, 155),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <Watermark />
      </body>
    </html>
  );
}
