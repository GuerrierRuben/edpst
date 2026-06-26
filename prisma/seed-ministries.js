// Script pour initialiser les ministères par défaut
// Exécuter avec: node prisma/seed-ministries.js

const { query } = require('./../src/lib/db');

async function seedMinistries() {
  try {
    console.log('🌱 Début de l\'initialisation des ministères...\n');

    // Liste des 3 Pasteurs (Direction de l'Église)
    const leaders = [
      {
        name: "Pasteur Principal",
        description: "Visionnaire et berger de la communauté.",
        leaderName: "Pasteur Titulaire",
        leaderRole: "Pasteur Principal",
        leaderImage: "/leaders/pasteur-principal.jpg"
      },
      {
        name: "Pasteur Associé",
        description: "Soutien spirituel et administration de l'église.",
        leaderName: "Deuxième Pasteur",
        leaderRole: "Pasteur Associé",
        leaderImage: "/leaders/pasteur-associe.jpg"
      },
      {
        name: "Pasteur Assistant",
        description: "En charge de l'évangélisation et de la prière.",
        leaderName: "Troisième Pasteur",
        leaderRole: "Pasteur Assistant",
        leaderImage: "/leaders/pasteur-assistant.jpg"
      }
    ];

    // Liste des Ministères (Départements)
    const groups = [
      {
        name: "Jeunesse",
        description: "Former la prochaine génération de leaders.",
        leaderName: "Responsable Jeunesse",
        leaderRole: "Coordinateur",
        leaderImage: ""
      },
      {
        name: "Dames",
        description: "Unies dans la prière et le service.",
        leaderName: "Responsable Dames",
        leaderRole: "Responsable",
        leaderImage: ""
      },
      {
        name: "Hommes",
        description: "Hommes de foi et piliers de l'église.",
        leaderName: "Responsable Hommes",
        leaderRole: "Responsable",
        leaderImage: ""
      },
      {
        name: "Enfants",
        description: "Découvrir la Bible par le jeu et l'amour avec notre responsable dédiée.",
        leaderName: "Responsable Enfants",
        leaderRole: "Responsable",
        leaderImage: ""
      }
    ];

    const allMinistries = [...leaders, ...groups];

    // Vérifier si la table existe
    try {
      await query('SELECT COUNT(*) FROM "Ministry"');
    } catch (error) {
      console.error('❌ Erreur: La table Ministry n\'existe pas dans la base de données.');
      console.log('📝 Veuillez exécuter le SQL suivant dans Supabase:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS "Ministry" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "leaderName" TEXT NOT NULL,
  "leaderRole" TEXT,
  "leaderImage" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
      `);
      process.exit(1);
    }

    // Insérer les ministères
    for (const ministry of allMinistries) {
      try {
        const result = await query(
          `INSERT INTO "Ministry" (name, description, leaderName, leaderRole, leaderImage, isActive, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) 
           ON CONFLICT DO NOTHING
           RETURNING *`,
          [ministry.name, ministry.description, ministry.leaderName, ministry.leaderRole, ministry.leaderImage]
        );
        
        if (result.rows.length > 0) {
          console.log(`✅ Ministère créé: ${ministry.name} (${ministry.leaderName})`);
        } else {
          console.log(`⚠️  Ministère déjà existant: ${ministry.name}`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la création de ${ministry.name}:`, error.message);
      }
    }

    // Afficher le résumé
    const countResult = await query('SELECT COUNT(*) FROM "Ministry"');
    const count = countResult.rows[0].count;
    
    console.log(`\n✨ Initialisation terminée!`);
    console.log(`📊 Total ministères dans la base de données: ${count}`);
    console.log(`\n💡 Vous pouvez maintenant:`);
    console.log(`   1. Aller sur /admin/ministeres`);
    console.log(`   2. Modifier les ministères existants`);
    console.log(`   3. Ajouter les photos des responsables`);
    console.log(`   4. Créer de nouveaux ministères si nécessaire`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

// Exécuter le script
seedMinistries();