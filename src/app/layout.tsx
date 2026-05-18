import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.scss";

const url = process.env.NEXT_PUBLIC_APP_URL ?? 'https://code-review-assistant.vercel.app';

export const metadata: Metadata = {
  title: "Code Review Assistant",
  description: "Paste your code and get instant AI-powered feedback on bugs, security, performance, and code style.",
  openGraph: {
    title: "Code Review Assistant",
    description: "Paste your code and get instant AI-powered feedback on bugs, security, performance, and code style.",
    url,
    siteName: "Code Review Assistant",
    images: [{ url: `${url}/api/og`, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Review Assistant",
    description: "Paste your code and get instant AI-powered feedback on bugs, security, performance, and code style.",
    images: [`${url}/api/og`],
  },
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
        <SpeedInsights />
      </body>
    </html>
  );
}
