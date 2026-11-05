import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pusing A Math — Cosmic Kindergarten Math Quiz 🚀",
  description: "A fun little journey through the universe of numbers for kids aged 4–6. Learn counting, addition, and subtraction with friendly emojis and space adventures!",
  keywords: ["kindergarten math", "kids educational quiz", "counting objects", "math game 4-6 years", "space math adventure"],
  authors: [{ name: "Pusing A Math Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B1026] text-white selection:bg-[#8175FF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
