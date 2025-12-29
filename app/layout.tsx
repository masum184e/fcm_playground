import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/header/Header";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FCM Playground | Notification Tester",
  description:
    "A developer tool for testing Firebase Cloud Messaging (FCM) tokens and payloads.",
  keywords: [
    "Firebase",
    "FCM",
    "Push Notifications",
    "Next.js",
    "Developer Tools",
  ],
  authors: [
    { name: "Md Masum Billah", url: "https://mdmasumbillah.vercel.app/" },
  ],
  icons: {
    icon: "/icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Toaster position="top-right" />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
