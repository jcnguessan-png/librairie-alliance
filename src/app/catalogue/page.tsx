import type { Metadata } from "next";
import { getAllBooks, categories } from "@/lib/books";
import { bookThemes } from "@/data/books";
import CataloguePageClient from "./CataloguePageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Explorez tous les ouvrages du Pasteur Alexandre Amazou. Livres papier, ebooks, livres audio et plus.",
};

export default async function CataloguePage() {
  const books = await getAllBooks();
  return <CataloguePageClient books={books} categories={categories} bookThemes={bookThemes} />;
}
