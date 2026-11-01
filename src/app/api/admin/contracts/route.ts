import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readContracts, createContract, validateContract, type ContractInput } from "@/lib/contracts";

export async function GET() {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const contracts = readContracts().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json(contracts);
  } catch (e) {
    return NextResponse.json({ error: "Erreur lecture contrats", detail: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession()))
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = (await request.json()) as ContractInput;
    const error = validateContract(body);
    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(createContract(body));
  } catch (e) {
    return NextResponse.json({ error: "Erreur création contrat", detail: String(e) }, { status: 500 });
  }
}
