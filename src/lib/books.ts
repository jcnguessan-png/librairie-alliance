import {
  books as staticBooks,
  categories,
  type Book,
  type BookCategory,
} from "@/data/books";
import { readBooksFromJson } from "./books-json";
import { fetchBooksFromNotion } from "./notion";

export { categories };
export type { Book, BookCategory };

// ─── Cache ──────────────────────────────────────────────────────────

let cachedBooks: Book[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5_000; // 5 seconds — short to reflect admin changes quickly

function isCacheValid(): boolean {
  return cachedBooks !== null && Date.now() - cacheTimestamp < CACHE_TTL;
}

// ─── Data access ────────────────────────────────────────────────────

export async function getAllBooks(): Promise<Book[]> {
  if (isCacheValid()) return cachedBooks!;

  // 1. Try reading from local JSON file (admin-managed data)
  const jsonBooks = readBooksFromJson();
  if (jsonBooks && jsonBooks.length > 0) {
    cachedBooks = jsonBooks;
    cacheTimestamp = Date.now();
    return jsonBooks;
  }

  // 2. Try Notion
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_BOOKS_DATABASE_ID;

  if (apiKey && dbId) {
    try {
      const books = await fetchBooksFromNotion();
      if (books.length > 0) {
        cachedBooks = books;
        cacheTimestamp = Date.now();
        return books;
      }
    } catch (error) {
      console.error("[books] Notion fetch failed:", error);
    }
  }

  // 3. Fallback to static data
  return staticBooks;
}

export async function getBookBySlug(
  slug: string
): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((b) => b.slug === slug);
}

export async function getBooksByCategory(
  category: BookCategory
): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter((b) => b.category === category);
}

export async function getFeaturedBook(): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((b) => b.featured);
}

export async function getComingSoonBooks(): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter((b) => b.status === "coming-soon");
}

export async function getAvailableBooks(): Promise<Book[]> {
  const books = await getAllBooks();
  return books.filter((b) => b.status === "available");
}

export function invalidateCache(): void {
  cachedBooks = null;
  cacheTimestamp = 0;
}
