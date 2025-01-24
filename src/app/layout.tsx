import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/components/commons/slide-bar-demo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Invest Dashboard",
  description: "Experience a new way to manage your investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <SidebarLayout />
          {/* <main className="flex-1">{children}</main> */}
        </div>
      </body>
    </html>
  );
}
