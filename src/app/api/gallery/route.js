import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { del } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    let sql = 'SELECT * FROM "Gallery" ORDER BY "createdAt" DESC';
    let params = [];
    
    if (category && category !== 'Tous') {
      sql = 'SELECT * FROM "Gallery" WHERE category = $1 ORDER BY "createdAt" DESC';
      params = [category];
    }
    
    // Ajouter LIMIT si spécifié
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        sql += ` LIMIT $${params.length + 1}`;
        params.push(limitNum);
      }
    }
    
    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({ error: "Erreur lors de la récupération de la galerie" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, image, category } = body;

    if (!image || !category) {
      return NextResponse.json({ error: "L'image et la catégorie sont requises" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const result = await query(
      'INSERT INTO "Gallery" (id, title, image, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, title || '', image, category]
    );

    return NextResponse.json({ success: true, image: result.rows[0] });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: "Erreur lors de l'ajout à la galerie" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    // Récupérer l'image avant de supprimer
    const result = await query('SELECT * FROM "Gallery" WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Image non trouvée" }, { status: 404 });
    }

    const image = result.rows[0];

    // Supprimer de Vercel Blob Storage
    try {
      const imageUrl = image.image;
      if (imageUrl) {
        // Extraire le filename de l'URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        if (filename) {
          await del(filename);
          console.log('File deleted from Vercel Blob:', filename);
        }
      }
    } catch (blobError) {
      console.error('Error deleting from Vercel Blob:', blobError);
      // Continue même si la suppression du blob échoue
    }

    // Supprimer de la base de données
    await query('DELETE FROM "Gallery" WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: "Image supprimée" });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
