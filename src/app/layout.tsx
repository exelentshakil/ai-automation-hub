import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { TrafficTracker } from "@/components/TrafficTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Automation Hub",
  description: "Confidence-Routed AI Orchestration Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TrafficTracker />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
