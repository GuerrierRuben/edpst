import { query } from "@/lib/db"; 
import Hero from "@/components/home/Hero";
import BlogSection from "@/components/home/BlogSection";
import LatestSermon from "@/components/home/LatestSermon";
import EventsSection from "@/components/home/EventsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const dynamic = 'force-dynamic';

export default async function Page() {
  try {
    const [postRes, eventRes, sermonRes] = await Promise.all([
      query('SELECT * FROM "Post" ORDER BY "createdAt" DESC LIMIT 6'),
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
        <NewsletterSection />
        <BlogSection posts={posts} />
        <LatestSermon sermons={sermons} />
      </main>
    );
  } catch (err) {
    console.error(err);
    return <p className="text-center py-20 text-gray-500">Erreur de connexion à la base de données.</p>;
  }
}