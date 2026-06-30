"use client";
import { useState, useEffect, useCallback } from "react";
import { Filter, ImageIcon, X, Maximize2, Share2, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

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
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Bloquer le scroll quand la lightbox est ouverte
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async (e, img) => {
    e.stopPropagation(); // Empecher l'ouverture de la lightbox si on clique sur partager
    const shareData = {
      title: img.title || "Photo Galerie - Église de Dieu Salut Pour Tous",
      text: `Decouvrez cette photo de l'Église de Dieu Salut Pour Tous : ${img.title || ""}`,
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

  const openLightbox = (index) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Gestion du swipe tactile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Gestion du clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-orange-100">
            <Camera size={14} /> Notre Galerie
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Souvenirs de notre <span style={{ background: 'linear-gradient(135deg, #FFB830, #F79400)', stroke: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communaute</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Parcourez les moments forts de l'Église de Dieu Salut Pour Tous à travers notre galerie photos.
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
                  : "bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:text-orange-600 hover:bg-gray-50"
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
                onClick={() => openLightbox(i)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Image
                  src={img.image}
                  alt={img.title || ""}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
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
               className="mt-8 text-orange-600 font-bold hover:underline"
            >
              Afficher toutes les photos
            </button>
          </div>
        )}
      </main>

      {/* Lightbox / Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* Bouton précédent */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Bouton suivant */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image container avec swipe */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative w-full h-full max-w-6xl max-h-screen p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]?.image}
                alt={images[selectedIndex]?.title || `Photo ${selectedIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Info et partage */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest py-1 px-4 bg-orange-600 text-white rounded-full mb-3">
              {images[selectedIndex]?.category}
            </span>
            <h2 className="text-white text-xl md:text-2xl font-extrabold tracking-tight mb-2">
              {images[selectedIndex]?.title || "Souvenir de l'Église de Dieu Salut Pour Tous"}
            </h2>
            <button 
              onClick={(e) => handleShare(e, images[selectedIndex])}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-bold transition-all border border-white/20 mx-auto"
            >
              <Share2 size={16} /> Partager cette photo
            </button>
          </div>

          {/* Indicateur de position */}
          {images.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === selectedIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
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
            <p className="text-gray-400 text-sm font-medium">Église de Dieu Salut Pour Tous</p>
          </div>
        </footer>
    </div>
  );
}
