import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const sfProDisplay = localFont({
  src: [
    { path: "../fonts/SF-Pro-Display-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/SF-Pro-Display-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const sfProText = localFont({
  src: [
    { path: "../fonts/SF-Pro-Text-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/SF-Pro-Text-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/SF-Pro-Text-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/SF-Pro-Text-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: "Sociality — connect and share with your community",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sfProDisplay.variable} ${sfProText.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
