import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://openclips.io";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "OpenClips — Clip the open web. Think Deeper.",
    template: "%s · OpenClips",
  },

  description:
    "Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.",

  keywords: [
    "OpenClips",
    "web clipper",
    "AI research tool",
    "save from web",
    "AI notes",
    "research workspace",
    "knowledge management",
    "AI productivity",
    "clip and annotate",
    "second brain",
    "browser extension",
    "AI-powered notes",
  ],

  authors: [{ name: "OpenClips", url: APP_URL }],
  creator: "OpenClips",
  publisher: "OpenClips",

  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "OpenClips",
    title: "OpenClips — Clip the open web. Think Deeper.",
    description:
      "Save anything from the internet into your workspace — articles, links, images, notes. Let AI find connections, generate insights, and help you think.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenClips — Clip the open web. Think Deeper.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@openclips",
    creator: "@openclips",
    title: "OpenClips — Clip the open web. Think Deeper.",
    description:
      "Save anything from the internet into your workspace. Let AI find connections, generate insights, and help you think.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}