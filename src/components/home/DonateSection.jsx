export default function DonateSection() {
  return (
    <section className="py-20 bg-[#0f172a] text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Soutenir la Vision</h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Votre générosité nous permet de continuer à servir notre ville, de soutenir les plus démunis et de diffuser le message d'espoir.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { amount: "20€", desc: "Soutien aux activités jeunesse" },
            { amount: "50€", desc: "Aide alimentaire communautaire" },
            { amount: "100€", desc: "Diffusion des cultes en ligne" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#d4af37] transition cursor-pointer group">
              <div className="text-3xl font-bold text-[#d4af37] mb-2">{item.amount}</div>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <button className="bg-[#d4af37] text-[#0f172a] font-bold py-4 px-12 rounded-full hover:scale-105 transition-transform">
          Faire un don personnalisé
        </button>
      </div>
    </section>
  );
}