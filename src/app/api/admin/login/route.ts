import { NextResponse } from "next/server";
import { verifyPassword, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const session = await createAdminSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(
      session.name,
      session.value,
      session.options as Parameters<typeof response.cookies.set>[2]
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
