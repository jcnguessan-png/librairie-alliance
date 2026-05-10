import { Client } from "@notionhq/client";
import type { Book, BookStatus, BookFormat, BookCategory } from "@/data/books";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionPage = any;

let notionClient: Client | null = null;

function getClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_API_KEY });
  }
  return notionClient;
}

// ─── Property extractors ────────────────────────────────────────────

function getTitle(page: NotionPage, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "title") {
    return prop.title.map((t: { plain_text: string }) => t.plain_text).join("") || "";
  }
  return "";
}

function getRichText(page: NotionPage, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t: { plain_text: string }) => t.plain_text).join("") || "";
  }
  return "";
}

function getSelect(page: NotionPage, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "select") {
    return prop.select?.name ?? null;
  }
  return null;
}

function getMultiSelect(page: NotionPage, key: string): string[] {
  const prop = page.properties[key];
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s: { name: string }) => s.name);
  }
  return [];
}

function getCheckbox(page: NotionPage, key: string): boolean {
  const prop = page.properties[key];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

function getNumber(page: NotionPage, key: string): number | null {
  const prop = page.properties[key];
  if (prop?.type === "number") {
    return prop.number;
  }
  return null;
}

function getUrl(page: NotionPage, key: string): string | null {
  const prop = page.properties[key];
  if (prop?.type === "url") {
    return prop.url;
  }
  return null;
}

// ─── Mapping ────────────────────────────────────────────────────────

const VALID_STATUSES: BookStatus[] = [
  "available",
  "out-of-stock",
  "preorder",
  "coming-soon",
];
const VALID_CATEGORIES: BookCategory[] = [
  "livre-papier",
  "ebook",
  "livre-audio",
  "bible",
  "kids-ado",
  "accessoire",
];
const VALID_FORMATS: BookFormat[] = ["papier", "ebook", "audio"];

function mapPageToBook(page: NotionPage): Book | null {
  const slug = getRichText(page, "Slug");
  if (!slug) return null; // Skip entries without a slug

  const title = getTitle(page, "Title");
  if (!title) return null;

  const rawStatus = getSelect(page, "Status");
  const status: BookStatus = VALID_STATUSES.includes(rawStatus as BookStatus)
    ? (rawStatus as BookStatus)
    : "available";

  const rawCategory = getSelect(page, "Category");
  const category: BookCategory = VALID_CATEGORIES.includes(
    rawCategory as BookCategory
  )
    ? (rawCategory as BookCategory)
    : "livre-papier";

  const rawFormats = getMultiSelect(page, "Formats");
  const formats: BookFormat[] = rawFormats.filter((f): f is BookFormat =>
    VALID_FORMATS.includes(f as BookFormat)
  );

  const coverFilename = getRichText(page, "Cover Filename");

  return {
    slug,
    title,
    author: getRichText(page, "Author") || "Pasteur Alexandre Amazou",
    category,
    status,
    featured: getCheckbox(page, "Featured"),
    badge: getRichText(page, "Badge") || undefined,
    price: getNumber(page, "Price"),
    formats: formats.length > 0 ? formats : ["papier"],
    audioExcerpt: getUrl(page, "Audio Excerpt"),
    amazonLink: getUrl(page, "Amazon Link"),
    description: getRichText(page, "Description"),
    longDescription: getRichText(page, "Long Description") || undefined,
    coverImage: coverFilename
      ? `/images/books/${coverFilename}`
      : "/images/books/placeholder.svg",
    pages: getNumber(page, "Pages"),
    year: getNumber(page, "Year"),
    isbn: getRichText(page, "ISBN") || undefined,
  };
}

// ─── Fetch ──────────────────────────────────────────────────────────

export async function fetchBooksFromNotion(): Promise<Book[]> {
  const notion = getClient();
  const databaseId = process.env.NOTION_BOOKS_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_BOOKS_DATABASE_ID is not set");
  }

  const books: Book[] = [];
  let cursor: string | undefined = undefined;

  do {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notion.dataSources.query({
      data_source_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (page.object !== "page" || !("properties" in page)) continue;
      const book = mapPageToBook(page as NotionPage);
      if (book) books.push(book);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return books;
}
