"use client";
import { useState, useEffect } from "react";
import { Filter, ImageIcon, X, Maximize2, Share2, Camera } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const CATEGORIES = [
  "Tous",
  "Culte dominical",
  "Etude biblique",
  "Jeune et priere",
  "Evenements"
];

export default function GaleriePage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async (e, img) => {
    e.stopPropagation(); // Empecher l'ouverture de la lightbox si on clique sur partager
    const shareData = {
      title: img.title || "Photo Galerie - EDPST",
      text: `Decouvrez cette photo de l'eglise EDPST : ${img.title || ""}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Lien de la galerie copie !");
      }
    } catch (err) {
      console.error("Erreur de partage:", err);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?category=${activeCategory}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
            <Camera size={14} /> Notre Galerie
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Souvenirs de notre <span style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)', stroke: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communaute</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Parcourez les moments forts de notre eglise a travers notre galerie photos.
            Vivez et revivez nos moments de culte et de partage.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 overflow-x-auto pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 -translate-y-0.5"
                  : "bg-white text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <div 
                key={img.id} 
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 cursor-zoom-in"
                onClick={() => setSelectedImage(img)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <img 
                  src={img.image} 
                  alt={img.title || ""} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Info Card */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase py-1 px-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20">
                      {img.category}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                    {img.title || "Sans titre"}
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="flex-1 bg-white hover:bg-gray-100 text-slate-900 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <Maximize2 size={12} /> Agrandir
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, img)}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucune photo trouvee</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Desole, nous n'avons pas encore de photos a afficher dans la categorie <b>{activeCategory}</b>.
            </p>
            <button 
              onClick={() => setActiveCategory("Tous")}
              className="mt-8 text-indigo-600 font-bold hover:underline"
            >
              Afficher toutes les photos
            </button>
          </div>
        )}
      </main>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors h-12 w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full"
          >
            <X size={28} />
          </button>
          
          <div className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center gap-6">
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title || ""} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5" 
            />
            
            <div className="text-center">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest py-1 px-4 bg-indigo-600 text-white rounded-full mb-3">
                {selectedImage.category}
              </span>
              <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight">
                {selectedImage.title || "Souvenir de l'eglise"}
              </h2>
              <p className="text-white/40 mt-1 text-sm">
                Ajoutee le {new Date(selectedImage.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={(e) => handleShare(e, selectedImage)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-all border border-white/20"
                >
                  <Share2 size={18} /> Partager cette photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 shadow-2xl text-white px-6 py-3 rounded-full font-bold text-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast}
        </div>
      )}

      {/* Footer Area / Call to action */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm font-medium">EDPST - Eglise de Dieu Parole Salut pour Tous</p>
        </div>
      </footer>
    </div>
  );
}
