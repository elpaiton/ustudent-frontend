import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "uStudent",
  description: "Plataforma de promocion y permanencia estudiantil",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
