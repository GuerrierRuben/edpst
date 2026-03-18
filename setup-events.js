const { query } = require('./src/lib/db');

async function checkAndCreateEventTable() {
  try {
    console.log('🔍 Vérification de la table Event...');

    // Vérifier si la table existe
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Event'
      );
    `);

    if (tableExists.rows[0].exists) {
      console.log('✅ La table Event existe déjà');
      return;
    }

    console.log('📝 Création de la table Event...');

    // Créer la table Event
    await query(`
      CREATE TABLE "Event" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        time TEXT,
        location TEXT NOT NULL,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Table Event créée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkAndCreateEventTable();