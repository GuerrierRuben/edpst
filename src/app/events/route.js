import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';

// Le bloc "export const config" a été supprimé pour éviter l'erreur de dépréciation.

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Extraction des données
    const { title, description, date, location, image, time } = body;

    // Insertion SQL propre
    const result = await query(
      'INSERT INTO "Event" (title, description, date, location, image, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, date, location, image || null, time || null]
    );
    
    // On force la mise à jour de l'accueil et du dashboard
    revalidatePath('/'); 
    revalidatePath('/admin/events');

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Erreur SQL détaillée :", error.message);
    return NextResponse.json(
      { error: "Erreur Base de données : " + error.message }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await query('SELECT * FROM "Event" ORDER BY date ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}