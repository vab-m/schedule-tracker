import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Schedule Tracker - Free Habit & Task Tracker App | Build Better Habits",
  description: "Transform your life with Schedule Tracker. Track daily habits, manage tasks, visualize progress with beautiful charts. Free forever, cloud-synced, Google sign-in. Start building better habits today!",
  keywords: ["habit tracker", "task manager", "productivity app", "daily habits", "goal tracker", "habit tracker app", "free habit tracker", "task tracker", "productivity", "schedule planner", "routine tracker"],
  authors: [{ name: "Vaibhav" }],
  creator: "Vaibhav",
  publisher: "Schedule Tracker",
  metadataBase: new URL("https://schedule-tracker-seven.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schedule-tracker-seven.vercel.app",
    title: "Schedule Tracker - Build Better Habits, Achieve Your Goals",
    description: "Free habit tracker with beautiful analytics. Track habits, manage tasks, visualize your progress. Cloud-synced & easy to use.",
    siteName: "Schedule Tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schedule Tracker - Habit and Task Tracking App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule Tracker - Free Habit & Task Tracker",
    description: "Build better habits with beautiful analytics. Track up to 25 habits, manage tasks, visualize progress. 100% free!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: "your-verification-code",
  },
};

import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
