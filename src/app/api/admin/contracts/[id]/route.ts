import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateContract, deleteContract, validateContract, type ContractInput } from "@/lib/contracts";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { id } = await params;
    const body = (await request.json()) as ContractInput;
    const error = validateContract(body);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const updated = updateContract(id, body);
    if (!updated)
      return NextResponse.json({ error: "Contrat introuvable" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Erreur modification contrat", detail: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const { id } = await params;
    if (!deleteContract(id))
      return NextResponse.json({ error: "Contrat introuvable" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur suppression contrat", detail: String(e) }, { status: 500 });
  }
}
