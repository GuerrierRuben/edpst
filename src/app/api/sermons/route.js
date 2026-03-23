import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const result = await query('SELECT id, title, speaker, category, date, "videoUrl", thumbnail FROM "Sermon" ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('API /api/sermons POST called (Base64 Mode)');
  try {
    const body = await request.json();
    const { title, speaker, category, date, videoUrl, thumbnail } = body;
    
    if (!title || !speaker || !category || !date || !videoUrl) {
      console.log('Missing required fields');
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    
    console.log('Executing INSERT query...');
    const result = await query(
      'INSERT INTO "Sermon" (title, speaker, category, date, "videoUrl", thumbnail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, speaker, category, date, videoUrl, thumbnail || '']
    );
    console.log('INSERT successful:', result.rows[0].id);
    revalidatePath("/sermons");
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, speaker, category, date, videoUrl, thumbnail } = body;

    if (!id || !title || !speaker || !category || !date || !videoUrl) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const result = await query(
      `UPDATE "Sermon" 
       SET title = $1, speaker = $2, category = $3, date = $4, "videoUrl" = $5, 
           thumbnail = COALESCE($6, thumbnail)
       WHERE id = $7 RETURNING *`,
      [title, speaker, category, date, videoUrl, thumbnail, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Sermon non trouvé" }, { status: 404 });
    }

    revalidatePath("/sermons");
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const result = await query('DELETE FROM "Sermon" WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Sermon non trouvé" }, { status: 404 });
    }

    revalidatePath("/sermons");
    return NextResponse.json({ success: true, message: "Sermon supprimé" });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}