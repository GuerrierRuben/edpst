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