import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project ALPHA | EXOBIO",
  description: "Explore the possibility of life on other planets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning থিম লোড হওয়ার সময় এরর এড়াতে সাহায্য করে
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          {/* pt-20 রিমুভ করা হয়েছে যাতে GSAP ফুল-স্ক্রিন অ্যানিমেশন নিখুঁতভাবে কাজ করে */}
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}