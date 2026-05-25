import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readSales, createSale, addPayment, getSalesToday, getSalesStats, getPendingSales } from "@/lib/sales";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const period = req.nextUrl.searchParams.get("period");
    const filter = req.nextUrl.searchParams.get("filter");

    let sales;
    if (filter === "pending") {
      sales = getPendingSales();
    } else if (period === "today") {
      sales = getSalesToday();
    } else {
      sales = readSales();
    }

    const stats = getSalesStats(period === "today" ? getSalesToday() : readSales());
    return NextResponse.json({ sales, stats });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lecture ventes", detail: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const body = await req.json();

    // Add payment to existing credit sale
    if (body.action === "add-payment") {
      const sale = addPayment(body.saleId, { amount: body.amount, method: body.method });
      if (!sale)
        return NextResponse.json({ error: "Vente introuvable ou déjà soldée" }, { status: 404 });
      return NextResponse.json(sale);
    }

    // Create new sale
    if (!body.items?.length)
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });

    const sale = createSale(body);
    return NextResponse.json(sale, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur enregistrement vente", detail: String(e) }, { status: 500 });
  }
}
