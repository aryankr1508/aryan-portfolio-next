import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Aryan Kumar | Portfolio",
  description:
    "Interactive portfolio with full stack, cloud, and data engineering projects using motion-rich modern UI.",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${manrope.variable} ${sora.variable} font-body antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
