import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { unlinkSync, readdirSync, rmSync } from "fs";
import { join } from "path";

export async function DELETE() {
  try {
    // Récupérer toutes les images pour supprimer les fichiers physiques
    const result = await query('SELECT image FROM "Gallery"');
    const images = result.rows;
    
    // Supprimer les fichiers physiques
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'gallery');
    try {
      const files = readdirSync(uploadsDir);
      files.forEach(file => {
        try {
          unlinkSync(join(uploadsDir, file));
        } catch (err) {
          console.error(`Erreur suppression fichier ${file}:`, err);
        }
      });
    } catch (err) {
      console.log('Dossier uploads/gallery vide ou inexistant');
    }
    
    // Supprimer toutes les images de la table Gallery
    const deleteResult = await query('DELETE FROM "Gallery"');
    
    return NextResponse.json({ 
      success: true, 
      message: `${deleteResult.rowCount} images supprimées de la base de données et du dossier uploads/gallery`
    });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json({ 
      error: "Erreur lors de la suppression des images" 
    }, { status: 500 });
  }
}
