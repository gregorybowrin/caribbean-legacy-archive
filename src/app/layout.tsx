import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caribbean Legacy Archive | Historically Documented Figures",
  description: "A premium digital archive presenting profiles of historically documented Caribbean figures.",
};

import MaintenanceMode from "@/components/auth/MaintenanceMode";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-ivory text-navy`}
      >
        <MaintenanceMode>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </MaintenanceMode>
      </body>
    </html>
  );
}
