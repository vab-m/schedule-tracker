import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Schedule Tracker - Ultimate Habit and Tasks Tracker",
  description: "Transform your daily actions into clear, real-time insights. Track up to 25 habits with automated calculations and visual analytics.",
  keywords: ["habit tracker", "task manager", "productivity", "daily habits", "schedule"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
