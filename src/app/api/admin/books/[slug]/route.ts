import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateBook, deleteBook } from "@/lib/books-json";
import { invalidateCache } from "@/lib/books";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const updated = updateBook(slug, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Livre introuvable" },
        { status: 404 }
      );
    }

    invalidateCache();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Données invalides" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = deleteBook(slug);

  if (!deleted) {
    return NextResponse.json(
      { error: "Livre introuvable" },
      { status: 404 }
    );
  }

  invalidateCache();
  return NextResponse.json({ success: true });
}
