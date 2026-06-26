import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Récupérer un ministère par ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM "Ministry" WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Ministère non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du ministère:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du ministère' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un ministère
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, leaderName, leaderRole, leaderImage, isActive } = body;

    const result = await query(
      `UPDATE "Ministry" 
       SET name = $1, description = $2, leaderName = $3, leaderRole = $4, 
           leaderImage = $5, isActive = $6, "updatedAt" = NOW() 
       WHERE id = $7 
       RETURNING *`,
      [name, description, leaderName, leaderRole, leaderImage, isActive, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du ministère:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du ministère' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un ministère
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await query('DELETE FROM "Ministry" WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Ministère supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du ministère:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du ministère' },
      { status: 500 }
    );
  }
}