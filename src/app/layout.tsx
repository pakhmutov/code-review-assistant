import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Code Review Assistant",
  description: "AI-powered code review tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
