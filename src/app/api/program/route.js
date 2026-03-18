import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    console.log('Fetching programs...');
    const result = await query('SELECT * FROM "Program" ORDER BY date_program ASC, time ASC');
    console.log('Programs fetched:', result.rows);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.log('Error fetching programs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { date_program, time, activity, leader, reader, messenger, announcer, prayer } = await request.json();
    const result = await query(
      'INSERT INTO "Program" (date_program, time, activity, leader, reader, messenger, announcer, prayer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [date_program, time, activity, leader, reader, messenger, announcer, prayer]
    );
    revalidatePath("/programme");
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, date_program, time, activity, leader, reader, messenger, announcer, prayer } = await request.json();
    const result = await query(
      'UPDATE "Program" SET date_program = $1, time = $2, activity = $3, leader = $4, reader = $5, messenger = $6, announcer = $7, prayer = $8 WHERE id = $9 RETURNING *',
      [date_program, time, activity, leader, reader, messenger, announcer, prayer, id]
    );
    revalidatePath("/programme");
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await query('DELETE FROM "Program" WHERE id = $1', [id]);
    revalidatePath("/programme");
    return NextResponse.json({ message: "Supprimé" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}