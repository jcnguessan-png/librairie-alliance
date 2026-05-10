import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readInventory, upsertInventory, type BookInventory } from "@/lib/inventory";

export async function GET() {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(readInventory());
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as BookInventory;
  if (!body.slug)
    return NextResponse.json({ error: "Slug requis" }, { status: 400 });

  const saved = upsertInventory(body);
  return NextResponse.json(saved);
}
