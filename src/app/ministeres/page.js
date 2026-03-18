import Link from "next/link";

export default function MinistriesPage() {
  // Liste des 3 Pasteurs
  const leaders = [
    { title: "Pasteur Principal", name: "Pasteur Titulaire", slug: "pasteur-principal", desc: "Visionnaire et berger de la communauté." },
    { title: "Pasteur Associé", name: "Deuxième Pasteur", slug: "pasteur-associe", desc: "Soutien spirituel et administration de l'église." },
    { title: "Pasteur Assistant", name: "Troisième Pasteur", slug: "pasteur-assistant", desc: "En charge de l'évangélisation et de la prière." }
  ];

  const groups = [
    { title: "Jeunesse", slug: "jeunesse", desc: "Former la prochaine génération de leaders." },
    { title: "Dames", slug: "dames", desc: "Unies dans la prière et le service." },
    { title: "Hommes", slug: "hommes", desc: "Hommes de foi et piliers de l'église." },
    { title: "Enfants", slug: "enfants", desc: "Découvrir la Bible par le jeu et l'amour avec notre responsable dédiée." }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-[#0f172a] py-20 text-center text-white">
        <h1 className="text-4xl font-black uppercase tracking-widest">Leadership & Ministères</h1>
        <div className="h-1 w-20 bg-[#d4af37] mx-auto mt-4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION LES 3 PASTEURS (Grille 3 colonnes) */}
        <div className="mt-16 mb-24 text-center">
          <h2 className="text-2xl font-black text-[#0f172a] uppercase mb-12 italic border-b-2 border-slate-100 pb-4 inline-block">Direction de l'Église</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {leaders.map((p, i) => (
              <Link href={`/ministeres/${p.slug}`} key={i} className="group">
                <div className="bg-slate-50 border-2 border-[#d4af37] p-8 rounded-[3rem] group-hover:bg-[#0f172a] transition-all duration-500 shadow-lg h-full">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 border-4 border-white overflow-hidden shadow-md">
                    <img src={`/leaders/${p.slug}.jpg`} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-black text-[#0f172a] group-hover:text-[#d4af37] uppercase leading-tight">{p.name}</h3>
                  <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest mt-2">{p.title}</p>
                  <p className="text-slate-500 group-hover:text-slate-300 mt-4 italic text-sm">"{p.desc}"</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION MINISTÈRES (Grille 4 colonnes) */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#0f172a] uppercase mb-12 italic border-b-2 border-slate-100 pb-4 inline-block">Nos Départements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {groups.map((g, i) => (
              <Link href={`/ministeres/${g.slug}`} key={i} className="group">
                <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] group-hover:bg-[#0f172a] transition-all duration-300 shadow-sm group-hover:shadow-2xl h-full flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-[#d4af37] rounded-full mb-6 flex items-center justify-center text-white font-black text-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-black uppercase text-[#0f172a] group-hover:text-[#d4af37] mb-2">{g.title}</h3>
                  <p className="text-sm text-slate-500 group-hover:text-slate-300">{g.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}