import type { Metadata } from "next";
import { Playfair_Display, Inter, Lora } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-quote",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Librairie d'Alliance — Cathédrale ABMCI",
    template: "%s | Librairie d'Alliance",
  },
  description:
    "Les ouvrages du Pasteur Alexandre Amazou. Nourrir votre esprit, transformer votre vie. Disponibles en librairie, en ligne et en audio.",
  keywords: [
    "Librairie Alliance",
    "ABMCI",
    "Pasteur Alexandre Amazou",
    "livres chrétiens",
    "Abidjan",
    "Côte d'Ivoire",
    "livres spirituels",
  ],
  authors: [{ name: "Pasteur Alexandre Amazou" }],
  openGraph: {
    title: "Librairie d'Alliance — Cathédrale ABMCI",
    description:
      "Les ouvrages du Pasteur Alexandre Amazou. Nourrir votre esprit, transformer votre vie.",
    type: "website",
    locale: "fr_CI",
    siteName: "Librairie d'Alliance",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${lora.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
