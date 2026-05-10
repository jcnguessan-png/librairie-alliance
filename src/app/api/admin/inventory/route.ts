import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readInventory, upsertInventory, type BookInventory } from "@/lib/inventory";

export async function GET() {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    return NextResponse.json(readInventory());
  } catch (e) {
    return NextResponse.json({ error: "Erreur lecture inventaire", detail: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = (await req.json()) as BookInventory;
    if (!body.slug)
      return NextResponse.json({ error: "Slug requis" }, { status: 400 });

    const saved = upsertInventory(body);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ error: "Erreur sauvegarde inventaire", detail: String(e) }, { status: 500 });
  }
}
