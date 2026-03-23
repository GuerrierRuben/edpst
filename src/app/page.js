import { query } from "@/lib/db"; 
import Hero from "@/components/home/Hero";
import BlogSection from "@/components/home/BlogSection";
import LatestSermon from "@/components/home/LatestSermon";
import EventCard from "@/components/ui/EventCard";
import Link from "next/link"; // Importation pour rendre les cartes cliquables

// On force la page à se rafraîchir à chaque visite
export const dynamic = 'force-dynamic';

function EventsSection({ events }) {
  if (!events || events.length === 0) return null;
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Prochains Rendez-vous</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const dateObj = new Date(event.date);
            return (
              <Link href={`/events/${event.id}`} key={event.id} className="block group">
                <EventCard 
                  date={{ 
                    day: dateObj.getDate(), 
                    month: dateObj.toLocaleString('fr-FR', { month: 'short' }).toUpperCase() 
                  }}
                  title={event.title}
                  description={event.description}
                  image={event.image} // N'oublie pas de passer l'image !
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default async function Page() {
  try {
    const [postRes, eventRes, sermonRes] = await Promise.all([
      query('SELECT * FROM "Post" ORDER BY "createdAt" DESC LIMIT 6'),
      // ON SUPPRIME LE LIMIT 2 OU ON L'AUGMENTE (ex: LIMIT 12)
      query('SELECT * FROM "Event" ORDER BY "date" ASC LIMIT 12'), 
      query('SELECT * FROM "Sermon" ORDER BY id DESC LIMIT 2'),
    ]);

    const posts = postRes.rows;
    const events = eventRes.rows;
    const sermons = sermonRes.rows;

    return (
      <main>
        <Hero />
        <EventsSection events={events} />
        <BlogSection posts={posts} />
        <LatestSermon sermons={sermons} />
      </main>
    );
  } catch (err) {
    console.error(err);
    return <p className="text-center py-20">Erreur de connexion à la base de données.</p>;
  }
}