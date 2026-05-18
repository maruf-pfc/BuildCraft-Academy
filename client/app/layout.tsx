import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "BuildCraft Academy",
    template: "%s | BuildCraft Academy",
  },
  description:
    "Expert-led courses in construction, interior design, and structural engineering. Learn online, build with confidence.",
  keywords: ["construction courses", "interior design", "structural engineering", "Bangladesh", "online learning"],
  openGraph: {
    title: "BuildCraft Academy",
    description: "Expert-led courses in construction and design.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(spaceGrotesk.variable, fontMono.variable)}>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
