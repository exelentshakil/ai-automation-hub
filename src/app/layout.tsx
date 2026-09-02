import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { TrafficTracker } from "@/components/TrafficTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Automation Hub | Live Demo",
  description: "Confidence-Routed AI Orchestration Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex flex-col relative`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          
          {/* Ambient Background Glow (Stripe/Vercel style - using CSS vars for reliable theme switching) */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 flex justify-center">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full glow-bg-1 blur-[120px] mix-blend-multiply opacity-70" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full glow-bg-2 blur-[120px] mix-blend-multiply opacity-70" />
          </div>

          <TrafficTracker />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
