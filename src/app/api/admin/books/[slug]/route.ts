import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateBook, deleteBook } from "@/lib/books-json";
import { invalidateCache } from "@/lib/books";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { slug } = await params;
    const body = await request.json();
    const updated = updateBook(slug, body);
    if (!updated)
      return NextResponse.json({ error: "Livre introuvable" }, { status: 404 });
    invalidateCache();
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Erreur modification livre", detail: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { slug } = await params;
    const deleted = deleteBook(slug);
    if (!deleted)
      return NextResponse.json({ error: "Livre introuvable" }, { status: 404 });
    invalidateCache();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur suppression livre", detail: String(e) }, { status: 500 });
  }
}
