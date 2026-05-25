import { readFileSync, writeFileSync, existsSync, accessSync, constants } from "fs";
import { join, dirname } from "path";
import type { Book } from "@/data/books";

const DATA_PATH = join(process.cwd(), "data", "books.json");
const TMP_PATH = process.platform === "win32"
  ? join(process.env.TEMP || "C:\\Temp", "librairie-books.json")
  : "/tmp/librairie-books.json";

function isWritable(filePath: string): boolean {
  try {
    accessSync(dirname(filePath), constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function getWritePath(): string {
  return isWritable(DATA_PATH) ? DATA_PATH : TMP_PATH;
}

export function readBooksFromJson(): Book[] | null {
  // Try primary path first, then fallback
  for (const p of [DATA_PATH, TMP_PATH]) {
    try {
      if (!existsSync(p)) continue;
      const raw = readFileSync(p, "utf-8");
      const books = JSON.parse(raw) as Book[];
      if (books.length > 0) return books;
    } catch { /* try next */ }
  }
  return null;
}

export function writeBooksToJson(books: Book[]): void {
  const path = getWritePath();
  writeFileSync(path, JSON.stringify(books, null, 2), "utf-8");
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
