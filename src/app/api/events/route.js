import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query('SELECT * FROM "Event" ORDER BY date DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération des événements" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('📝 Nouvelle requête POST pour créer un événement');

    const body = await request.json();
    console.log('📦 Données reçues:', Object.keys(body));

    const { title, date, time, location, description, image } = body;

    console.log('🔍 Validation des champs requis...');
    if (!title || !date || !location || !description || !image) {
      console.log('❌ Champs manquants:', { title: !!title, date: !!date, location: !!location, description: !!description, image: !!image });
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    console.log('💾 Insertion dans la base de données...');
    const result = await query(
      'INSERT INTO "Event" (title, date, time, location, description, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, date, time, location, description, image]
    );

    console.log('✅ Événement créé avec succès:', result.rows[0].id);
    return NextResponse.json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    return NextResponse.json({ error: "Erreur lors de la création de l'événement" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, date, time, location, description, image } = body;

    if (!id || !title || !date || !location || !description) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const result = await query(
      `UPDATE "Event" 
       SET title = $1, date = $2, time = $3, location = $4, description = $5, image = COALESCE($6, image)
       WHERE id = $7 RETURNING *`,
      [title, date, time, location, description, image, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error('Events PUT error:', error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const result = await query('DELETE FROM "Event" WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Événement supprimé" });
  } catch (error) {
    console.error('Events DELETE error:', error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}