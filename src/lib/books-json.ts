import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Book } from "@/data/books";

const BOOKS_JSON_PATH = join(process.cwd(), "data", "books.json");

export function readBooksFromJson(): Book[] | null {
  try {
    if (!existsSync(BOOKS_JSON_PATH)) return null;
    const raw = readFileSync(BOOKS_JSON_PATH, "utf-8");
    const books = JSON.parse(raw) as Book[];
    return books.length > 0 ? books : null;
  } catch {
    return null;
  }
}

export function writeBooksToJson(books: Book[]): void {
  writeFileSync(BOOKS_JSON_PATH, JSON.stringify(books, null, 2), "utf-8");
}

export function addBook(book: Book): void {
  const books = readBooksFromJson() ?? [];
  books.push(book);
  writeBooksToJson(books);
}

export function updateBook(slug: string, updates: Partial<Book>): Book | null {
  const books = readBooksFromJson() ?? [];
  const index = books.findIndex((b) => b.slug === slug);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updates };
  writeBooksToJson(books);
  return books[index];
}

export function deleteBook(slug: string): boolean {
  const books = readBooksFromJson() ?? [];
  const filtered = books.filter((b) => b.slug !== slug);
  if (filtered.length === books.length) return false;
  writeBooksToJson(filtered);
  return true;
}
