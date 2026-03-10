import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "December Studio - AI-Powered Web Builder",
  description: "Build full-stack web applications with AI assistance. Create, edit, and deploy Next.js apps instantly.",
  keywords: ["AI", "Web Builder", "Next.js", "React", "Full-Stack", "Development"],
  authors: [{ name: "December AI" }],
  openGraph: {
    title: "December Studio - AI-Powered Web Builder",
    description: "Build full-stack web applications with AI assistance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
