import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readBooksFromJson, addBook } from "@/lib/books-json";
import { invalidateCache } from "@/lib/books";
import { books as staticBooks } from "@/data/books";
import type { Book } from "@/data/books";

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const books = readBooksFromJson() ?? staticBooks;
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Titre et slug sont requis" },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = readBooksFromJson() ?? staticBooks;
    if (existing.some((b) => b.slug === body.slug)) {
      return NextResponse.json(
        { error: "Un livre avec ce slug existe déjà" },
        { status: 409 }
      );
    }

    const book: Book = {
      slug: body.slug,
      title: body.title,
      author: body.author || "Pasteur Alexandre Amazou",
      category: body.category || "livre-papier",
      status: body.status || "available",
      featured: body.featured || false,
      badge: body.badge || undefined,
      price: body.price ?? null,
      formats: body.formats || ["papier"],
      audioExcerpt: body.audioExcerpt || null,
      amazonLink: body.amazonLink || null,
      description: body.description || "",
      longDescription: body.longDescription || undefined,
      coverImage: body.coverImage || "/images/books/placeholder.svg",
      pages: body.pages ?? null,
      year: body.year ?? null,
      isbn: body.isbn || undefined,
    };

    addBook(book);
    invalidateCache();

    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Données invalides" },
      { status: 400 }
    );
  }
}
