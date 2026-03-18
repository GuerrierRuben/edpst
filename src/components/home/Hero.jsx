import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(13,13,26,0.80) 40%, rgba(13,13,26,0.35))' }} />

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Ambiance église"
      />

      {/* Content */}
      <div className="relative z-20 text-center px-4 w-full">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Bienvenue à la{' '}
          <span style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Maison
          </span>
        </h1>
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Une communauté vibrante pour découvrir la foi, trouver l'espoir et vivre l'amour de Dieu chaque jour.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/programme"
            className="btn-primary text-base"
          >
            Prochain Culte : Dimanche 10h
          </Link>
          <Link
            href="/sermons"
            className="bg-white/15 backdrop-blur-md text-white border border-white/30 px-8 py-3.5 rounded-full hover:bg-white/25 transition-all duration-300 text-center font-medium"
          >
            Voir nos messages
          </Link>
        </div>
      </div>
    </section>
  );
}