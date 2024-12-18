import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/domain-dash-icon-only.svg",
  },
  title: "Domain Bobber - Put Your Domains to Work",
  description: "Simple tools to manage and monetize your parked domains.",
  openGraph: {
    title: "Domain Bobber - Put Your Domains to Work",
    description: "Simple tools to manage and monetize your parked domains.",
    images: ["https://assets.bigskydevcon.com/domain-dash.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-dvh flex flex-col bg-slate-900`}
      >
        <main className="flex-1">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
