import { NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'ministries'; // 'ministries' ou 'gallery'

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WebP.' },
        { status: 400 }
      );
    }

    // Vérifier la taille (8MB max)
    const maxSize = 8 * 1024 * 1024; // 8MB en bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum: 8MB.' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}-${timestamp}.${extension}`;

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', type);
    try {
      mkdirSync(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier
    const filepath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    writeFileSync(filepath, buffer);

    // Retourner l'URL publique
    const publicUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    const errorMessage = error.message || 'Erreur lors de l\'upload du fichier';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
