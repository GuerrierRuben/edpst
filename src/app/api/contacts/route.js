import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  console.log('API /api/contacts GET called');
  try {
    const result = await query('SELECT * FROM "Contact" ORDER BY "createdAt" DESC');
    console.log('Contacts found:', result.rows.length);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Contacts GET error:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO "Contact" (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    return NextResponse.json({ success: true, message: result.rows[0] });
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ error: "Erreur lors de l'envoi du message" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    const result = await query(
      'UPDATE "Contact" SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Message non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: result.rows[0] });
  } catch (error) {
    console.error('Contact PUT error:', error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}