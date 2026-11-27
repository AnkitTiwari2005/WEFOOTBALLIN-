import type { Metadata } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { AppProvider } from "@/components/AppProvider";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WEFOOTBALLIN' | Good football. Good people.",
  description:
    "Delhi NCR's premier pickup football platform. Floodlit 5v5, 7v7 & 9v9 games, balanced squads, night leagues and turf hosting.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <AppProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
