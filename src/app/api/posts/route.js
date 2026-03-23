import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// GET : Récupérer tous les articles pour l'admin
export async function GET() {
  try {
    const result = await query('SELECT * FROM "Post" ORDER BY "createdAt" DESC');
    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}

// POST : Créer un nouvel article
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const excerpt = formData.get('excerpt');
    const content = formData.get('content');
    const author = formData.get('author');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    if (!title || !author || !category) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    let imagePath = "";
    if (imageFile && typeof imageFile !== 'string') {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `blog-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = join(process.cwd(), 'public', 'images', 'posts');
      
      await mkdir(uploadDir, { recursive: true });
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      imagePath = `/images/posts/${filename}`;
    } else if (typeof imageFile === 'string') {
      imagePath = imageFile;
    }

    const sql = `
      INSERT INTO "Post" (title, excerpt, content, author, category, image)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await query(sql, [title, excerpt, content, author, category, imagePath]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("API POST Error:", err);
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }
}

// PUT : Modifier un article
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const title = formData.get('title');
    const excerpt = formData.get('excerpt');
    const content = formData.get('content');
    const author = formData.get('author');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    let imagePath = formData.get('existingImage') || "";
    
    if (imageFile && typeof imageFile !== 'string') {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = `blog-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = join(process.cwd(), 'public', 'images', 'posts');
      
      await mkdir(uploadDir, { recursive: true });
      const filepath = join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      imagePath = `/images/posts/${filename}`;
    } else if (typeof imageFile === 'string' && imageFile !== "") {
      imagePath = imageFile;
    }

    const sql = `
      UPDATE "Post" 
      SET title=$1, excerpt=$2, content=$3, author=$4, category=$5, image=$6 
      WHERE id=$7 RETURNING *`;

    const result = await query(sql, [title, excerpt, content, author, category, imagePath, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("API PUT Error:", err);
    return NextResponse.json({ error: "Erreur de modification" }, { status: 500 });
  }
}

// DELETE : Supprimer un article
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Support ?id=... style

    // Also support restful path if implemented in next.js dynamic route,
    // but here we are in route.js so searchParams is safer if client uses ?id=
    // However, existing client code used /api/posts/${id}. 
    // Usually that requires [id]/route.js structure.
    // BUT, the existing code in admin/blog/page.js used: fetch(`/api/posts/${id}`, { method: "DELETE" });
    // This implies there IS a dynamic route folder [id]!

    // WAIT. If /api/posts/${id} works, then there must be a folder `src/app/api/posts/[id]/route.js`.
    // Let me check that before I break things.

    // If I put DELETE here in `api/posts/route.js`, it handles allow DELETE on `/api/posts?id=...`.
    // It does NOT handle `/api/posts/123`.

    // Let me check if `src/app/api/posts/[id]` exists.
    if (!id) {
      // If I can't find ID in searchParams, maybe I should return 400.
      // But if the user's code calls /api/posts/123, it won't hit THIS file (route.js in api/posts).
      // It would hit api/posts/[id]/route.js.
      return NextResponse.json({ error: "ID requis (via ?id=)" }, { status: 400 });
    }

    const result = await query('DELETE FROM "Post" WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
  }
}