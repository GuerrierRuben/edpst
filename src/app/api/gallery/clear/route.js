import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { del } from '@vercel/blob';

export const runtime = 'nodejs';

export async function DELETE() {
  try {
    // Récupérer toutes les images pour supprimer les fichiers de Vercel Blob
    const result = await query('SELECT image FROM "Gallery"');
    const images = result.rows;
    
    // Supprimer les fichiers de Vercel Blob Storage
    let deletedCount = 0;
    for (const image of images) {
      try {
        const imageUrl = image.image;
        if (imageUrl) {
          // Extraire le filename de l'URL
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          if (filename) {
            await del(filename);
            deletedCount++;
            console.log('File deleted from Vercel Blob:', filename);
          }
        }
      } catch (blobError) {
        console.error('Error deleting from Vercel Blob:', blobError);
        // Continue même si la suppression du blob échoue
      }
    }
    
    // Supprimer toutes les images de la table Gallery
    const deleteResult = await query('DELETE FROM "Gallery"');
    
    return NextResponse.json({ 
      success: true, 
      message: `${deleteResult.rowCount} images supprimées de la base de données et ${deletedCount} fichiers supprimés de Vercel Blob`
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ 
      error: "Erreur lors de la suppression des images" 
    }, { status: 500 });
  }
}
