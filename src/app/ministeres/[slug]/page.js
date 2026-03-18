"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

const ministereData = {
  // --- LES 3 PASTEURS ---
  "pasteur-principal": {
    titre: "Direction Pastorale",
    responsable: "Nom du 1er Pasteur",
    image: "/leaders/pasteur-principal.jpg",
    description: "Servir cette église est un honneur divin. En tant que pasteur principal, ma mission est de porter la vision et de guider notre famille spirituelle vers une maturité chrétienne profonde, fondée sur la vérité immuable de la Bible.",
    mission: "Bâtir des disciples pour l'éternité et porter la vision."
  },
  "pasteur-associe": {
    titre: "Direction Pastorale",
    responsable: "Nom du 2ème Pasteur",
    image: "/leaders/pasteur-associe.jpg",
    description: "Mon engagement est de soutenir la croissance spirituelle de chaque membre. À travers l'enseignement et l'accompagnement, nous veillons à ce que l'administration de la grâce de Dieu touche chaque foyer de notre communauté.",
    mission: "Soutenir la gestion spirituelle et administrative."
  },
  "pasteur-assistant": {
    titre: "Direction Pastorale",
    responsable: "Nom du 3ème Pasteur",
    image: "/leaders/pasteur-assistant.jpg",
    description: "Dédié à l'évangélisation et au soutien des ministères, je travaille pour que notre église soit une lumière dans la ville. Nous sommes ici pour servir, écouter et prier avec vous pour chaque défi de la vie.",
    mission: "Favoriser l'évangélisation et l'encadrement des membres."
  },

  // --- LES MINISTÈRES ---
  jeunesse: {
    titre: "Jeunesse",
    responsable: "Jean Dupont",
    image: "/leaders/jeunesse.jpg",
    description: "Nous croyons que la jeunesse est le cœur battant de l'église d'aujourd'hui. Nous organisons des rencontres dynamiques pour fortifier leur foi face aux défis du monde actuel.",
    mission: "Former des leaders intègres pour demain."
  },
  dames: {
    titre: "Dames",
    responsable: "Marie Claire",
    image: "/leaders/dames.jpg",
    description: "Un ministère dédié à l'épanouissement spirituel des femmes, par la prière, le partage et l'action sociale au sein de la communauté.",
    mission: "Unies dans la prière et le service."
  },
  hommes: {
    titre: "Hommes",
    responsable: "Nom du Responsable",
    image: "/leaders/hommes.jpg",
    description: "Le département des hommes se réunit pour encourager chaque membre à devenir un pilier de foi dans son foyer et dans la maison de Dieu.",
    mission: "Hommes de foi et piliers de l'église."
  },
  enfants: {
    titre: "Ministère des Enfants",
    responsable: "Nom de la Responsable", // TA MODIFICATION ICI
    image: "/leaders/enfants.jpg",
    description: "L'École du Dimanche est le fondement de la foi de nos petits. Notre responsable dévouée veille à ce que chaque enfant reçoive l'Évangile à travers des activités ludiques, des chants et un encadrement plein d'amour.",
    mission: "Découvrir la Bible par le jeu et l'amour."
  }
};

export default function MinistereDetail() {
  const { slug } = useParams();
  const data = ministereData[slug];

  // Gestion du cas où le slug n'existe pas
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-4">Ministère en cours de configuration...</h2>
        <Link href="/ministeres" className="text-[#d4af37] font-bold underline uppercase text-sm">Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec le titre du ministère */}
      <div className="bg-[#0f172a] py-24 text-center text-white">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic">
          {data.titre}
        </h1>
        <div className="h-1.5 w-24 bg-[#d4af37] mx-auto mt-6 shadow-glow"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-16">
        {/* Colonne Responsable */}
        <div className="md:col-span-1">
          <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 text-center sticky top-10 shadow-sm transition-all hover:shadow-md">
            <div className="w-40 h-40 bg-white rounded-full mx-auto mb-8 border-4 border-[#d4af37] overflow-hidden shadow-xl">
              {/* Image dynamique */}
              <img 
                src={data.image} 
                alt={data.responsable} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              />
            </div>
            <h3 className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.3em] mb-2 italic">Responsable</h3>
            <p className="text-2xl font-black text-[#0f172a] uppercase leading-tight">
              {data.responsable}
            </p>
          </div>
        </div>

        {/* Colonne Texte */}
        <div className="md:col-span-2 space-y-12">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-black text-[#0f172a] uppercase mb-6 flex items-center gap-4">
              Notre Mission
              <span className="h-1 flex-1 bg-slate-100"></span>
            </h2>
            <p className="text-2xl text-slate-400 italic font-medium leading-relaxed">
              "{data.mission}"
            </p>
          </section>
          
          {/* Description / À propos */}
          <section>
            <h2 className="text-3xl font-black text-[#0f172a] uppercase mb-6">À propos</h2>
            <div className="bg-white border-l-4 border-slate-100 pl-8">
               <p className="text-slate-600 text-lg leading-loose text-justify">
                {data.description}
              </p>
            </div>
          </section>

          {/* Bouton retour */}
          <div className="pt-12">
            <Link 
              href="/ministeres" 
              className="inline-flex items-center gap-3 text-[#d4af37] font-black text-sm uppercase tracking-widest hover:gap-6 transition-all group"
            >
              <span className="text-xl group-hover:scale-125 transition-transform">←</span> 
              Voir tous les ministères
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}