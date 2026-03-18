import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await query('DELETE FROM "Post" WHERE id = $1', [id]);
    return NextResponse.json({ message: "Supprimé avec succès" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}