"use client";
import { useState, useEffect } from "react";
import { Trash2, Upload, ImageIcon, Filter, CheckCircle, AlertCircle, X } from "lucide-react";

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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [];
    let processedCount = 0;

    files.forEach(file => {
      if (file.size > 8 * 1024 * 1024) {
        showNotification(`${file.name} est trop lourde (max 8Mo)`, "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        processedCount++;
        if (processedCount === files.length) {
          setSelectedImages([...selectedImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion de la Galerie</h1>
          <p className="text-gray-500 text-sm">Ajoutez et gerez les photos souvenir de l'eglise.</p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
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
                          <img src={img} className="w-full h-full object-cover rounded-lg" alt="Preview" />
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

        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                  <img 
                    src={img.image} 
                    alt={img.title || ""} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-xs font-bold mb-1 line-clamp-1">{img.title || "Sans titre"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-300 font-medium px-2 py-0.5 border border-white/20 rounded-full">
                        {img.category}
                      </span>
                      <button 
                        onClick={() => handleDelete(img.id)}
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

      {notification && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom border ${notification.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} className="text-red-500" /> : <CheckCircle size={20} className="text-emerald-500" />}
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
