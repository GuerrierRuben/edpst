"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProgrammePublic() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/program?t=${Date.now()}`, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' } 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Trouver la date la plus récente
          const validData = data.filter(item => item.date_program);
          if (validData.length > 0) {
            const latestDate = validData.reduce((max, item) => item.date_program > max ? item.date_program : max, validData[0].date_program);
            // Récupérer tous les éléments de cette date, triés par heure
            const latestProgrammes = validData.filter(item => item.date_program === latestDate).sort((a, b) => a.time.localeCompare(b.time));
            setProgrammes(latestProgrammes);
          } else {
            setProgrammes([]);
          }
        } else {
          setProgrammes([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur base de données:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-20 text-slate-500 font-bold">Connexion à la base de données...</div>;
  
  if (!programmes || programmes.length === 0) return (
    <div className="text-center p-20">
      <p className="text-slate-500">Aucune donnée trouvée.</p>
      <Link href="/" className="text-[#d4af37] underline mt-4 block">Retour</Link>
    </div>
  );

  // Formatage de la date à partir de date_program du premier élément
  const dateAffichee = programmes[0].date_program 
    ? new Date(programmes[0].date_program).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    : "Date non définie";

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-white border border-slate-100">
        
        {/* EN-TÊTE DYNAMIQUE */}
        <div className="bg-[#0f172a] text-white p-10 text-center border-b-4 border-[#d4af37]">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Culte à l'église</h1>
          <p className="text-[#d4af37] font-medium capitalize text-xl">{dateAffichee}</p>
        </div>

        {/* SECTION ACTIVITÉS */}
        <div className="p-8 md:p-12 bg-white">
           <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase mb-8 text-center">
             Déroulement du Service
           </p>
           
          <div className="space-y-6">
            {programmes.map((item, index) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                {/* Heure formatée */}
                <div className="font-black text-emerald-600 text-3xl md:text-4xl">
                  {item.time ? item.time.replace(':', 'h') : "--h--"}
                </div>

                {/* Barre de séparation verticale visible uniquement sur PC */}
                <div className="hidden md:block w-px h-12 bg-slate-200"></div>

                {/* Activité et Intervenants */}
                <div className="flex-1">
                  <h2 className="font-black text-slate-800 text-xl md:text-2xl uppercase tracking-tighter leading-tight">
                    {item.activity || "ACTIVITÉ"}
                  </h2>
                  <div className="mt-3 space-y-1">
                    {item.leader && (
                      <p className="text-base md:text-lg text-slate-500 font-medium italic">
                        🎤 Dirigeant : <span className="text-slate-900 font-bold not-italic">{item.leader}</span>
                      </p>
                    )}
                    {item.messenger && (
                      <p className="text-base md:text-lg text-slate-500 font-medium italic">
                        📖 Messager : <span className="text-slate-900 font-bold not-italic">{item.messenger}</span>
                      </p>
                    )}
                    {item.reader && (
                      <p className="text-base md:text-lg text-slate-500 font-medium italic">
                        📚 Lecteur : <span className="text-slate-900 font-bold not-italic">{item.reader}</span>
                      </p>
                    )}
                    {item.announcer && (
                      <p className="text-base md:text-lg text-slate-500 font-medium italic">
                        📣 Annonceur : <span className="text-slate-900 font-bold not-italic">{item.announcer}</span>
                      </p>
                    )}
                    {item.prayer && (
                      <p className="text-base md:text-lg text-slate-500 font-medium italic">
                        🙏 Prière : <span className="text-slate-900 font-bold not-italic">{item.prayer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/" className="text-slate-400 hover:text-[#d4af37] transition font-medium">
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}