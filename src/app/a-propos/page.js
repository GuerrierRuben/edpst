export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Style Église */}
      <div className="bg-[#0f172a] py-16 text-center">
        <h1 className="text-4xl font-black text-white uppercase tracking-widest">À propos de nous</h1>
        <div className="h-1 w-20 bg-[#d4af37] mx-auto mt-4"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Notre Vision</h2>
        <p className="mb-8">
          Bienvenue à l'Église de Dieu de la Prophétie de Saint-Thérèse. Nous sommes une communauté 
          dédiée à la transformation des vies par l'Évangile.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-[#d4af37]">
            <h3 className="font-bold text-[#0f172a] mb-2 uppercase text-sm">Notre Mission</h3>
            <p className="text-sm">Prêcher la parole, aimer notre prochain et servir notre communauté avec intégrité.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-[#d4af37]">
            <h3 className="font-bold text-[#0f172a] mb-2 uppercase text-sm">Nos Valeurs</h3>
            <p className="text-sm">La foi, la prière, la famille et l'excellence dans le service pour le Seigneur.</p>
          </div>
        </div>
      </div>
    </div>
  );
}