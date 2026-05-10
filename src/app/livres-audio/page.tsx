import type { Metadata } from "next";
import { getAllBooks } from "@/lib/books";
import AudioPageClient from "./AudioPageClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Livres Audio",
  description:
    "Écoutez les livres audio du Pasteur Alexandre Amazou sur Spotify, Apple Podcasts, Audible et Amazon Music.",
};

export default async function LivresAudioPage() {
  const books = await getAllBooks();
  const audioBooks = books.filter(
    (b) => b.formats.includes("audio") || b.audioExcerpt
  );
  return <AudioPageClient audioBooks={audioBooks} />;
}
