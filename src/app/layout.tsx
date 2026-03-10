import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "December AI v2 - AI-Powered Development Platform",
  description: "Build, deploy, and iterate with AI assistance",
  keywords: ["AI", "Development", "IDE", "Code Editor", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
