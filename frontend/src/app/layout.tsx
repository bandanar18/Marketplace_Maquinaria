import type { Metadata } from "next";
import { Inter, Barlow_Condensed, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";
import { CompareBar } from "@/components/compare-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Maquinaria Marketplace | Compra y Venta de Maquinaria Industrial",
  description: "El marketplace líder en compra y venta de maquinaria pesada, industrial y agrícola.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
          <CompareBar />
        </ClientLayout>
      </body>
    </html>
  );
}
