"use client";
import { useState, useEffect, useCallback } from "react";
import { Trash2, Upload, ImageIcon, Filter, CheckCircle, AlertCircle, X, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "Culte dominical",
  "Etude biblique",
  "Jeune et priere",
  "Evenements"
];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("Tous");
  const [notification, setNotification] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
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

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
  });
  const [selectedImages, setSelectedImages] = useState([]); // Array of base64 strings
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?category=${filter}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Erreur lors du chargement des images", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [filter]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    
    for (const file of files) {
      if (file.size > 8 * 1024 * 1024) {
        showNotification(`${file.name} est trop lourde (max 8Mo)`, "error");
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'gallery');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        
        if (data.success) {
          newImages.push(data.url);
        } else {
          showNotification(`Erreur: ${data.error}`, "error");
        }
      } catch (error) {
        showNotification(`Erreur lors de l'upload de ${file.name}`, "error");
      }
    }

    if (newImages.length > 0) {
      setSelectedImages([...selectedImages, ...newImages]);
      showNotification(`${newImages.length} image(s) prête(s) à publier`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      showNotification("Veuillez selectionner au moins une image", "error");
      return;
    }

    setUploading(true);
    let successCount = 0;

    try {
      for (let i = 0; i < selectedImages.length; i++) {
        setCurrentUploadIndex(i + 1);
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            image: selectedImages[i]
          }),
        });

        if (res.ok) {
          successCount++;
        }
      }

      if (successCount === selectedImages.length) {
        showNotification(`${successCount} images ajoutees avec succes !`);
      } else {
        showNotification(`${successCount}/${selectedImages.length} images ajoutees.`, "warning");
      }
      
      setFormData({ title: "", category: CATEGORIES[0] });
      setSelectedImages([]);
      setCurrentUploadIndex(0);
      fetchImages();
    } catch (error) {
      showNotification("Erreur de connexion", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette image ?")) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showNotification("Image supprimee");
        fetchImages();
      } else {
        showNotification("Erreur lors de la suppression", "error");
      }
    } catch (error) {
      showNotification("Erreur de connexion", "error");
    }
  };

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

  const clearGallery = async () => {
    if (!confirm("ATTENTION : Voulez-vous vraiment supprimer TOUTES les images de la galerie ? Cette action est irréversible.")) return;
    
    try {
      const res = await fetch("/api/gallery/clear", { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        showNotification(data.message || "Galerie vidée avec succès");
        fetchImages();
      } else {
        showNotification(data.error || "Erreur lors de la suppression", "error");
      }
    } catch (error) {
      showNotification("Erreur de connexion", "error");
    }
  };

  return (
    <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestion de la Galerie</h1>
            <p className="text-gray-500 text-sm">Ajoutez et gerez les photos souvenir de l'eglise.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
              <Filter size={16} className="text-gray-400 ml-2" />
              <select 
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pr-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="Tous">Toutes les categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button
              onClick={clearGallery}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl border border-red-200 transition-all font-bold text-sm"
            >
              <AlertTriangle size={16} />
              Vider la galerie
            </button>
          </div>
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Upload size={20} className="text-indigo-600" /> Ajouter des photos
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Titre (Applique a toutes)</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-gray-50/30"
                  placeholder="Ex: Culte du dimanche 15 mars"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Categorie</label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-gray-50/30 font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="group">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 ml-1">Fichiers Photos</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[200px] overflow-hidden ${selectedImages.length > 0 ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-gray-200 hover:border-indigo-500 hover:bg-gray-50' }`}>
                   {selectedImages.length > 0 ? (
                     <div className="grid grid-cols-3 gap-2 w-full">
                       {selectedImages.map((img, idx) => (
                         <div key={idx} className="relative aspect-square">
                           <img src={img} className="w-full h-full object-cover rounded-lg" alt="Preview" loading="lazy" />
                         </div>
                       ))}
                       <button 
                         type="button" 
                         onClick={() => setSelectedImages([])}
                         className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600"
                       >
                         <X size={14} />
                       </button>
                     </div>
                   ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <ImageIcon size={24} className="text-gray-400 group-hover:text-indigo-600" />
                      </div>
                       <p className="text-xs text-gray-400 font-medium text-center px-4">Selectionnez plusieurs photos ou glissez-les ici (Max 8Mo/u)</p>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
                {selectedImages.length > 0 && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-2 text-center uppercase">
                    {selectedImages.length} photo(s) selectionnee(s)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg shadow-indigo-500/20 transition-all ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0' }`}
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Envoi de {currentUploadIndex} sur {selectedImages.length}...
                  </>
                ) : (
                  <>
                    <Upload size={18} /> Publier la selection
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div 
                  key={img.id} 
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                   <img 
                     src={img.image} 
                     alt={img.title || ""} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     loading="lazy"
                     decoding="async"
                   />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-xs font-bold mb-1 line-clamp-1">{img.title || "Sans titre"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300 font-medium px-2 py-0.5 border border-white/20 rounded-full">
                        {img.category}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id);
                        }}
                        className="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg transition-colors border border-white/10"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Aucune photo trouvee</h3>
              <p className="text-gray-500 text-sm">Commencez par ajouter des photos dans cette categorie ou en changeant le filtre.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
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

          {/* Indicateur de position */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
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

      {notification && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom border ${notification.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-emerald-500" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
