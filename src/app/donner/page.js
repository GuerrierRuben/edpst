export default function GivePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header sombre signature */}
      <div className="bg-[#0f172a] py-20 text-center text-white">
        <h1 className="text-4xl font-black uppercase tracking-widest">Donner</h1>
        <p className="text-[#d4af37] mt-3 italic">"Dieu aime celui qui donne avec joie."</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
          {/* Icône de construction animée ou stylisée */}
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl animate-pulse">🛠️</span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">
            Fonctionnalité en cours de développement
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Nous préparons une plateforme sécurisée pour vos dîmes et offrandes en ligne. 
            Revenez bientôt pour contribuer à l'œuvre de Dieu d'un simple clic.
          </p>

          {/* Petit rappel des méthodes physiques en attendant */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              En attendant : Les dons physiques sont acceptés lors de nos services du dimanche.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <a href="/" className="text-[#d4af37] font-bold text-xs uppercase tracking-widest hover:underline">
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}