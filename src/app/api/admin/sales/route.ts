import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readSales, createSale, getSalesToday, getSalesStats } from "@/lib/sales";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const period = req.nextUrl.searchParams.get("period");
  const sales = period === "today" ? getSalesToday() : readSales();
  const stats = getSalesStats(sales);
  return NextResponse.json({ sales, stats });
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  if (!body.items?.length)
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });

  const sale = createSale(body);
  return NextResponse.json(sale, { status: 201 });
}
