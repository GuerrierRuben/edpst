import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EventPage({ params }) {
  const { id } = await params;

  const result = await query('SELECT * FROM "Event" WHERE id = $1', [id]);
  const event = result.rows[0];

  if (!event) return notFound();

  return (
    // pt-32 permet de descendre le contenu sous ton menu fixe
    <main className="max-w-4xl mx-auto p-6 pt-32 min-h-screen">
      
      {/* BOUTON RETOUR : Bien visible avec un fond gris clair */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium text-sm"
        >
          ← Retour à l'accueil
        </Link>
      </div>

      <article className="bg-white rounded-3xl overflow-hidden">
        {event.image && (
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-sm mb-8" 
          />
        )}
        
        {/* TITRE : Taille réduite (text-3xl au lieu de text-5xl) */}
        <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
          {event.title}
        </h1>

        <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm mb-6">
          📅 {new Date(event.date).toLocaleDateString('fr-FR')}
        </div>

        <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

        <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
          {event.description}
        </div>
      </article>
    </main>
  );
}