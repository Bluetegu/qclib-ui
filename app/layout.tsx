import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QC Library",
  description: "Quantum Computing Expert Library UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
            <a href="/" className="text-base font-semibold tracking-tight text-indigo-700">
              QC Library
            </a>
            <nav className="flex gap-4 text-sm text-neutral-600">
              <a href="/library" className="hover:text-indigo-700 transition">Library</a>
              <a href="/ruminations" className="hover:text-indigo-700 transition">Ruminations</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
