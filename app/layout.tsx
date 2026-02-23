import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://oscil.ai";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "Oscil AI — From Idea to Execution",
    template: "%s · Oscil AI",
  },

  description:
    "Oscil AI is your intelligent workspace for capturing ideas, clipping research, and turning thoughts into action — powered by AI.",

  keywords: [
    "Oscil AI",
    "AI workspace",
    "idea capture",
    "web clipper",
    "AI notes",
    "research tool",
    "knowledge management",
    "AI productivity",
    "clip and annotate",
    "second brain",
  ],

  authors: [{ name: "Oscil AI", url: APP_URL }],
  creator: "Oscil AI",
  publisher: "Oscil AI",

  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "Oscil AI",
    title: "Oscil AI — From Idea to Execution",
    description:
      "Capture, clip, and annotate anything on the web. Oscil AI helps you go from scattered ideas to clear execution with the power of AI.",
    images: [
      {
        url: "/og-image.png", // place a 1200×630 image in /public
        width: 1200,
        height: 630,
        alt: "Oscil AI — From Idea to Execution",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@oscilai",       // update to your real handle
    creator: "@oscilai",
    title: "Oscil AI — From Idea to Execution",
    description:
      "Your AI-powered workspace for clipping, annotating, and executing ideas.",
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
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}