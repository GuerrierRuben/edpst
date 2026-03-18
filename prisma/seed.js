const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Début du remplissage de la base de données...');

  // 1. Nettoyage des données existantes (Optionnel mais recommandé au début)
  await prisma.post.deleteMany();
  await prisma.sermon.deleteMany();

  // 2. Insertion des Articles de Blog
  const posts = await prisma.post.createMany({
    data: [
      {
        title: "Comment méditer la Bible quotidiennement ?",
        excerpt: "5 conseils pratiques pour approfondir votre relation avec Dieu.",
        content: "Contenu complet de l'article ici...",
        author: "Pasteur Marc",
        category: "Vie Spirituelle",
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800"
      },
      {
        title: "L'importance de la communauté",
        excerpt: "Pourquoi nous avons besoin les uns des autres pour grandir.",
        content: "Le corps du Christ est une famille...",
        author: "Sœur Sarah",
        category: "Communauté",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800"
      }
    ]
  });

  // 3. Insertion des Sermons
  const sermons = await prisma.sermon.createMany({
    data: [
      {
        title: "Bâtir sur le Roc",
        speaker: "Pasteur Jean-Marc",
        category: "Foi",
        date: "21 Jan 2026",
        videoUrl: "https://youtube.com/watch?v=exemple1",
        thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800"
      }
    ]
  });

  console.log(`Base de données peuplée avec succès !`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });