import Link from 'next/link';
import EventCard from "@/components/ui/EventCard";

export default function EventsSection({ events }) {
  if (!events || events.length === 0) {
    return (
      <section className="py-24 text-center bg-[#f8f8f8]">
        <p className="text-gray-400 text-lg">Aucun rendez-vous pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="section-title">Prochains Rendez-vous</h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full" style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)' }} />
        </div>

        {/* Grid */}
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
                  time={event.time || "À venir"}
                  description={event.description}
                  image={event.image}
                  category={event.category || "Événement"}
                />
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-block btn-primary"
          >
            Voir tous les événements →
          </Link>
        </div>
      </div>
    </section>
  );
}