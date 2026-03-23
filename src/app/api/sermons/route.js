import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const result = await query('SELECT id, title, speaker, category, date, "videoUrl", thumbnail FROM "Sermon" ORDER BY id DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('API /api/sermons POST called');
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const speaker = formData.get('speaker');
    const category = formData.get('category');
    const date = formData.get('date');
    const videoUrl = formData.get('videoUrl');
    const thumbnailFile = formData.get('thumbnail');
    
    if (!title || !speaker || !category || !date || !videoUrl) {
      console.log('Missing required fields');
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }
    
    // Handle file upload
    let thumbnailPath = '';
    if (thumbnailFile) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const filename = `sermon-${Date.now()}-${thumbnailFile.name}`;
      const uploadDir = join(process.cwd(), 'public', 'images', 'sermons');
      
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });
      
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      thumbnailPath = `/images/sermons/${filename}`;
    }
    
    console.log('Executing INSERT query...');
    const result = await query(
      'INSERT INTO "Sermon" (title, speaker, category, date, "videoUrl", thumbnail) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, speaker, category, date, videoUrl, thumbnailPath]
    );
    console.log('INSERT successful:', result.rows[0]);
    revalidatePath("/sermons");
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const speaker = formData.get('speaker');
    const category = formData.get('category');
    const date = formData.get('date');
    const videoUrl = formData.get('videoUrl');
    const thumbnailFile = formData.get('thumbnail');

    if (!id || !title || !speaker || !category || !date || !videoUrl) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    let thumbnailPath = null;
    if (thumbnailFile && typeof thumbnailFile !== 'string') {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `sermon-${Date.now()}-${thumbnailFile.name}`;
      const uploadDir = join(process.cwd(), 'public', 'images', 'sermons');
      await mkdir(uploadDir, { recursive: true });
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      thumbnailPath = `/images/sermons/${filename}`;
    }

    const result = await query(
      `UPDATE "Sermon" 
       SET title = $1, speaker = $2, category = $3, date = $4, "videoUrl" = $5, 
           thumbnail = COALESCE($6, thumbnail)
       WHERE id = $7 RETURNING *`,
      [title, speaker, category, date, videoUrl, thumbnailPath, id]
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