import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Récupérer tous les ministères
export async function GET() {
  try {
    const result = await query('SELECT * FROM "Ministry" ORDER BY "createdAt" DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des ministères:', error);
    // Si la table n'existe pas, retourner un tableau vide
    return NextResponse.json([]);
  }
}

// POST - Créer un nouveau ministère
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, leaderName, leaderRole, leaderImage } = body;

    if (!name || !leaderName) {
      return NextResponse.json(
        { error: 'Le nom du ministère et le nom du responsable sont requis' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO "Ministry" (name, description, leaderName, leaderRole, leaderImage, isActive, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) 
       RETURNING *`,
      [name, description, leaderName, leaderRole, leaderImage]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du ministère:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du ministère' },
      { status: 500 }
    );
  }
}